import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Send, MessageCircle, Plus, Users, Lock, Loader2, Wifi, WifiOff, UserPlus, Check, Search } from 'lucide-react';
import { 
  getCircleChatrooms, createChatroom, joinChatroom, 
  getChatMessages, sendChatMessage, checkChatPermission, getUserId,
  getCircleMembers
} from '../../services/circlesApi';

interface ChatRoom {
  id: string;
  circle_id: string;
  name: string;
  description?: string;
  creator_id: string;
  members: string[];
  member_count: number;
  message_count: number;
  last_message_at: string;
}

interface ChatMessage {
  id: string;
  chatroom_id: string;
  user_id: string;
  content: string;
  mentions: string[];
  created_at: string;
}

interface CircleMember {
  id: string;
  user_id: string;
  role: string;
  joined_at: string;
}

interface ChatRoomListProps {
  circleId: string;
  isOpen: boolean;
  onClose: () => void;
}

const ChatRoomList: React.FC<ChatRoomListProps> = ({ circleId, isOpen, onClose }) => {
  const [chatrooms, setChatrooms] = useState<ChatRoom[]>([]);
  const [selectedChatroom, setSelectedChatroom] = useState<ChatRoom | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDesc, setNewRoomDesc] = useState('');
  const [creating, setCreating] = useState(false);
  const currentUserId = getUserId();

  useEffect(() => {
    if (isOpen) {
      fetchChatrooms();
    }
  }, [isOpen, circleId]);

  const fetchChatrooms = async () => {
    setLoading(true);
    try {
      const response = await getCircleChatrooms(circleId);
      setChatrooms(response.chatrooms || []);
    } catch (error) {
      console.error('Error fetching chatrooms:', error);
    }
    setLoading(false);
  };

  const handleCreateRoom = async () => {
    if (!newRoomName.trim()) return;
    
    setCreating(true);
    try {
      await createChatroom(circleId, newRoomName, newRoomDesc);
      setShowCreateForm(false);
      setNewRoomName('');
      setNewRoomDesc('');
      fetchChatrooms();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to create chatroom');
    }
    setCreating(false);
  };

  const handleSelectRoom = async (room: ChatRoom) => {
    if (!room.members.includes(currentUserId)) {
      try {
        await joinChatroom(room.id);
      } catch (error) {
        console.error('Error joining chatroom:', error);
      }
    }
    setSelectedChatroom(room);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  if (selectedChatroom) {
    return (
      <ChatRoomView 
        chatroom={selectedChatroom} 
        circleId={circleId}
        onBack={() => {
          setSelectedChatroom(null);
          fetchChatrooms();
        }}
        onClose={onClose}
      />
    );
  }

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col animate-slide-up">
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-gray-900">Chat Rooms</h3>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setShowCreateForm(true)}
              className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
            >
              <Plus className="w-5 h-5" />
            </button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {showCreateForm && (
          <div className="px-4 py-3 bg-purple-50 border-b border-purple-100">
            <input
              value={newRoomName}
              onChange={(e) => setNewRoomName(e.target.value)}
              placeholder="Room name..."
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              value={newRoomDesc}
              onChange={(e) => setNewRoomDesc(e.target.value)}
              placeholder="Description (optional)"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg text-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRoom}
                disabled={!newRoomName.trim() || creating}
                className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50"
              >
                {creating ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : chatrooms.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No chat rooms yet</p>
              <p className="text-sm mt-1">Create one to start chatting!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {chatrooms.map((room) => (
                <button
                  key={room.id}
                  onClick={() => handleSelectRoom(room)}
                  className="w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-xl text-left transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-gray-900">{room.name}</h4>
                    <span className="text-xs text-gray-500">{formatTime(room.last_message_at)}</span>
                  </div>
                  {room.description && (
                    <p className="text-sm text-gray-500 line-clamp-1 mb-2">{room.description}</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {room.member_count} members
                    </span>
                    <span>{room.message_count} messages</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Chat Room View Component with WebSocket support and Add Members
const ChatRoomView: React.FC<{
  chatroom: ChatRoom;
  circleId: string;
  onBack: () => void;
  onClose: () => void;
}> = ({ chatroom, circleId, onBack, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [canSend, setCanSend] = useState(false);
  const [userLevel, setUserLevel] = useState('');
  const [wsConnected, setWsConnected] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [showAddMembers, setShowAddMembers] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const currentUserId = getUserId();

  const getWebSocketUrl = useCallback(() => {
    const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || window.location.origin;
    const wsProtocol = backendUrl.startsWith('https') ? 'wss' : 'ws';
    const baseUrl = backendUrl.replace(/^https?:\/\//, '');
    return `${wsProtocol}://${baseUrl}/ws/chat/${chatroom.id}?user_id=${currentUserId}`;
  }, [chatroom.id, currentUserId]);

  const connectWebSocket = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) return;
    
    try {
      const wsUrl = getWebSocketUrl();
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;
      
      ws.onopen = () => {
        setWsConnected(true);
      };
      
      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'message':
              setMessages(prev => [...prev, {
                id: data.id,
                chatroom_id: chatroom.id,
                user_id: data.user_id,
                content: data.content,
                mentions: data.mentions || [],
                created_at: data.created_at
              }]);
              break;
            case 'typing':
              if (data.user_id !== currentUserId) {
                setTypingUsers(prev => {
                  const newSet = new Set(prev);
                  if (data.is_typing) newSet.add(data.user_id);
                  else newSet.delete(data.user_id);
                  return newSet;
                });
              }
              break;
          }
        } catch (e) {
          console.error('Error parsing WebSocket message:', e);
        }
      };
      
      ws.onclose = () => {
        setWsConnected(false);
        if (!reconnectTimeoutRef.current) {
          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectTimeoutRef.current = null;
            connectWebSocket();
          }, 3000);
        }
      };
    } catch (e) {
      console.error('Failed to connect WebSocket:', e);
    }
  }, [chatroom.id, currentUserId, getWebSocketUrl]);

  const disconnectWebSocket = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  const sendMessageViaWs = useCallback((content: string) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'message', content }));
      return true;
    }
    return false;
  }, []);

  const sendTypingIndicator = useCallback((isTyping: boolean) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'typing', is_typing: isTyping }));
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    checkPermission();
    connectWebSocket();
    
    const pingInterval = setInterval(() => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000);
    
    return () => {
      clearInterval(pingInterval);
      disconnectWebSocket();
    };
  }, [chatroom.id, connectWebSocket, disconnectWebSocket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const response = await getChatMessages(chatroom.id);
      setMessages(response.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
    setLoading(false);
  };

  const checkPermission = async () => {
    try {
      const response = await checkChatPermission(chatroom.id);
      setCanSend(response.can_send_messages);
      setUserLevel(response.user_level);
    } catch (error) {
      console.error('Error checking permission:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);
    sendTypingIndicator(true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => sendTypingIndicator(false), 2000);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !canSend) return;
    
    const messageContent = newMessage.trim();
    setNewMessage('');
    sendTypingIndicator(false);
    
    if (sendMessageViaWs(messageContent)) return;
    
    setSending(true);
    try {
      await sendChatMessage(chatroom.id, messageContent);
      fetchMessages();
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to send message');
      setNewMessage(messageContent);
    }
    setSending(false);
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const groupedMessages: { [date: string]: ChatMessage[] } = {};
  messages.forEach(msg => {
    const date = formatDate(msg.created_at);
    if (!groupedMessages[date]) groupedMessages[date] = [];
    groupedMessages[date].push(msg);
  });

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl h-[85vh] flex flex-col animate-slide-up">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{chatroom.name}</h3>
              {wsConnected ? (
                <Wifi className="w-4 h-4 text-green-500" />
              ) : (
                <WifiOff className="w-4 h-4 text-red-500" />
              )}
            </div>
            <p className="text-xs text-gray-500">
              {chatroom.member_count} members {wsConnected && '• Live'}
            </p>
          </div>
          <button 
            onClick={() => setShowAddMembers(true)}
            className="p-2 bg-purple-100 text-purple-600 rounded-full hover:bg-purple-200"
            title="Add members"
          >
            <UserPlus className="w-5 h-5" />
          </button>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <MessageCircle className="w-12 h-12 text-gray-300 mb-3" />
              <p>No messages yet</p>
              <p className="text-sm">Start the conversation!</p>
            </div>
          ) : (
            Object.entries(groupedMessages).map(([date, msgs]) => (
              <div key={date}>
                <div className="text-center my-4">
                  <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full">
                    {date}
                  </span>
                </div>
                {msgs.map((msg) => {
                  const isOwnMessage = msg.user_id === currentUserId;
                  return (
                    <div 
                      key={msg.id} 
                      className={`flex mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[75%]`}>
                        {!isOwnMessage && (
                          <span className="text-xs text-gray-500 ml-2">
                            User {msg.user_id.slice(0, 8)}
                          </span>
                        )}
                        <div className={`px-4 py-2 rounded-2xl ${
                          isOwnMessage 
                            ? 'bg-purple-600 text-white rounded-br-md' 
                            : 'bg-white text-gray-800 rounded-bl-md shadow-sm'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap">
                            {msg.content.split(/(@\S+)/g).map((part, i) => 
                              part.startsWith('@') ? (
                                <span key={i} className={isOwnMessage ? 'font-medium' : 'text-purple-600 font-medium'}>
                                  {part}
                                </span>
                              ) : part
                            )}
                          </p>
                        </div>
                        <span className={`text-xs text-gray-400 ${isOwnMessage ? 'mr-2 text-right block' : 'ml-2'}`}>
                          {formatTime(msg.created_at)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))
          )}
          
          {typingUsers.size > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500 ml-2">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span>Someone is typing...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          {!canSend ? (
            <div className="flex items-center justify-center gap-2 text-gray-500 py-2">
              <Lock className="w-4 h-4" />
              <span className="text-sm">Get Aspiring certification to chat</span>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <input
                value={newMessage}
                onChange={handleInputChange}
                placeholder="Type a message... Use @ to mention"
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || sending}
                className="p-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50"
              >
                {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Members Modal */}
      {showAddMembers && (
        <AddMembersModal
          chatroomId={chatroom.id}
          circleId={circleId}
          existingMembers={chatroom.members}
          onClose={() => setShowAddMembers(false)}
          onMembersAdded={() => {
            setShowAddMembers(false);
            // Refresh chatroom data
          }}
        />
      )}

      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

// Add Members Modal Component
const AddMembersModal: React.FC<{
  chatroomId: string;
  circleId: string;
  existingMembers: string[];
  onClose: () => void;
  onMembersAdded: () => void;
}> = ({ chatroomId, circleId, existingMembers, onClose, onMembersAdded }) => {
  const [circleMembers, setCircleMembers] = useState<CircleMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMembers, setSelectedMembers] = useState<Set<string>>(new Set());
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchCircleMembers();
  }, [circleId]);

  const fetchCircleMembers = async () => {
    setLoading(true);
    try {
      const response = await getCircleMembers(circleId);
      setCircleMembers(response.members || []);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
    setLoading(false);
  };

  const toggleMember = (userId: string) => {
    setSelectedMembers(prev => {
      const newSet = new Set(prev);
      if (newSet.has(userId)) {
        newSet.delete(userId);
      } else {
        newSet.add(userId);
      }
      return newSet;
    });
  };

  const handleAddMembers = async () => {
    if (selectedMembers.size === 0) return;
    
    setAdding(true);
    try {
      const backendUrl = import.meta.env.REACT_APP_BACKEND_URL || '';
      
      // Add each selected member to the chatroom
      for (const userId of selectedMembers) {
        await fetch(`${backendUrl}/api/circles/chatrooms/${chatroomId}/add-member?member_user_id=${userId}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' }
        });
      }
      
      onMembersAdded();
    } catch (error) {
      console.error('Error adding members:', error);
      alert('Failed to add some members');
    }
    setAdding(false);
  };

  // Filter out existing chatroom members and apply search
  const availableMembers = circleMembers.filter(m => {
    const notInChatroom = !existingMembers.includes(m.user_id);
    const matchesSearch = m.user_id.toLowerCase().includes(searchQuery.toLowerCase());
    return notInChatroom && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      <div className="relative bg-white rounded-2xl w-full max-w-md mx-4 max-h-[80vh] flex flex-col shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Add Members</h3>
            <p className="text-sm text-gray-500">Select circle members to add</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 py-3 border-b border-gray-100">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
        </div>

        {/* Members List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : availableMembers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p>No members to add</p>
              <p className="text-sm mt-1">All circle members are already in this chat</p>
            </div>
          ) : (
            <div className="space-y-2">
              {availableMembers.map((member) => {
                const isSelected = selectedMembers.has(member.user_id);
                return (
                  <button
                    key={member.id}
                    onClick={() => toggleMember(member.user_id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all ${
                      isSelected 
                        ? 'bg-purple-50 border-2 border-purple-500' 
                        : 'bg-gray-50 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium">
                      {member.user_id.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-left">
                      <p className="font-medium text-gray-900">User {member.user_id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-500 capitalize">{member.role}</p>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      isSelected ? 'bg-purple-600 text-white' : 'bg-gray-200'
                    }`}>
                      {isSelected && <Check className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500">
              {selectedMembers.size} member{selectedMembers.size !== 1 ? 's' : ''} selected
            </span>
            {selectedMembers.size > 0 && (
              <button
                onClick={() => setSelectedMembers(new Set())}
                className="text-sm text-purple-600 hover:text-purple-700"
              >
                Clear all
              </button>
            )}
          </div>
          <button
            onClick={handleAddMembers}
            disabled={selectedMembers.size === 0 || adding}
            className="w-full py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {adding ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <UserPlus className="w-5 h-5" />
                Add to Chat Room
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatRoomList;
