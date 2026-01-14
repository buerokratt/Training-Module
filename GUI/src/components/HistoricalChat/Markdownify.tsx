import React, { useState } from 'react';
import Markdown from 'markdown-to-jsx';
import './HistoricalChat.scss';

interface MarkdownifyProps {
  message: string | undefined;
}

const LinkPreview: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => {
  const [hasError, setHasError] = useState(false);
  const basicAuthPattern = /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\/[^@]+@/;

  if (basicAuthPattern.test(href)) {
    return null;
  }
  
  return !hasError ? (
    <img
      src={href}
      alt={typeof children === 'string' ? children : 'Preview'}
      style={{ maxWidth: '100%', height: 'auto', borderRadius: '20px' }}
      onError={() => setHasError(true)}
    />
  ) : (
    <a href={href} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
};

const hasSpecialFormat = (m: string) => m.includes('\n\n') && m.indexOf('.') > 0 && m.indexOf(':') > m.indexOf('.');

function formatMessage(message?: string): string {
  if (!message) return '';

  const filteredMessage = message
    .replaceAll(/\\?\$b\w*/g, '')
    .replaceAll(/\\?\$v\w*/g, '')
    .replaceAll(/\\?\$g\w*/g, '');

  return filteredMessage
    .replaceAll(/&#x([0-9A-Fa-f]+);/g, (_, hex: string) => String.fromCharCode(parseInt(hex, 16)))
    .replaceAll(/(^|\n)(\d{4})\.\s/g, (match, prefix, year) => {
      const remainingText = filteredMessage.substring(filteredMessage.indexOf(match) + match.length);
      const sentenceEnd = remainingText.indexOf('\n\n');
      if (sentenceEnd !== -1) {
        const currentSentence = remainingText.substring(0, sentenceEnd);
        if (currentSentence.trim().endsWith(':')) {
          return `${prefix}${year}. `;
        }
      }
      return `${prefix}${year}\\. `;
    })
    .replace(/(?<=\n)\d+\.\s/g, hasSpecialFormat(filteredMessage) ? '\n\n$&' : '$&');
}

const Markdownify: React.FC<MarkdownifyProps> = ({ message }) => (
  <div className={'reset'}>
    <Markdown
      options={{
        enforceAtxHeadings: true,
        overrides: {
          a: {
            component: LinkPreview,
          },
        },
        disableParsingRawHTML: true,
      }}
    >
      {formatMessage(message)}
    </Markdown>
  </div>
);

export default Markdownify;
