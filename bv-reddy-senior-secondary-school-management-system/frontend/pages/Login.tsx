import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { AlertCircle, KeyRound, Lock, Mail, Smartphone } from 'lucide-react';
import { RecaptchaVerifier, type ConfirmationResult } from 'firebase/auth';
import { auth } from '../firebase';

type LoginMode = 'password' | 'google' | 'phone';

export const Login: React.FC = () => {
  const [mode, setMode] = useState<LoginMode>('password');
  const [email, setEmail] = useState('admin@bvreddyschool.in');
  const [password, setPassword] = useState('password123');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const recaptchaVerifierRef = useRef<RecaptchaVerifier | null>(null);

  const { login, loginWithGoogle, requestPhoneOtp, verifyPhoneOtp } = useAuth();
  const navigate = useNavigate();

  const ensureRecaptchaVerifier = () => {
    if (recaptchaVerifierRef.current) {
      return recaptchaVerifierRef.current;
    }

    const verifier = new RecaptchaVerifier(auth, 'phone-login-recaptcha', {
      size: 'invisible',
    });
    recaptchaVerifierRef.current = verifier;
    return verifier;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMessage('');
    try {
      await login(email, password);
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Invalid credentials. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await loginWithGoogle();
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to sign in with Google.';
      if (message.toLowerCase().includes('approval')) {
        setSuccessMessage(message);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) {
      setError('Please enter your phone number with country code.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      const verifier = ensureRecaptchaVerifier();
      const confirmation = await requestPhoneOtp(phone.trim(), verifier);
      setConfirmationResult(confirmation);
      setSuccessMessage('OTP sent successfully. Enter the code to continue.');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Unable to send OTP right now.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!confirmationResult) {
      setError('Please request OTP first.');
      return;
    }

    if (!otp.trim()) {
      setError('Please enter OTP.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccessMessage('');

    try {
      await verifyPhoneOtp(confirmationResult, otp.trim());
      navigate('/');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'OTP verification failed.';
      if (message.toLowerCase().includes('approval')) {
        setSuccessMessage(message);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="bg-white px-8 py-4 rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center min-h-[100px] min-w-[280px]">
            <img 
              src="https://www.bvreddyschool.in/images/logo.png" 
              alt="BV Reddy Senior Secondary School" 
              className="h-16 sm:h-20 w-auto object-contain"
              referrerPolicy="no-referrer"
            />
          </div>
        </div>
        <h2 className="mt-6 text-center text-2xl sm:text-3xl font-extrabold text-brand-navy tracking-tight">
          Management Portal
        </h2>
        <p className="mt-2 text-center text-sm text-slate-600">
          Sign in to your account <br/>
          <span className="text-xs text-brand-500 font-medium">(Firebase Auth Enabled)</span>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-xl sm:px-10 border border-slate-100">
          <div className="grid grid-cols-3 gap-2 mb-6">
            <button
              type="button"
              onClick={() => {
                setMode('password');
                setError('');
                setSuccessMessage('');
              }}
              className={`text-xs sm:text-sm px-3 py-2 rounded-lg border ${
                mode === 'password' ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              Password
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('google');
                setError('');
                setSuccessMessage('');
              }}
              className={`text-xs sm:text-sm px-3 py-2 rounded-lg border ${
                mode === 'google' ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              Google
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('phone');
                setError('');
                setSuccessMessage('');
              }}
              className={`text-xs sm:text-sm px-3 py-2 rounded-lg border ${
                mode === 'phone' ? 'bg-brand-800 text-white border-brand-800' : 'bg-white text-slate-600 border-slate-200'
              }`}
            >
              Phone OTP
            </button>
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-start mb-6">
              <AlertCircle className="w-5 h-5 text-red-500 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md mb-6">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {mode === 'password' && (
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-slate-700">
                Email address
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  required
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-colors"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700">
                Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  required
                  className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-colors"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-brand-800 focus:ring-brand-500 border-slate-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <button type="button" onClick={() => alert('Password reset link sent to email.')} className="font-medium text-brand-800 hover:text-brand-600">
                  Forgot your password?
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-800 hover:bg-brand-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
          )}

          {mode === 'google' && (
            <div className="space-y-4">
              <p className="text-sm text-slate-600">Use your school-linked Google account to request access.</p>
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className={`w-full flex justify-center items-center py-2.5 px-4 border border-slate-300 rounded-lg shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#4285F4] text-white text-xs font-bold mr-2">G</span>
                {loading ? 'Please wait...' : 'Continue with Google'}
              </button>
            </div>
          )}

          {mode === 'phone' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Phone Number</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Smartphone className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="tel"
                    placeholder="+91XXXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="button"
                onClick={handleSendOtp}
                disabled={loading}
                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-800 hover:bg-brand-900 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {loading ? 'Sending OTP...' : 'Send OTP'}
              </button>

              {confirmationResult && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-slate-700">OTP</label>
                    <div className="mt-1 relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <KeyRound className="h-5 w-5 text-slate-400" />
                      </div>
                      <input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="focus:ring-brand-500 focus:border-brand-500 block w-full pl-10 sm:text-sm border-slate-300 rounded-lg py-2.5 border outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-green hover:brightness-95 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {loading ? 'Verifying...' : 'Verify OTP & Sign in'}
                  </button>
                </>
              )}

              <div id="phone-login-recaptcha" />
            </div>
          )}
          
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-slate-500">
                  Access Flow
                </span>
              </div>
            </div>
            <div className="mt-4 text-center text-xs text-slate-500">
              Google and phone logins create requests that Principal Admin can approve in Settings.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
