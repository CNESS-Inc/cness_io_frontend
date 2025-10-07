import io, { Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;

  connect(token: string) {
    if (this.socket?.connected) {
      console.log('🟢 Socket already connected');
      return this.socket;
    }

    console.log('🔌 Connecting to socket server...');
    this.socket = io(import.meta.env.VITE_API_SOCKET_URL || 'http://localhost:3100', {
      auth: {
        token: token
      },
      transports: ['websocket', 'polling'],
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    });

    this.setupEventListeners();
    
    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('🟢 Connected to server');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error);
    });
  }

  // Join a conversation room
  joinConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('joinConversation', conversationId);
    }
  }

  // Leave a conversation room
  leaveConversation(conversationId: string) {
    if (this.socket) {
      this.socket.emit('leaveConversation', conversationId);
    }
  }

  // Send typing indicator
  sendTypingIndicator(conversationId: string, receiverId: string, isTyping: boolean) {
    if (this.socket) {
      this.socket.emit('typing', {
        conversationId,
        receiverId,
        isTyping
      });
    }
  }

  // Mark messages as read
  markAsRead(conversationId: string, senderId: string) {
    if (this.socket) {
      this.socket.emit('markAsRead', {
        conversationId,
        senderId
      });
    }
  }

  // Listen for new messages
  onNewMessage(callback: (messageData: any) => void) {
    if (this.socket) {
      this.socket.on('newMessage', callback);
    }
  }

  // Listen for typing indicators
  onTypingIndicator(callback: (data: { senderId: string, isTyping: boolean }) => void) {
    if (this.socket) {
      this.socket.on('typingIndicator', callback);
    }
  }

  // Listen for message read status
  onMessageRead(callback: (data: { conversationId: string, timestamp: Date }) => void) {
    if (this.socket) {
      this.socket.on('messageRead', callback);
    }
  }

  // Listen for notifications
  onNotification(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('notification', callback);
    }
  }

  // Listen for notification count
  onNotificationCount(callback: (data: any) => void) {
    if (this.socket) {
      this.socket.on('notificationCount', callback);
    }
  }

  // Remove all listeners for a specific event
  off(event: string, callback?: Function) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback as (...args: any[]) => void);
      } else {
        this.socket.removeAllListeners(event);
      }
    }
  }

  // Get socket instance
  getSocket() {
    return this.socket;
  }

  // Check if connected
  getIsConnected() {
    return this.isConnected;
  }

  // Disconnect
  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.isConnected = false;
    }
  }
}

export default new SocketService();