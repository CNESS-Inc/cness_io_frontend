import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { 
  getConversationMessages, 
  sendMessage as sendMessageAPI,
} from "../../services/messagingService";
import { GetConnectionUser } from "../../Common/ServerAPI";

// Interface for the API response structure
interface APIMessage {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  is_read: boolean;
  conversation_id: string;
  createdAt: string;
  updatedAt: string;
  user_id: string | null;
}

interface Message {
  id: string;
  senderId: string | number;
  receiverId: string | number;
  content: string;
  timestamp: string;
  isRead: boolean;
  conversationId?: string;
}

interface Conversation {
  id: string | number;
  userId: string | number;
  userName: string;
  userProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number| string;
  messages: Message[];
}

interface MessagingContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (conversationId: string | number, content: string) => Promise<void>;
  loadConversationMessages: (conversationId: string | number) => Promise<Message[]>;
  loadConversations: () => Promise<Conversation[]>;
  refreshConversations: () => Promise<Conversation[]>;
  isLoading: boolean;
}

const MessagingContext = createContext<MessagingContextType | undefined>(undefined);

export const useMessaging = () => {
  const context = useContext(MessagingContext);
  if (!context) {
    throw new Error("useMessaging must be used within a MessagingProvider");
  }
  return context;
};

interface MessagingProviderProps {
  children: ReactNode;
}

export const MessagingProvider: React.FC<MessagingProviderProps> = ({ children }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Load conversations on mount
  useEffect(() => {
    const currentUserId = localStorage.getItem("Id");
    if (currentUserId) {
      loadConversations();
    }
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const currentUserId = localStorage.getItem("Id");
      
      // Use the actual GetConnectionUser API instead of mock data
      const response = await GetConnectionUser();
      
      // Transform the API response to match the Conversation interface
      const conversationsWithMessages = (response?.data?.data?.rows || []).map((item: any) => ({
        id: item?.conversation?.id || item.friend_user.id,
        userId: item.friend_user.id,
        userName: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        userProfileImage: item.friend_user.profile.profile_picture || "/profile.png",
        lastMessage: item?.conversation?.last_message || "",
        lastMessageTime: item?.conversation?.createdAt || new Date().toISOString(),
        unreadCount: item?.conversation?.user_id !== currentUserId ? (item?.conversation?.unread_count > 0 ? item?.conversation?.unread_count : '') : '',
        messages: [] // Start with empty messages, they'll be loaded when needed
      }));
      
      setConversations(conversationsWithMessages);
      
      // Return the loaded conversations so they can be used immediately
      return conversationsWithMessages;
    } catch (error) {
      console.error("Error loading conversations:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (conversationId: string | number, content: string) => {
    try {
      // Send message via API
      await sendMessageAPI({
        receiverId: conversationId,
        content
      });

      // Update local state
      const message: Message = {
        id: Date.now().toString(),
        senderId: "currentUser",
        receiverId: conversationId,
        content,
        timestamp: new Date().toISOString(),
        isRead: false
      };

      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            lastMessage: content,
            lastMessageTime: message.timestamp,
            messages: [...conv.messages, message]
          };
        }
        return conv;
      }));

      // Update active conversation if it's the current one
      if (activeConversation?.id === conversationId) {
        setActiveConversation(prev => prev ? {
          ...prev,
          lastMessage: content,
          lastMessageTime: message.timestamp,
          messages: [...prev.messages, message]
        } : null);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const loadConversationMessages = async (conversationId: string | number) => {
    try {
      const response = await getConversationMessages(conversationId);
      
      // Handle the API response structure
      const apiMessages: APIMessage[] = response.data?.data || [];
      
      // Transform API message format to internal Message format
      const transformedMessages: Message[] = apiMessages.map((msg: APIMessage) => ({
        id: msg.id,
        senderId: msg.sender_id,
        receiverId: msg.receiver_id,
        content: msg.content,
        timestamp: msg.createdAt,
        isRead: msg.is_read,
        conversationId: msg.conversation_id
      }));
      
      // Update conversation with messages
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          const latestMessage = transformedMessages[transformedMessages.length - 1];
          return { ...conv, 
            messages: transformedMessages, 
            lastMessage: latestMessage?.content || conv.lastMessage,
          lastMessageTime: latestMessage?.timestamp || conv.lastMessageTime,
          // Reset unread count since messages are now loaded
          unreadCount: ''
          };
        }
        return conv;
      }));
      
      // Return the loaded messages so they can be used immediately
      return transformedMessages;
    } catch (error) {
      console.error("Error loading conversation messages:", error);
      return [];
    }
  };

  const refreshConversations = async () => {
    try {
      setIsLoading(true);
      const currentUserId = localStorage.getItem("Id");
      
      // Use the actual GetConnectionUser API to get fresh data
      const response = await GetConnectionUser();
      
      // Transform the API response to match the Conversation interface
      const conversationsWithMessages = (response?.data?.data?.rows || []).map((item: any) => ({
        id: item?.conversation?.id || item.friend_user.id,
        userId: item.friend_user.id,
        userName: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        userProfileImage: item.friend_user.profile.profile_picture || "/profile.png",
        lastMessage: item?.conversation?.last_message || "",
        lastMessageTime: item?.conversation?.createdAt || new Date().toISOString(),
        unreadCount: item?.conversation?.user_id !== currentUserId ? 
          (item?.conversation?.unread_count > 0 ? item?.conversation?.unread_count : '') : '',
        messages: [] // Start with empty messages, they'll be loaded when needed
      }));
      
      setConversations(conversationsWithMessages);
      return conversationsWithMessages;
    } catch (error) {
      console.error("Error refreshing conversations:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const value: MessagingContextType = {
    conversations,
    activeConversation,
    setActiveConversation,
    sendMessage,
    loadConversationMessages,
    loadConversations,
    refreshConversations,
    isLoading
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};