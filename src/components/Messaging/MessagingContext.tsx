import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  getConversationMessages,
  sendMessage as sendMessageAPI,
} from "../../services/messagingService";
import { GetConnectionUser } from "../../Common/ServerAPI";
import socketService from '../../services/socketService';

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
  attachments: string | null;
}

interface Message {
  id: string;
  senderId: string | number;
  receiverId: string | number;
  content: string;
  timestamp: string;
  isRead: boolean;
  conversationId?: string;
  // Add attachments support
  attachments?: Array<{
    id: string;
    type: 'image' | 'file';
    url: string;
    filename: string;
    size?: number;
  }>;
}

interface Conversation {
  id: string | number;
  userId: string | number;
  userName: string;
  userProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number | string;
  messages: Message[];
}

interface MessagingContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (conversationId: string | number, content: string, attachments?: File[]) => Promise<void>;
  loadConversationMessages: (conversationId: string | number) => Promise<Message[]>;
  loadConversations: () => Promise<Conversation[]>;
  refreshConversations: () => Promise<Conversation[]>;
  isLoading: boolean;
  socketConnected: boolean;
  typingUsers: Record<string, boolean>;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  sendTypingIndicator: (conversationId: string, receiverId: string, isTyping: boolean) => void;
  markMessagesAsRead: (conversationId: string, senderId: string) => void;
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

  const [socketConnected, setSocketConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  // Load conversations on mount
  useEffect(() => {
    const currentUserId = localStorage.getItem("Id");
    if (currentUserId) {
      loadConversations();
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      // Connect to socket
      // const socket = socketService.connect(token);

      // Set up real-time message listeners
      socketService.onNewMessage((data) => {
        console.log('📨 New message received:', data);

        // Update conversations with new message
        setConversations(prev => prev.map(conv => {
          if (conv.id === data.data.conversation_id) {
            return {
              ...conv,
              lastMessage: data.data.content,
              lastMessageTime: data.data.createdAt,
              messages: [...conv.messages, {
                id: data.data.id,
                senderId: data.data.sender_id,
                receiverId: data.data.receiver_id,
                content: data.data.content,
                timestamp: data.data.createdAt,
                isRead: data.data.is_read,
                conversationId: data.data.conversation_id,
                attachments: data.data.attachments ?
                  data.data.attachments.split(',').map((url: string, index: number) => ({
                    id: `${data.data.id}_attachment_${index}`,
                    type: 'image' as const,
                    url: url.trim(),
                    filename: `attachment_${index + 1}`
                  })) : []
              }]
            };
          }
          return conv;
        }));

        // Update active conversation if it's the current one
        if (activeConversation?.id === data.data.conversation_id) {
          setActiveConversation(prev => prev ? {
            ...prev,
            lastMessage: data.data.content,
            lastMessageTime: data.data.createdAt,
            messages: [...prev.messages, {
              id: data.data.id,
              senderId: data.data.sender_id,
              receiverId: data.data.receiver_id,
              content: data.data.content,
              timestamp: data.data.createdAt,
              isRead: data.data.is_read,
              conversationId: data.data.conversation_id,
              attachments: data.data.attachments ?
                data.data.attachments.split(',').map((url: string, index: number) => ({
                  id: `${data.data.id}_attachment_${index}`,
                  type: 'image' as const,
                  url: url.trim(),
                  filename: `attachment_${index + 1}`
                })) : []
            }]
          } : null);
        }
      });

      // Set up typing indicator listeners
      socketService.onTypingIndicator((data) => {
        setTypingUsers(prev => ({
          ...prev,
          [data.senderId]: data.isTyping
        }));
      });

      // Set up message read status listeners
      socketService.onMessageRead((data) => {
        console.log('📖 Message read:', data);
        // Update message read status in conversations
        setConversations(prev => prev.map(conv => {
          if (conv.id === data.conversationId) {
            return {
              ...conv,
              messages: conv.messages.map(msg => ({
                ...msg,
                isRead: true
              }))
            };
          }
          return conv;
        }));
      });

      // Set up notification listeners
      socketService.onNotification((data) => {
        console.log('🔔 Notification received:', data);
        // Handle notification display
      });

      socketService.onNotificationCount((data) => {
        console.log('🔔 Notification count:', data);
        // Handle notification count update
      });

      setSocketConnected(true);
    }

    return () => {
      // Cleanup on unmount
      socketService.disconnect();
      setSocketConnected(false);
    };
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
        messages: [], // Start with empty messages, they'll be loaded when needed  
        attachments: []
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

  const sendMessage = async (conversationId: string | number, content: string, attachments?: File[]) => {
    try {
      console.log('attachments', attachments)
      console.log('for')
      // Create FormData for message with attachments
      const formData = new FormData();
      formData.append("receiverId", conversationId.toString());
      formData.append("content", content);

      console.log('five')
      // Append all selected images as files (similar to handleSubmitPost)
      if (attachments && attachments.length > 0) {
        attachments.forEach((attachment) => {
          formData.append("file", attachment);
        });
      }
      console.log('FormData contents:');
      for (let pair of formData.entries()) {
        console.log(pair[0] + ':', pair[1]);
      }
      console.log('six')
      // Send message via API
      const response = await sendMessageAPI(formData);
      console.log('seven')
      // Update local state
      const message: Message = {
        id: response.data.data.id || Date.now().toString(),
        senderId: response.data.data.senderId,
        receiverId: response.data.data.receiverId,
        content: response.data.data.content || content,
        timestamp: new Date().toISOString(),
        isRead: false
      };
      console.log('eight')
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
      console.log('nine')
      // Update active conversation if it's the current one
      if (activeConversation?.id === conversationId) {
        setActiveConversation(prev => prev ? {
          ...prev,
          lastMessage: content,
          lastMessageTime: message.timestamp,
          messages: [...prev.messages, message]
        } : null);
      }
      console.log('ten')
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
      const transformedMessages: Message[] = apiMessages.map((msg: APIMessage) => {
        // Handle attachments - convert comma-separated string to array of objects
        let messageAttachments: any[] = [];

        if (msg.attachments && typeof msg.attachments === 'string' && msg.attachments !== 'null') {
          // Split comma-separated URLs and create attachment objects
          const attachmentUrls = msg.attachments.split(',').map(url => url.trim());

          messageAttachments = attachmentUrls.map((url, index) => ({
            id: `${msg.id}_attachment_${index}`,
            type: 'image' as const, // Assuming all attachments are images for now
            url: url,
            filename: `attachment_${index + 1}`,
            // size: 0 // Size not available from API
          }));
        }

        return {
          id: msg.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          content: msg.content,
          timestamp: msg.createdAt,
          isRead: msg.is_read,
          conversationId: msg.conversation_id,
          attachments: messageAttachments // Use processed attachments
        };
      });

      // Update conversation with messages
      setConversations(prev => prev.map(conv => {
        if (conv.id === conversationId) {
          const latestMessage = transformedMessages[transformedMessages.length - 1];
          return {
            ...conv,
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
        messages: [], // Start with empty messages, they'll be loaded when needed
        attachments: []
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

  // Socket connection management
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      console.log('🔌 Connecting to socket...');

      // Connect to socket
      const socket = socketService.connect(token);

      // Wait for connection before setting up listeners
      socket.on('connect', () => {
        console.log('🟢 Socket connected successfully');
        setSocketConnected(true);

        // Set up real-time message listeners
        socketService.onNewMessage((data) => {
          console.log('📨 New message received:', data);

          // Update conversations with new message
          setConversations(prev => prev.map(conv => {
            if (conv.id === data.data.conversation_id) {
              return {
                ...conv,
                lastMessage: data.data.content,
                lastMessageTime: data.data.createdAt,
                messages: [...conv.messages, {
                  id: data.data.id,
                  senderId: data.data.sender_id,
                  receiverId: data.data.receiver_id,
                  content: data.data.content,
                  timestamp: data.data.createdAt,
                  isRead: data.data.is_read,
                  conversationId: data.data.conversation_id,
                  attachments: data.data.attachments ?
                    data.data.attachments.split(',').map((url: string, index: number) => ({
                      id: `${data.data.id}_attachment_${index}`,
                      type: 'image' as const,
                      url: url.trim(),
                      filename: `attachment_${index + 1}`
                    })) : []
                }]
              };
            }
            return conv;
          }));

          // Update active conversation if it's the current one
          if (activeConversation?.id === data.data.conversation_id) {
            setActiveConversation(prev => prev ? {
              ...prev,
              lastMessage: data.data.content,
              lastMessageTime: data.data.createdAt,
              messages: [...prev.messages, {
                id: data.data.id,
                senderId: data.data.sender_id,
                receiverId: data.data.receiver_id,
                content: data.data.content,
                timestamp: data.data.createdAt,
                isRead: data.data.is_read,
                conversationId: data.data.conversation_id,
                attachments: data.data.attachments ?
                  data.data.attachments.split(',').map((url: string, index: number) => ({
                    id: `${data.data.id}_attachment_${index}`,
                    type: 'image' as const,
                    url: url.trim(),
                    filename: `attachment_${index + 1}`
                  })) : []
              }]
            } : null);
          }
        });

        // Set up typing indicator listeners
        socketService.onTypingIndicator((data) => {
          setTypingUsers(prev => ({
            ...prev,
            [data.senderId]: data.isTyping
          }));
        });

        // Set up message read status listeners
        socketService.onMessageRead((data) => {
          console.log('📖 Message read:', data);
          setConversations(prev => prev.map(conv => {
            if (conv.id === data.conversationId) {
              return {
                ...conv,
                messages: conv.messages.map(msg => ({
                  ...msg,
                  isRead: true
                }))
              };
            }
            return conv;
          }));
        });

        // Set up notification listeners
        socketService.onNotification((data) => {
          console.log('🔔 Notification received:', data);
        });

        socketService.onNotificationCount((data) => {
          console.log('🔔 Notification count:', data);
        });
      });

      socket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        setSocketConnected(false);
      });

      socket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setSocketConnected(false);
      });
    }

    return () => {
      console.log('🔌 Disconnecting socket...');
      socketService.disconnect();
      setSocketConnected(false);
    };
  }, []);

  // Socket function implementations
  const joinConversation = (conversationId: string) => {
    socketService.joinConversation(conversationId);
  };

  const leaveConversation = (conversationId: string) => {
    socketService.leaveConversation(conversationId);
  };

  const sendTypingIndicator = (conversationId: string, receiverId: string, isTyping: boolean) => {
    socketService.sendTypingIndicator(conversationId, receiverId, isTyping);
  };

  const markMessagesAsRead = (conversationId: string, senderId: string) => {
    socketService.markAsRead(conversationId, senderId);
  };

  const value: MessagingContextType = {
    conversations,
    activeConversation,
    setActiveConversation,
    sendMessage,
    loadConversationMessages,
    loadConversations,
    refreshConversations,
    isLoading,
    // Add new socket-related properties
    socketConnected,
    typingUsers,
    joinConversation,
    leaveConversation,
    sendTypingIndicator,
    markMessagesAsRead
  };

  return (
    <MessagingContext.Provider value={value}>
      {children}
    </MessagingContext.Provider>
  );
};