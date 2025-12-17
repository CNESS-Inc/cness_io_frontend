import { GetConversationMessages, HandleSendMessage, GetConversations } from "../Common/ServerAPI";

export interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  attachments?: File[];
  createdAt: string;
  updatedAt: string;
  is_read: boolean;
  conversation_id: string;
  user_id?: string | null;
}

export interface Conversation {
  id: string | number;
  userId: string | number;
  userName: string;
  userProfileImage: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface SendMessageData {
  receiverId: string | number;
  content: string;
}

// Get all conversations for the current user (optimized for messaging)
export const getConversations = async () => {
  try {
    console.log('📡 Calling conversations API using ServerAPI');

    const response = await GetConversations();

    console.log('✅ API Response:', response.data);
    return response;
  } catch (error: any) {
    console.error("❌ Error fetching conversations:", error.response?.data || error.message);
    throw error;
  }
};

// Get messages for a specific conversation
export const getConversationMessages = async (conversationId: string | number) => {
  try {
    const response = await GetConversationMessages(conversationId);
    // Return the actual API response
    return response;
  } catch (error) {
    console.error("Error fetching conversation messages:", error);
    throw error;
  }
};

// Send a message
export const sendMessage = async (formData: FormData) => {
  try {
    // For now, return mock data since you haven't added the API endpoints yet
    // When you add the endpoints, uncomment the line below
    const response = await HandleSendMessage(formData);
    
    // Mock response for testing
    const mockMessage = {
      id: Date.now().toString(),
      senderId: response.data.data.sender_id,
      receiverId: response.data.data.receiver_id,
      content: response.data.data.message,
      timestamp: new Date().toISOString(),
      isRead: false
    };
    
    return {
      data: {
        data: mockMessage
      }
    };
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};
