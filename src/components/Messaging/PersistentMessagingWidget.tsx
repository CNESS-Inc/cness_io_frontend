import React, { useState, useEffect, useRef } from "react";
// import { MessageCircle, X, Search, Send, Paperclip, Smile, Image as ImageIcon } from "lucide-react";
import { MessageCircle, X, Send, Paperclip, Smile, Image as ImageIcon } from "lucide-react";
// import { GetConnectionUser } from "../../Common/ServerAPI";
import { useToast } from "../ui/Toast/ToastProvider";
import { useMessaging } from "./MessagingContext";

interface Connection {
  id: string | number;
  name: string;
  username: string;
  profileImage: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number | string;
  conversationId?: string | number;
}

interface Message {
  id: string;
  sender_id: string;
  receiver_id: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  is_read: boolean;
  conversation_id: string;
  user_id?: string | null;
}

const PersistentMessagingWidget: React.FC = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"conversations" | "chat">("conversations");
  // const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading] = useState(false);
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const { 
    loadConversationMessages, 
    sendMessage, 
    conversations, 
    setActiveConversation,
    refreshConversations,
    loadConversations
  } = useMessaging();

  const connections = conversations.map(conv => ({
    id: conv.userId,
    name: conv.userName,
    username: `@${conv.userName.split(' ')[0]}`,
    profileImage: conv.userProfileImage,
    lastMessage: conv.lastMessage,
    lastMessageTime: conv.lastMessageTime,
    unreadCount: conv.unreadCount,
    conversationId: conv.id
  })) || [];
  
  useEffect(() => {
    if (isOpen) {
        loadConversations();
    }
  }, [isOpen]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  /*const fetchConnections = async () => {
    const currentUserId = localStorage.getItem("Id");
    try {
      setIsLoading(true);
      const response = await GetConnectionUser();

      const formattedConnections = response?.data?.data?.rows?.map((item: any) => ({
        id: item.friend_user.id,
        name: `${item.friend_user.profile.first_name} ${item.friend_user.profile.last_name}`,
        username: `@${item.friend_user.profile.first_name}`,
        profileImage: item.friend_user.profile.profile_picture,
        lastMessage: item?.conversation?.last_message,
        lastMessageTime: item?.conversation?.createdAt,
        unreadCount: item?.conversation?.user_id !== currentUserId ? item?.conversation?.unread_count : '',
        conversationId: item?.conversation?.id
      })) || [];
      
      setConnections(formattedConnections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      showToast({
        message: "Failed to load connections",
        type: "error",
        duration: 5000
      });
    } finally {
      setIsLoading(false);
    }
  };
*/  
  const handleConnectionClick = async (connection: Connection) => {
    setSelectedConnection(connection);
    setActiveTab("chat");
    
    try {
      // Set the active conversation in context
      const conversation = conversations.find(conv => conv.id === connection.conversationId);
      if (conversation) {
        setActiveConversation(conversation);
      }
      
      // Then load messages for this specific conversation
      const loadedMessages = await loadConversationMessages(connection.conversationId ?? "");
      
      // Use the loaded messages directly instead of waiting for state updates
      if (loadedMessages && loadedMessages.length > 0) {
        
        // Transform messages to the format expected by the widget
        const transformedMessages = loadedMessages.map(msg => ({
          id: msg.id,
          sender_id: msg.senderId.toString(),
          receiver_id: msg.receiverId.toString(),
          content: msg.content,
          createdAt: msg.timestamp,
          updatedAt: msg.timestamp,
          is_read: msg.isRead,
          conversation_id: msg.conversationId?.toString() || ""
        }));
        
        setMessages(transformedMessages);
      } else {
        console.log("No messages found for this conversation");
        setMessages([]);
      }
      
    } catch (error) {
      console.error("Error loading conversation data:", error);
      showToast({
        message: "Failed to load conversation data",
        type: "error",
        duration: 5000
      });
    }
  };

  const handleCloseWidget = () => {
    setIsOpen(false);
    setActiveTab("conversations");
    setSelectedConnection(null);
    setMessages([]);
    setActiveConversation(null);
  };

  const handleCloseConversation = async () => {
    // Clear the active conversation
    setActiveConversation(null);
    setSelectedConnection(null);
    setMessages([]);
    setActiveTab("conversations");
    
    // Refresh conversations to get updated unread counts
    try {
      await refreshConversations();
    } catch (error) {
      console.error("Error refreshing conversations:", error);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedConnection) return;

    try {
      // Use the sendMessage function from context
      await sendMessage(selectedConnection.id, newMessage);
      
      // Create a new message object
      const message: Message = {
        id: Date.now().toString(),
        sender_id: localStorage.getItem("Id") || "currentUser",
        receiver_id: selectedConnection.id.toString(),
        content: newMessage,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        is_read: false,
        conversation_id: selectedConnection.conversationId?.toString() || ""
      };

      setMessages(prev => [...prev, message]);
      setNewMessage("");
      showToast({
        message: "Message sent!",
        type: "success",
        duration: 5000
      });
    } catch (error) {
      console.error("Error sending message:", error);
      showToast({
        message: "Failed to send message",
        type: "error",
        duration: 5000
      });
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 48) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString();
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center z-50"
        style={{
          zIndex: 9999
        }}
        aria-label="Open messaging"
      >
        <MessageCircle size={24} />
      </button>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-gray-50 rounded-t-lg">
        <div className="flex items-center gap-3">
          <img
            src="/profile.png"
            alt="Your profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-gray-900">Messaging</h3>
            <p className="text-xs text-gray-500">Your conversations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCloseWidget}
            className="p-1 hover:bg-gray-200 rounded"
          >
            <X size={16} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "conversations" ? (
          /* Conversations List */
          <div className="h-full flex flex-col">
            {/* Connections List */}
            <div className="flex-1 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2">Loading connections...</p>
                </div>
              ) : (
                connections.map((connection) => (
                  <div
                    key={connection.id}
                    onClick={() => handleConnectionClick(connection)}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                  >
                    <img
                      src={connection.profileImage || "/profile.png"}
                      alt={connection.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900 text-sm truncate">
                          {connection.name}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {formatTime(connection.lastMessageTime || new Date().toISOString())}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">
                        {connection.lastMessage}
                      </p>
                    </div>
                    {connection.unreadCount && connection.unreadCount !== '' && Number(connection.unreadCount) > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {connection?.unreadCount}
                      </span>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        ) : (
          /* Individual Chat */
          <div className="h-full flex flex-col">
            {selectedConnection && (
              <>
                {/* Chat Header */}
                <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={selectedConnection.profileImage || "/profile.png"}
                      alt={selectedConnection.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div>
                      <h4 className="font-medium text-gray-900 text-sm">
                        {selectedConnection.name}
                      </h4>
                      <p className="text-xs text-gray-500">1st connection</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleCloseConversation}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X size={16} />
                    </button>
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {messages.map((message) => {
                    const currentUserId = localStorage.getItem("Id");
                    const isOwnMessage = message.sender_id === currentUserId;
                    
                    return (
                        <div
                        key={message.id}
                        className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                        <div
                            className={`max-w-xs px-3 py-2 rounded-lg text-sm ${
                            isOwnMessage
                                ? "bg-blue-600 text-white"
                                : "bg-gray-200 text-gray-900"
                            }`}
                        >
                            <p>{message.content}</p>
                            <p className={`text-xs mt-1 ${
                            isOwnMessage ? "text-blue-100" : "text-gray-500"
                            }`}>
                            {formatTime(message.createdAt)}
                            </p>
                        </div>
                        </div>
                    );
                })}

                <div ref={messagesEndRef} />
                </div>

                {/* Message Input */}
                <div className="p-3 border-t">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Send size={16} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <ImageIcon size={16} className="text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Paperclip size={16} className="text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Smile size={16} className="text-gray-500" />
                      </button>
                    </div>
                    <p className="text-xs text-gray-500">Press Enter to send</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PersistentMessagingWidget;
