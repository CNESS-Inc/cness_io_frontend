import React from 'react';

interface TextWithMentionsProps {
  text: string;
  className?: string;
}

const TextWithMentions: React.FC<TextWithMentionsProps> = ({ text, className = "" }) => {
  // Split text by @mentions and create JSX elements
  const renderTextWithMentions = (text: string) => {
    const mentionRegex = /@(\w+)/g;
    const parts = text.split(mentionRegex);
    
    return parts.map((part, index) => {
      // Check if this part is a mention (odd indices after splitting by @username)
      if (index % 2 === 1) {
        return (
          <span
            key={index}
            className="text-blue-600 font-medium bg-blue-50 px-1 rounded"
          >
            @{part}
          </span>
        );
      }
      return part;
    });
  };

  return (
    <span className={className}>
      {renderTextWithMentions(text)}
    </span>
  );
};

export default TextWithMentions;
