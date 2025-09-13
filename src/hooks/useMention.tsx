import { useState, useCallback, useRef } from 'react';

interface MentionUser {
  id: string;
  username: string;
  profile?: {
    first_name?: string;
    last_name?: string;
    profile_picture?: string;
  };
}

interface UseMentionProps {
  onMentionSelect: (user: MentionUser) => void;
  onTextChange: (text: string, mentions: MentionUser[]) => void;
}

export const useMention = ({ onMentionSelect, onTextChange }: UseMentionProps) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<MentionUser[]>([]);
  const [mentionText, setMentionText] = useState('');
  const [selectedMentionIndex, setSelectedMentionIndex] = useState(0);
  const [mentions, setMentions] = useState<MentionUser[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const extractMentionText = useCallback((text: string, cursorPos: number) => {
    const textBeforeCursor = text.substring(0, cursorPos);
    const mentionMatch = textBeforeCursor.match(/@(\w*)$/);
    return mentionMatch ? mentionMatch[1] : '';
  }, []);

  const handleTextChange = useCallback((text: string) => {
    const cursorPos = textareaRef.current?.selectionStart || 0;
    const mentionText = extractMentionText(text, cursorPos);
    
    if (mentionText !== '') {
      setMentionText(mentionText);
      setShowSuggestions(true);
      setSelectedMentionIndex(0);
    } else {
      setShowSuggestions(false);
    }

    // Extract all mentions from the text
    const mentionMatches = text.match(/@(\w+)/g) || [];
    const currentMentions = mentionMatches.map(match => {
      const username = match.substring(1);
      return mentions.find(m => m.username === username);
    }).filter(Boolean) as MentionUser[];

    setMentions(currentMentions);
    onTextChange(text, currentMentions);
  }, [extractMentionText, mentions, onTextChange]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (!showSuggestions) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedMentionIndex(prev => 
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (suggestions[selectedMentionIndex]) {
          selectMention(suggestions[selectedMentionIndex]);
        }
        break;
      case 'Escape':
        setShowSuggestions(false);
        break;
    }
  }, [showSuggestions, suggestions, selectedMentionIndex]);

  const selectMention = useCallback((user: MentionUser) => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const cursorPos = textarea.selectionStart;
    const textBeforeCursor = textarea.value.substring(0, cursorPos);
    const textAfterCursor = textarea.value.substring(cursorPos);
    
    // Find the last @ symbol before cursor
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    const textBeforeAt = textBeforeCursor.substring(0, lastAtIndex);
    const newText = textBeforeAt + `@${user.username} ` + textAfterCursor;
    
    // Update the textarea value
    textarea.value = newText;
    
    // Set cursor position after the mention
    const newCursorPos = textBeforeAt.length + user.username.length + 2;
    textarea.setSelectionRange(newCursorPos, newCursorPos);
    
    // Update state
    setShowSuggestions(false);
    setMentionText('');
    setSelectedMentionIndex(0);
    
    // Add to mentions if not already present
    if (!mentions.find(m => m.id === user.id)) {
      const newMentions = [...mentions, user];
      setMentions(newMentions);
      onTextChange(newText, newMentions);
    } else {
      onTextChange(newText, mentions);
    }
    
    onMentionSelect(user);
  }, [mentions, onMentionSelect, onTextChange]);

  const updateSuggestions = useCallback((newSuggestions: MentionUser[]) => {
    setSuggestions(newSuggestions);
  }, []);

  const hideSuggestions = useCallback(() => {
    setShowSuggestions(false);
  }, []);

  return {
    showSuggestions,
    suggestions,
    mentionText,
    selectedMentionIndex,
    mentions,
    textareaRef,
    handleTextChange,
    handleKeyDown,
    selectMention,
    updateSuggestions,
    hideSuggestions,
  };
};
