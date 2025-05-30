import React, { useEffect, useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface ShellCodeBlockProps {
  code?: string;
  filePath?: string;
  language?: string;
  showLineNumbers?: boolean;
  className?: string;
}

const languageLabelMap: Record<string, string> = {
  bash: 'BASH',
  sh: 'BASH',
  shell: 'BASH',
  python: 'PYTHON',
  javascript: 'JAVASCRIPT',
  typescript: 'TYPESCRIPT',
  // Add more as needed
};

const ShellCodeBlock: React.FC<ShellCodeBlockProps> = ({
  code,
  filePath,
  language = 'bash',
  showLineNumbers = true,
  className = '',
}) => {
  const [fileContent, setFileContent] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (filePath) {
      fetch(filePath)
        .then(response => {
          if (!response.ok) {
            throw new Error(`Failed to load file: ${response.statusText}`);
          }
          return response.text();
        })
        .then(content => {
          setFileContent(content);
          setError('');
        })
        .catch(err => {
          setError(`Error loading file: ${err.message}`);
          console.error('Error loading shell script:', err);
        });
    }
  }, [filePath]);

  const displayCode = code || fileContent;

  const handleCopy = async () => {
    if (!displayCode) return;
    try {
      await navigator.clipboard.writeText(displayCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      // fallback for older browsers
      setCopied(false);
    }
  };

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  if (!displayCode) {
    return <div className="text-gray-500 p-4">Loading...</div>;
  }

  const langLabel = languageLabelMap[language.toLowerCase()] || language.toUpperCase();

  return (
    <div
      className={`relative bg-[#181A1B] border border-gray-700 rounded-xl shadow-sm my-4 ${className}`}
      style={{ fontFamily: 'var(--ifm-font-family-monospace, monospace)' }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-700 bg-[#23272A] rounded-t-xl">
        <span className="text-xs font-semibold text-gray-300 tracking-widest uppercase">{langLabel}</span>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-1 text-xs text-gray-300 bg-gray-800 rounded hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          aria-label="Copy code"
        >
          {copied ? (
            <span className="text-green-400">Copied!</span>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="inline-block align-text-bottom">
              <rect x="9" y="9" width="13" height="13" rx="2" strokeWidth="2"/>
              <rect x="3" y="3" width="13" height="13" rx="2" strokeWidth="2"/>
            </svg>
          )}
        </button>
      </div>
      {/* Code block */}
      <SyntaxHighlighter
        language={language}
        style={vscDarkPlus}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          padding: '1.25rem',
          fontSize: '0.95rem',
          lineHeight: '1.6',
          backgroundColor: 'transparent',
          borderRadius: '0 0 0.75rem 0.75rem',
        }}
        wrapLines={true}
        wrapLongLines={true}
      >
        {displayCode}
      </SyntaxHighlighter>
    </div>
  );
};

export default ShellCodeBlock; 