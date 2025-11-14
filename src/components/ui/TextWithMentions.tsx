import React, { useEffect, useState } from 'react';
import {
  getMentionUserProfile,
} from "../../Common/ServerAPI";

interface TextWithMentionsProps {
  text: string;
  className?: string;
  commentId: string;
  onMentionUserIdsFetched?: (userIds: string[]) => string;
}

const TextWithMentions: React.FC<TextWithMentionsProps> = ({ text, className = "", commentId, onMentionUserIdsFetched }) => {

  const [mentionUserIds, setMentionUserIds] = useState<string[]>([]);

  useEffect(() => {
    // Replace this with your actual API call
    async function fetchTaggedUserIds() {
      const response = await getMentionUserProfile(commentId);
      const userId = response?.data?.data || '';
      setMentionUserIds(userId);
      if (onMentionUserIdsFetched) {
        onMentionUserIdsFetched(userId);
      }
    }
    fetchTaggedUserIds();
  }, [commentId, onMentionUserIdsFetched]);
  
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
            {mentionUserIds ? <a href={`/dashboard/userprofile/${mentionUserIds}`}>@{part}</a> : <span>@{part}</span>}
          
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
