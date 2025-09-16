import React from 'react';

interface MentionUser {
  id: string;
  username: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
  };
}

interface FriendSuggestionProps {
  suggestions: MentionUser[];
  selectedIndex: number;
  onSelect: (user: MentionUser) => void;
  position: { top: number; left: number };
}

const FriendSuggestion: React.FC<FriendSuggestionProps> = ({
  suggestions,
  selectedIndex,
  onSelect,
  position
}) => {
  if (suggestions.length === 0) return null;

  return (
    <div
      className="absolute z-50 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto min-w-64"
      style={{
        top: "-4rem",
        left: position.left,
      }}
    >
      {suggestions.map((user, index) => (
        <div
          key={user.id}
          className={`flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-gray-50 ${
            index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
          }`}
          onClick={() => onSelect(user)}
        >
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user.profile?.profile_picture ? (
              <img
                src={user.profile.profile_picture}
                alt={`${user.profile.first_name} ${user.profile.last_name}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-medium text-gray-600">
                {(user.profile?.first_name?.[0] || user.username[0]).toUpperCase()}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-gray-900 truncate">
              {user.profile?.first_name && user.profile?.last_name
                ? `${user.profile.first_name} ${user.profile.last_name}`
                : user.username}
            </div>
            <div className="text-xs text-gray-500 truncate">
              @{user.username}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FriendSuggestion;
