import 'dotenv/config';
import express from 'express';
import { GoogleAuth } from 'google-auth-library';
import rateLimit from 'express-rate-limit';
import { WebSocketServer, WebSocket } from 'ws';
import fetch from 'node-fetch';

const DEFAULT_PROXY_HEADER = '-4ieLWr4vtlEKTRDMJgbGRXajVAVEaa-';
const IS_SERVERLESS_RUNTIME = Boolean(process?.env?.VERCEL);

const app = express();
app.use(express.json({ limit: process?.env?.API_PAYLOAD_MAX_SIZE || '7mb' }));
app.set('trust proxy', 1);

const auth = new GoogleAuth({
  scopes: ['https://www.googleapis.com/auth/cloud-platform'],
});

function getRuntimeConfig() {
  const GOOGLE_CLOUD_LOCATION = process?.env?.GOOGLE_CLOUD_LOCATION;
  const GOOGLE_CLOUD_PROJECT = process?.env?.GOOGLE_CLOUD_PROJECT;
  const PROXY_HEADER = process?.env?.PROXY_HEADER || DEFAULT_PROXY_HEADER;

  const missing = [];
  if (!GOOGLE_CLOUD_PROJECT) missing.push('GOOGLE_CLOUD_PROJECT');
  if (!GOOGLE_CLOUD_LOCATION) missing.push('GOOGLE_CLOUD_LOCATION');

  return {
    GOOGLE_CLOUD_LOCATION,
    GOOGLE_CLOUD_PROJECT,
    PROXY_HEADER,
    isValid: missing.length === 0,
    missing,
  };
}

const proxyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: 'Too many requests',
    message: 'You have exceed the request limit, please try again later.',
  },
});

app.use('/api-proxy', proxyLimiter);

function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function parsePattern(pattern) {
  const paramRegex = /\{\{(.*?)\}\}/g;
  const params = [];
  const parts = [];
  let lastIndex = 0;
  let match;

  while ((match = paramRegex.exec(pattern)) !== null) {
    params.push(match[1]);
    const literalPart = pattern.substring(lastIndex, match.index);
    parts.push(escapeRegex(literalPart));
    parts.push(`(?<${match[1]}>[^/]+)`);
    lastIndex = paramRegex.lastIndex;
  }
  parts.push(escapeRegex(pattern.substring(lastIndex)));

  return { regex: new RegExp(`^${parts.join('')}$`), params };
}

function extractParams(patternInfo, url) {
  const match = url.match(patternInfo.regex);
  if (!match) return null;

  const params = {};
  patternInfo.params.forEach((paramName, index) => {
    params[paramName] = match[index + 1];
  });
  return params;
}

const API_CLIENT_MAP = [
  {
    name: 'VertexGenAi:generateContent',
    patternForProxy: 'https://aiplatform.googleapis.com/{{version}}/publishers/google/models/{{model}}:generateContent',
    getApiEndpoint: (context, params) => {
      return `https://aiplatform.clients6.google.com/${params.version}/projects/${context.projectId}/locations/${context.region}/publishers/google/models/${params.model}:generateContent`;
    },
    isStreaming: false,
    transformFn: null,
  },
  {
    name: 'VertexGenAi:predict',
    patternForProxy: 'https://aiplatform.googleapis.com/{{version}}/publishers/google/models/{{model}}:predict',
    getApiEndpoint: (context, params) => {
      return `https://aiplatform.clients6.google.com/${params.version}/projects/${context.projectId}/locations/${context.region}/publishers/google/models/${params.model}:predict`;
    },
    isStreaming: false,
    transformFn: null,
  },
  {
    name: 'VertexGenAi:streamGenerateContent',
    patternForProxy: 'https://aiplatform.googleapis.com/{{version}}/publishers/google/models/{{model}}:streamGenerateContent',
    getApiEndpoint: (context, params) => {
      return `https://aiplatform.clients6.google.com/${params.version}/projects/${context.projectId}/locations/${context.region}/publishers/google/models/${params.model}:streamGenerateContent`;
    },
    isStreaming: true,
    transformFn: (response) => {
      let normalizedResponse = response.trim();
      while (normalizedResponse.startsWith(',') || normalizedResponse.startsWith('[')) {
        normalizedResponse = normalizedResponse.substring(1).trim();
      }
      while (normalizedResponse.endsWith(',') || normalizedResponse.endsWith(']')) {
        normalizedResponse = normalizedResponse.substring(0, normalizedResponse.length - 1).trim();
      }

      if (!normalizedResponse.length) {
        return { result: null, inProgress: false };
      }

      if (!normalizedResponse.endsWith('}')) {
        return { result: normalizedResponse, inProgress: true };
      }

      const parsedResponse = JSON.parse(`${normalizedResponse}`);
      const transformedResponse = `data: ${JSON.stringify(parsedResponse)}\n\n`;
      return { result: transformedResponse, inProgress: false };
    },
  },
  {
    name: 'ReasoningEngine:query',
    patternForProxy: 'https://{{endpoint_location}}-aiplatform.googleapis.com/{{version}}/projects/{{project_id}}/locations/{{location_id}}/reasoningEngines/{{engine_id}}:query',
    getApiEndpoint: (_context, params) => {
      return `https://${params.endpoint_location}-aiplatform.clients6.google.com/v1beta1/projects/${params.project_id}/locations/${params.location_id}/reasoningEngines/${params.engine_id}:query`;
    },
    isStreaming: false,
    transformFn: null,
  },
  {
    name: 'ReasoningEngine:streamQuery',
    patternForProxy: 'https://{{endpoint_location}}-aiplatform.googleapis.com/{{version}}/projects/{{project_id}}/locations/{{location_id}}/reasoningEngines/{{engine_id}}:streamQuery',
    getApiEndpoint: (_context, params) => {
      return `https://${params.endpoint_location}-aiplatform.clients6.google.com/v1beta1/projects/${params.project_id}/locations/${params.location_id}/reasoningEngines/${params.engine_id}:streamQuery`;
    },
    isStreaming: true,
    transformFn: null,
  },
].map((client) => ({ ...client, patternInfo: parsePattern(client.patternForProxy) }));

