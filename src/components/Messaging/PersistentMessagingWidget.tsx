import React, { useState, useEffect, useRef } from "react";
// import { MessageCircle, X, Search, Send, Paperclip, Smile, Image as ImageIcon } from "lucide-react";
import { MessageCircle, X, Send, Paperclip } from "lucide-react";
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
  // Add new fields for attachments
  attachments?: Array<{
    id: string;
    type: 'image' | 'file';
    url: string;
    filename: string;
    size?: number;
  }>;
}

const PersistentMessagingWidget: React.FC = () => {
  
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"conversations" | "chat">("conversations");
  // const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<Connection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isLoading] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);
  // Add new state variables for image handling
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  // Add new state variables for image modal
  const [selectedImageForModal, setSelectedImageForModal] = useState<string | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  
  const { showToast } = useToast();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
          conversation_id: msg.conversationId?.toString() || "",
          attachments: msg.attachments
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

  // Function to trigger file input
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // Add new image modal functions
  
  // Function to open image modal
  const openImageModal = (imageUrl: string) => {
    setSelectedImageForModal(imageUrl);
    setIsImageModalOpen(true);
  };

  // Function to close image modal
  const closeImageModal = () => {
    setSelectedImageForModal(null);
    setIsImageModalOpen(false);
  };

  // Function to handle escape key press for modal
  const handleModalKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeImageModal();
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
    // Check if there's content or images to send
    if ((!newMessage.trim() && selectedImages.length === 0) || !selectedConnection) return;

    try {
      setIsUploading(true);
      
      let messageContent = newMessage.trim();
      
      // Send message with or without attachments using FormData
      if (messageContent || selectedImages.length > 0) {
        // Use the sendMessage function from context with attachments
        // This will create FormData internally and send to API
        await sendMessage(selectedConnection.id, messageContent, selectedImages);
        
        // Create a new message object for local display
        const message: Message = {
          id: Date.now().toString(),
          sender_id: localStorage.getItem("Id") || "currentUser",
          receiver_id: selectedConnection.id.toString(),
          content: messageContent,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          is_read: false,
          conversation_id: selectedConnection.conversationId?.toString() || "",
          // Create local attachments for display (using blob URLs for now)
          attachments: selectedImages.map((image, index) => ({
            id: Date.now().toString() + index,
            type: 'image' as const,
            url: URL.createObjectURL(image), // This is temporary - replace with actual Cloudinary URL from API response
            filename: image.name,
            size: image.size
          }))
        };

        setMessages(prev => [...prev, message]);
        setNewMessage("");
        clearImagePreviews(); // Clear image previews after sending
        
        showToast({
          message: "Message sent!",
          type: "success",
          duration: 5000
        });
      }
      
    } catch (error) {
      console.error("Error sending message:", error);
      showToast({
        message: "Failed to send message",
        type: "error",
        duration: 5000
      });
    } finally {
      setIsUploading(false);
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

  // Function to handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Filter only image files
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    
    if (imageFiles.length === 0) {
      showToast({
        message: "Please select only image files",
        type: "error",
        duration: 3000
      });
      return;
    }
    
    // Limit to 5 images
    if (selectedImages.length + imageFiles.length > 5) {
      showToast({
        message: "Maximum 5 images allowed",
        type: "error",
        duration: 3000
      });
      return;
    }
    
    // Add new images to existing ones
    setSelectedImages(prev => [...prev, ...imageFiles]);
    
    // Create preview URLs for new images
    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Function to remove image preview
  const removeImagePreview = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  // Function to clear all image previews
  const clearImagePreviews = () => {
    setSelectedImages([]);
    setImagePreviews([]);
  };

  // Function to trigger file input
  // const handleImageButtonClick = () => {
  //   fileInputRef.current?.click();
  // };

  
  useEffect(() => {
    const loggedInUser = localStorage.getItem("Id");
    
    if(loggedInUser) {
      setLoggedInUser(loggedInUser);
    }
  }, []);

  if(!loggedInUser) {
    return null;
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-20 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center z-50"
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
    <div className="fixed bottom-20 right-6 w-[30vw] h-[80vh] bg-white rounded-lg shadow-2xl border border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-blue-600 bg-blue-600 rounded-t-lg">
        <div className="flex items-center gap-3">
          <img
            src="/profile.png"
            alt="Your profile"
            className="w-8 h-8 rounded-full"
          />
          <div>
            <h3 className="font-semibold text-white">Messaging</h3>
            <p className="text-xs text-white">Your conversations</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleCloseWidget}
            className="p-1 bg-white rounded"
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
                    className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-blue-600"
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
                <div className="flex items-center justify-between p-3 border-b border-blue-600 bg-gray-50">
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
                <div className="flex-1 min-h-60 overflow-y-auto p-3 space-y-3">
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
                            {/* Message content - only show if there's content */}
                            {message.content && message.content.trim() !== "" && (
                              <p className="mb-2">{message.content}</p>
                            )}
                            
                            {/* Message attachments - show if attachments exist */}
                            {message.attachments && message.attachments.length > 0 && (
                              <div className="space-y-2">
                                {message.attachments.map((attachment) => (
                                  <div key={attachment.id} className="relative">
                                    {attachment.type === 'image' && (
                                      <img
                                        src={attachment.url}
                                        alt={attachment.filename}
                                        className="max-w-auto h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
                                        onClick={() => {
                                          // Open image modal when clicked
                                          openImageModal(attachment.url);
                                        }}
                                        onError={(e) => {
                                          // Handle image load errors
                                          console.error('Failed to load image:', attachment.url);
                                          e.currentTarget.style.display = 'none';
                                        }}
                                      />
                                    )}
                                    {attachment.type === 'file' && (
                                      <div className="flex items-center gap-2 p-2 bg-gray-100 rounded">
                                        <Paperclip size={16} />
                                        <span className="text-xs truncate">{attachment.filename}</span>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                            
                            {/* Show timestamp */}
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
                <div className="p-3 border-t border-blue-600">
                  {/* Image Previews */}
                  {imagePreviews.length > 0 && (
                    <div className="mb-3 p-2 bg-gray-50 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs text-gray-600">Selected Images ({imagePreviews.length})</span>
                        <button
                          onClick={clearImagePreviews}
                          className="text-xs text-red-500 hover:text-red-700"
                        >
                          Clear All
                        </button>
                      </div>
                      <div className="flex gap-2 overflow-x-auto">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="relative flex-shrink-0">
                            <img
                              src={preview}
                              alt={`Preview ${index + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <button
                              onClick={() => removeImagePreview(index)}
                              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <button 
                      className="p-1 h-9 w-9 flex justify-center items-center bg-blue-600 rounded"
                      onClick={handleImageButtonClick}
                      disabled={isUploading}
                      >
                        <Paperclip size={16} className="text-white" />
                    </button>
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Write a message..."
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg outline-none text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      disabled={isUploading}
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim() && selectedImages.length === 0}
                      className="p-2 w-9 h-9 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUploading ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <Send size={16} />
                      )}
                    </button>
                  </div>
                  {/* Hidden file input */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      
                      {/* <button className="p-1 hover:bg-gray-100 rounded">
                        <Paperclip size={16} className="text-gray-500" />
                      </button>
                      <button className="p-1 hover:bg-gray-100 rounded">
                        <Smile size={16} className="text-gray-500" />
                      </button> */}
                    </div>
                    <p className="text-xs text-gray-500">{isUploading ? "Uploading..." : "Press Enter to send"}</p>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      {/* Image Modal */}
      {isImageModalOpen && selectedImageForModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          onClick={closeImageModal} // Close modal when clicking outside
          onKeyDown={handleModalKeyDown} // Handle escape key
          tabIndex={0} // Make div focusable for keyboard events
        >
          {/* Modal Content */}
          <div className="relative max-w-[90vw] max-h-[90vh] p-4">
            {/* Close Button */}
            <button
              onClick={closeImageModal}
              className="absolute top-2 right-2 w-8 h-8 bg-white bg-opacity-20 hover:bg-opacity-30 text-gray-500 rounded-full flex items-center justify-center z-10 transition-all duration-200"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>
            
            {/* Image Container */}
            <div className="relative">
              <img
                src={selectedImageForModal}
                alt="Full size image"
                className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on image
              />
            </div>
            
            {/* Image Info */}
            <div className="mt-4 text-center text-white">
              <p className="text-sm opacity-80">
                Click outside or press ESC to close
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
    // </div>
  );
};

export default PersistentMessagingWidget;
