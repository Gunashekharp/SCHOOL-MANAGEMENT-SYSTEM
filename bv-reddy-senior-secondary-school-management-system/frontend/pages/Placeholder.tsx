import React from 'react';
import { Construction } from 'lucide-react';

interface Props {
  title: string;
  description?: string;
}

export const Placeholder: React.FC<Props> = ({ title, description }) => {
  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)] p-6 text-center">
      <div className="w-24 h-24 bg-brand-50 rounded-full flex items-center justify-center mb-6">
        <Construction className="w-12 h-12 text-brand-500" />
      </div>
      <h1 className="text-3xl font-bold text-brand-navy mb-2">{title} Module</h1>
      <p className="text-slate-500 max-w-md">
        {description || `The ${title} module is currently under development as part of the premium suite. It will include features specified in the CBSE requirements.`}
      </p>
      <button className="mt-8 bg-white border border-slate-300 text-slate-700 px-6 py-2 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm">
        Go Back to Dashboard
      </button>
    </div>
  );
};