async function getAccessToken(res) {
  try {
    const authClient = await auth.getClient();
    const token = await authClient.getAccessToken();
    return token.token;
  } catch (error) {
    console.error('[Node Proxy] Authentication error:', error);
    if (!res) return null;

    if (
      error.code === 'ERR_GCLOUD_NOT_LOGGED_IN' ||
      (error.message && error.message.includes('Could not load the default credentials'))
    ) {
      res.status(401).json({
        error: 'Authentication Required',
        message:
          'Google Cloud Application Default Credentials not found or invalid. Please run "gcloud auth application-default login" and try again.',
      });
    } else {
      res.status(500).json({ error: `Authentication failed: ${error.message}` });
    }

    return null;
  }
}

function getRequestHeaders(accessToken, projectId) {
  return {
    Authorization: `Bearer ${accessToken}`,
    'X-Goog-User-Project': projectId,
    'Content-Type': 'application/json',
  };
}

app.post('/api-proxy', async (req, res) => {
  const config = getRuntimeConfig();
  if (!config.isValid) {
    return res.status(500).json({
      error: 'Server configuration error',
      message: `Missing env vars: ${config.missing.join(', ')}`,
    });
  }

  if (req.headers['x-app-proxy'] !== config.PROXY_HEADER) {
    return res.status(403).send('Forbidden: Request must originate from the Vertex App shim.');
  }

  const { originalUrl, method, headers, body } = req.body;
  if (!originalUrl) {
    return res.status(400).send('Bad Request: originalUrl is required.');
  }

  const apiClient = API_CLIENT_MAP.find((p) => {
    req.extractedParams = extractParams(p.patternInfo, originalUrl);
    return req.extractedParams !== null;
  });

  if (!apiClient) {
    return res.status(404).json({ error: `No proxy handler found for URL: ${originalUrl}` });
  }

  const extractedParams = req.extractedParams;

  try {
    const accessToken = await getAccessToken(res);
    if (!accessToken) return;

    const context = {
      projectId: config.GOOGLE_CLOUD_PROJECT,
      region: config.GOOGLE_CLOUD_LOCATION,
    };
    const apiUrl = apiClient.getApiEndpoint(context, extractedParams);

    const apiHeaders = getRequestHeaders(accessToken, config.GOOGLE_CLOUD_PROJECT);
    const apiFetchOptions = {
      method: method || 'POST',
      headers: { ...apiHeaders, ...headers },
      body: body || undefined,
    };

    const apiResponse = await fetch(apiUrl, apiFetchOptions);

    if (apiClient.isStreaming) {
      res.writeHead(apiResponse.status, {
        'Content-Type': 'text/event-stream',
        'Transfer-Encoding': 'chunked',
        Connection: 'keep-alive',
      });
      res.flushHeaders();

      if (!apiResponse.body) {
        return res.end(JSON.stringify({ error: 'Streaming response body is null' }));
      }

      const decoder = new TextDecoder();
      let deltaChunk = '';

      apiResponse.body.on('data', (encodedChunk) => {
        if (res.writableEnded) return;

        try {
          if (!apiClient.transformFn) {
            res.write(encodedChunk);
          } else {
            const decodedChunk = decoder.decode(encodedChunk, { stream: true });
            deltaChunk += decodedChunk;

            const { result, inProgress } = apiClient.transformFn(deltaChunk);
            if (result && !inProgress) {
              deltaChunk = '';
              res.write(new TextEncoder().encode(result));
            }
          }
        } catch (error) {
          console.error(`[Node Proxy] Error processing streaming response for ${apiClient.name}`, error);
        }
      });

      apiResponse.body.on('end', () => {
        deltaChunk = '';
        res.end();
      });

      apiResponse.body.on('error', (streamError) => {
        if (!res.writableEnded) {
          res.end(
            JSON.stringify({
              proxyError: 'Stream error from Vertex AI',
              details: streamError.message,
            }),
          );
        }
      });

      res.on('error', (resError) => {
        if (apiResponse.body && typeof apiResponse.body.destroy === 'function') {
          apiResponse.body.destroy(resError);
        }
      });

      return;
    }

    const data = await apiResponse.json();
    return res.status(apiResponse.status).json(data);
  } catch (error) {
    return res.status(500).json({ error: error?.message || 'Unknown proxy error' });
  }
});

