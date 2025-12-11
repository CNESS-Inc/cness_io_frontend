import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import {
  getConversationMessages,
  sendMessage as sendMessageAPI,
  getConversations as getConversationsAPI,
} from "../../services/messagingService";
import socketService from '../../services/socketService';
import { sanitizeInput } from "../../lib/utils";
import { useToast } from "../ui/Toast/ToastProvider";

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
  unreadCount: number;
  messages: Message[];
  hasMessages?: boolean; // Indicates if this friend has message history
}

interface MessagingContextType {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  setActiveConversation: (conversation: Conversation | null) => void;
  sendMessage: (conversationId: string | number, receiverId: string | number, content: string, attachments?: File[]) => Promise<void>;
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
  const [activeConversation, setActiveConversationState] = useState<Conversation | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});

  const { showToast } = useToast();

  // Wrapper for setActiveConversation that also notifies backend
  const setActiveConversation = (conversation: Conversation | null) => {
    setActiveConversationState(conversation);
    // Notify backend which conversation is active (for notification logic)
    socketService.setActiveConversation(conversation?.id ? conversation.id.toString() : null);
  };

  // Load conversations on mount
  // Don't load conversations on page load - only when widget is opened
  // useEffect(() => {
  //   const currentUserId = localStorage.getItem("Id");
  //   if (currentUserId) {
  //     loadConversations();
  //   }
  // }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const currentUserId = localStorage.getItem("Id");

      // Single API call - backend returns all friends (with or without conversations)
      const response = await getConversationsAPI();

      console.log('📋 Loaded conversations from API:', response.data);

      // Transform the API response - backend already includes all friends
      const allConversations = (response?.data?.data?.conversations || []).map((item: any) => {
        // Handle last message - show "Start a conversation" if empty
        let lastMsg = item?.lastMessage?.content || "";
        if (!lastMsg || lastMsg.trim() === '') {
          lastMsg = "Start a conversation";
        }

        return {
          id: item.id,
          userId: item.friend.id,
          userName: `${item.friend.firstName} ${item.friend.lastName}`,
          userProfileImage: item.friend.profilePicture || "/profile.png",
          lastMessage: lastMsg,
          lastMessageTime: item.lastMessage?.timestamp || item.updatedAt,
          unreadCount: item.unreadCount || 0,
          messages: [],
          attachments: [],
          hasMessages: item.hasMessages // Track if this friend has message history
        };
      });

      console.log('📝 Setting conversations state with', allConversations.length, 'items');
      console.log('📝 - With messages:', allConversations.filter(c => c.hasMessages).length);
      console.log('📝 - Without messages:', allConversations.filter(c => !c.hasMessages).length);

      setConversations(allConversations);

      return allConversations;
    } catch (error) {
      console.error("Error loading conversations:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (conversationId: string | number, receiverId: string | number, content: string, attachments?: File[]) => {
    try {
      console.log('📤 Sending message', { conversationId, receiverId, content, hasAttachments: attachments && attachments.length > 0 });

      // Ensure sender is in the conversation room
      socketService.joinConversation(conversationId.toString());

      // Sanitize message content to prevent XSS attacks
      const sanitizedContent = sanitizeInput(content, 5000);

      // Validate that there's actual content to send
      if (!sanitizedContent.trim() && (!attachments || attachments.length === 0)) {
        throw new Error("Message cannot be empty");
      }

      const currentUserId = localStorage.getItem("Id");

      // If there are attachments, use API to send (it handles file upload + message creation)
      if (attachments && attachments.length > 0) {
        console.log('📎 Sending message with attachments via API...');
        console.log('⏳ Uploading attachments, message will appear after successful upload...');

        const formData = new FormData();
        formData.append("receiverId", receiverId.toString());
        formData.append("conversationId", conversationId.toString());
        formData.append("content", sanitizedContent); // Include actual content

        attachments.forEach((attachment) => {
          formData.append("file", attachment);
        });

        try {
          // Send via API - the backend will create message and broadcast via socket
          const response = await sendMessageAPI(formData);
          console.log('✅ Message with attachments sent via API:', response.data);
          console.log('✅ Upload successful! Message will appear via socket broadcast...');

          // The backend broadcasts via socket, so the message will come back via 'newMessage' event
          // No optimistic update - message will appear only after successful upload and broadcast
          return;
        } catch (uploadError) {
          console.error('❌ Failed to send message with attachments:', uploadError);
          throw new Error("Failed to send message with attachments");
        }
      }

      // No attachments - send via socket only
      console.log('📤 Sending text-only message via socket...');

      // Create optimistic message for immediate UI update
      const optimisticMessage: Message = {
        id: `temp-${Date.now()}`, // Temporary ID
        senderId: currentUserId || '',
        receiverId: receiverId,
        content: sanitizedContent,
        timestamp: new Date().toISOString(),
        isRead: false,
        conversationId: conversationId.toString(),
        attachments: []
      };

      // Optimistically update UI immediately
      setConversations(prev => prev.map(conv => {
        if (conv.id.toString() === conversationId.toString()) {
          return {
            ...conv,
            lastMessage: sanitizedContent,
            lastMessageTime: optimisticMessage.timestamp,
            messages: [...conv.messages, optimisticMessage]
          };
        }
        return conv;
      }));

      if (activeConversation?.id.toString() === conversationId.toString()) {
        setActiveConversation(prev => prev ? {
          ...prev,
          lastMessage: sanitizedContent,
          lastMessageTime: optimisticMessage.timestamp,
          messages: [...prev.messages, optimisticMessage]
        } : null);
      }

      // Send message via socket
      socketService.sendMessage({
        conversationId,
        receiverId,
        content: sanitizedContent,
        attachments: []
      });

      console.log('✅ Text message sent via socket');

      // Note: The real message will come back via the 'newMessage' socket event
      // which will replace the optimistic message
    } catch (error) {
      console.error("❌ Error sending message:", error);
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
          const attachmentUrls = msg.attachments
            .split(',')
            .map(url => url.trim())
            .filter(url => url); // Filter out empty strings

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
            unreadCount: 0
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

      // Use the new optimized conversations API
      const response = await getConversationsAPI();

      console.log('🔄 Refreshed conversations from new API:', response.data);

      // Transform the API response to match the Conversation interface
      const conversationsWithMessages = (response?.data?.data?.conversations || []).map((item: any) => {
        // Handle empty last message - show placeholder text
        let lastMsg = item?.lastMessage?.content || "";
        if (!lastMsg || lastMsg.trim() === '') {
          lastMsg = "Start a conversation";
        }

        return {
          id: item.id,
          userId: item.friend.id,
          userName: `${item.friend.firstName} ${item.friend.lastName}`,
          userProfileImage: item.friend.profilePicture || "/profile.png",
          lastMessage: lastMsg,
          lastMessageTime: item.lastMessage?.timestamp || item.updatedAt,
          unreadCount: item.unreadCount || 0,
          messages: [], // Start with empty messages, they'll be loaded when needed
          attachments: []
        };
      });

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
    if (!token) {
      console.error('❌ No auth token found');
      return;
    }

    console.log('🔌 Setting up messaging socket connection...');

    // Connect to socket (will reuse existing connection if already exists)
    socketService.connect(token);

    // Wait for socket to be ready, then set up messaging-specific listeners
    socketService.waitForConnection()
      .then(() => {
        console.log('🟢 Socket ready for messaging');
        setSocketConnected(true);

        // Set up real-time message listeners
        socketService.onNewMessage((data) => {
          const currentUserId = localStorage.getItem("Id");
          const isOwnMessage = data.data.sender_id.toString() === currentUserId;
          const isActiveConversation = activeConversation?.id.toString() === data.data.conversation_id.toString();

          console.log('📨 New message received via socket:', {
            fullData: data,
            conversationId: data.data.conversation_id,
            messageId: data.data.id,
            content: data.data.content,
            senderId: data.data.sender_id,
            receiverId: data.data.receiver_id,
            isOwnMessage,
            isActiveConversation
          });

          // Parse attachments - handle both string and array formats
          let attachmentsList: any[] = [];
          if (data.data.attachments) {
            if (typeof data.data.attachments === 'string') {
              // Comma-separated string format
              attachmentsList = data.data.attachments
                .split(',')
                .filter((url: string) => url && url.trim())
                .map((url: string, index: number) => ({
                  id: `${data.data.id}_attachment_${index}`,
                  type: 'image' as const,
                  url: url.trim(),
                  filename: `attachment_${index + 1}`
                }));
            } else if (Array.isArray(data.data.attachments)) {
              // Array format (just in case)
              attachmentsList = data.data.attachments.map((url: string, index: number) => ({
                id: `${data.data.id}_attachment_${index}`,
                type: 'image' as const,
                url: url.trim(),
                filename: `attachment_${index + 1}`
              }));
            }
          }

          const newMessage = {
            id: data.data.id,
            senderId: data.data.sender_id,
            receiverId: data.data.receiver_id,
            content: data.data.content,
            timestamp: data.data.createdAt,
            isRead: data.data.is_read,
            conversationId: data.data.conversation_id,
            attachments: attachmentsList
          };

          console.log('📝 Transformed message:', newMessage);

          // Update conversations with new message, replacing optimistic message if exists
          setConversations(prev => {
            const updated = prev.map(conv => {
              // Match conversation by ID OR by friend/user ID (for new conversations with temp IDs)
              const isMatchById = conv.id.toString() === data.data.conversation_id.toString();
              const isMatchByUserId = (
                (conv.userId === data.data.sender_id && currentUserId === data.data.receiver_id) ||
                (conv.userId === data.data.receiver_id && currentUserId === data.data.sender_id)
              );

              if (isMatchById || isMatchByUserId) {
                console.log(`✅ Found matching conversation: ${conv.id} (matchById: ${isMatchById}, matchByUserId: ${isMatchByUserId})`);

                // If this was a temporary conversation (new friend), update with real conversation ID
                const updatedConvId = isMatchByUserId && conv.id.toString().startsWith('new-')
                  ? data.data.conversation_id
                  : conv.id;

                console.log(`🔄 Conversation ID: ${conv.id} → ${updatedConvId}`);

                // Filter out any optimistic (temp) messages, then add the real message
                const filteredMessages = conv.messages.filter(msg => !msg.id.startsWith('temp-'));

                // Check if message already exists (prevent duplicates)
                const messageExists = filteredMessages.some(msg => msg.id === newMessage.id);

                console.log(`📊 Messages before: ${filteredMessages.length}, exists: ${messageExists}`);

                // Determine last message text
                let lastMessageText = data.data.content;
                if (!lastMessageText || lastMessageText.trim() === '') {
                  // If no text content, check if there are attachments
                  if (attachmentsList.length > 0) {
                    lastMessageText = '📷 Photo';
                  }
                }

                // Calculate unread count
                // Increment if: message is from someone else AND conversation is not currently active
                const shouldIncrementUnread = !isOwnMessage && !isActiveConversation;
                const newUnreadCount = shouldIncrementUnread ? (conv.unreadCount || 0) + 1 : conv.unreadCount;

                console.log(`📊 Unread count: ${conv.unreadCount} → ${newUnreadCount} (shouldIncrement: ${shouldIncrementUnread})`);

                return {
                  ...conv,
                  id: updatedConvId, // Update with real conversation ID if it was temporary
                  lastMessage: lastMessageText,
                  lastMessageTime: data.data.createdAt,
                  unreadCount: newUnreadCount,
                  messages: messageExists ? filteredMessages : [...filteredMessages, newMessage]
                };
              }
              return conv;
            });

            console.log('📋 Updated conversations:', updated.map(c => ({ id: c.id, messageCount: c.messages.length, unreadCount: c.unreadCount })));
            return updated;
          });

          // Update active conversation if it's the current one - Match by ID or user ID
          const isActiveMatchById = activeConversation?.id.toString() === data.data.conversation_id.toString();
          const isActiveMatchByUserId = activeConversation && (
            (activeConversation.userId === data.data.sender_id && currentUserId === data.data.receiver_id) ||
            (activeConversation.userId === data.data.receiver_id && currentUserId === data.data.sender_id)
          );

          if (isActiveMatchById || isActiveMatchByUserId) {
            console.log('🔄 Updating active conversation with new message');
            setActiveConversation(prev => {
              if (!prev) return null;

              // If this was a temporary conversation, update with real conversation ID
              const updatedConvId = isActiveMatchByUserId && prev.id.toString().startsWith('new-')
                ? data.data.conversation_id
                : prev.id;

              // Filter out optimistic messages
              const filteredMessages = prev.messages.filter(msg => !msg.id.startsWith('temp-'));

              // Check if message already exists
              const messageExists = filteredMessages.some(msg => msg.id === newMessage.id);

              // Determine last message text
              let lastMessageText = data.data.content;
              if (!lastMessageText || lastMessageText.trim() === '') {
                if (attachmentsList.length > 0) {
                  lastMessageText = '📷 Photo';
                }
              }

              const updated = {
                ...prev,
                id: updatedConvId, // Update with real conversation ID if it was temporary
                lastMessage: lastMessageText,
                lastMessageTime: data.data.createdAt,
                // Don't increment unread for active conversation
                unreadCount: 0,
                messages: messageExists ? filteredMessages : [...filteredMessages, newMessage]
              };

              console.log('✅ Active conversation updated, message count:', updated.messages.length);
              return updated;
            });
          } else {
            console.log('⚠️ Message for different conversation:', {
              messageConv: data.data.conversation_id,
              activeConv: activeConversation?.id
            });
          }
        });

        // Set up typing indicator listeners
        socketService.onTypingIndicator((data) => {
          console.log('⌨️ Typing indicator received:', data);
          setTypingUsers(prev => {
            // Convert senderId to string for consistent keying
            const updated = {
              ...prev,
              [data.senderId.toString()]: data.isTyping
            };
            console.log('📝 Updated typingUsers:', updated);
            return updated;
          });
        });

        // Set up message read status listeners
        socketService.onMessageRead((data) => {
          console.log('📖 Message read:', data);
          setConversations(prev => prev.map(conv => {
            // Convert both to strings for comparison
            if (conv.id.toString() === data.conversationId.toString()) {
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

        // DEBUG: Listen to ALL socket events to verify connection
        const socket = socketService.getSocket();
        if (socket) {
          socket.onAny((eventName, ...args) => {
            console.log('🔍 Socket event received:', eventName, args);
          });
          console.log('✅ Socket event debugger attached');
        }

        // Set up message notification listeners (when user doesn't have conversation open)
        socketService.onMessageNotification((data) => {
          console.log('🔔 Message notification received:', data);
          console.log('📱 Showing notification popup for message from:', data.senderName);

          // Show toast notification
          showToast({
            type: 'notification',
            title: `New message from ${data.senderName}`,
            message: data.content.length > 50 ? data.content.substring(0, 50) + '...' : data.content,
            duration: 5000
          });

          console.log('✅ Notification toast displayed successfully');
        });

        socketService.onNotificationCount((data) => {
          console.log('🔔 Notification count:', data);
          // Update localStorage so DashboardHeader can pick it up
          if (data?.count !== undefined) {
            localStorage.setItem('notification_count', data.count.toString());
            console.log('✅ Updated notification count in localStorage:', data.count);
          }

          // Show notification popup if message exists
          if (data?.message) {
            showToast({
              type: 'notification',
              title: data.message.title || 'Notification',
              message: data.message.description || '',
              duration: 5000
            });
            console.log('✅ Showing notification popup:', data.message.title);
          }
        });

        // Set up message send error listener
        socketService.onMessageError((data) => {
          console.error('❌ Message send failed:', data);

          // Remove optimistic message on error
          setConversations(prev => prev.map(conv => ({
            ...conv,
            messages: conv.messages.filter(msg => !msg.id.startsWith('temp-'))
          })));

          if (activeConversation) {
            setActiveConversation(prev => prev ? {
              ...prev,
              messages: prev.messages.filter(msg => !msg.id.startsWith('temp-'))
            } : null);
          }
        });

        // Set up message sent acknowledgment listener (optional)
        socketService.onMessageSent((data) => {
          if (data.success) {
            console.log('✅ Message sent successfully:', data.message);
          } else {
            console.error('❌ Message failed:', data.error);
          }
        });
      })
      .catch((error) => {
        console.error('❌ Failed to connect socket for messaging:', error);
        setSocketConnected(false);
      });

    // No cleanup needed - socket is shared across app
    // Don't disconnect here as other components might be using it
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