app.all('/ws-proxy', (_req, res) => {
  return res.status(501).json({
    error: 'WebSocket proxy is not available in serverless mode',
    message: 'Deploy this backend as a stateful Node server if ws-proxy is required.',
  });
});

app.get('/health', (_req, res) => {
  const config = getRuntimeConfig();
  return res.json({
    status: 'ok',
    mode: 'http-proxy',
    wsProxySupported: !IS_SERVERLESS_RUNTIME,
    envReady: config.isValid,
    missingEnv: config.missing,
  });
});

export function attachWebSocketProxy(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', async (request, socket, head) => {
    const config = getRuntimeConfig();
    if (!config.isValid) {
      socket.destroy();
      return;
    }

    const url = new URL(request.url, `http://${request.headers.host}`);
    if (url.pathname !== '/ws-proxy') {
      socket.destroy();
      return;
    }

    let targetUrl = url.searchParams.get('target');
    if (!targetUrl) {
      socket.destroy();
      return;
    }

    if (
      targetUrl ===
      'wss://aiplatform.googleapis.com//ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent'
    ) {
      const location =
        config.GOOGLE_CLOUD_LOCATION === 'global' ? 'us-central1' : config.GOOGLE_CLOUD_LOCATION;
      targetUrl = `wss://${location}-aiplatform.googleapis.com//ws/google.cloud.aiplatform.v1beta1.LlmBidiService/BidiGenerateContent`;
    } else {
      socket.destroy();
      return;
    }

    let accessToken;
    try {
      accessToken = await getAccessToken();
      if (!accessToken) throw new Error('No token');
    } catch {
      socket.destroy();
      return;
    }

    let upstreamWs;
    try {
      upstreamWs = new WebSocket(targetUrl, {
        headers: getRequestHeaders(accessToken, config.GOOGLE_CLOUD_PROJECT),
      });
    } catch {
      socket.destroy();
      return;
    }

    const initialErrorHandler = (error) => {
      upstreamWs.removeEventListener('open', onUpstreamOpen);
      if (socket.writable) {
        socket.write('HTTP/1.1 502 Bad Gateway\r\n\r\n');
        socket.destroy();
      }
      console.error('[Node Proxy] Upstream connection failed:', error);
    };

    upstreamWs.once('error', initialErrorHandler);

    const onUpstreamOpen = () => {
      upstreamWs.removeListener('error', initialErrorHandler);
      wss.handleUpgrade(request, socket, head, (ws) => {
        upstreamWs.on('message', (data, isBinary) => {
          if (ws.readyState === WebSocket.OPEN && data !== undefined && data !== null) {
            ws.send(data, { binary: isBinary });
          }
        });

        ws.on('message', (data) => {
          let dataJson = {};
          try {
            dataJson = JSON.parse(data.toString());
          } catch {
            ws.close(1011, 'Failed to parse message');
            return;
          }

          if (dataJson.setup) {
            dataJson.setup.model = `projects/${config.GOOGLE_CLOUD_PROJECT}/locations/${config.GOOGLE_CLOUD_LOCATION}/${dataJson.setup.model}`;
          }

          if (upstreamWs.readyState === WebSocket.OPEN) {
            upstreamWs.send(JSON.stringify(dataJson), { binary: false });
          }
        });

        upstreamWs.on('error', (error) => {
          ws.close(1011, error.message);
        });

        upstreamWs.on('close', (code, reason) => {
          if (ws.readyState === WebSocket.OPEN) {
            ws.close(code, reason);
          }
        });

        ws.on('error', (error) => {
          upstreamWs.close(1011, error.message);
        });

        ws.on('close', (_code, reason) => {
          if (upstreamWs.readyState === WebSocket.OPEN) {
            upstreamWs.close(1000, reason);
          }
        });

        wss.emit('connection', ws, request);
      });
    };

    upstreamWs.once('open', onUpstreamOpen);
  });
}

export default app;
