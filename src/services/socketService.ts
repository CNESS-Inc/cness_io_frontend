import io, { Socket } from 'socket.io-client';

class SocketService {
  private socket: Socket | null = null;
  private isConnected = false;
  private listenersSet = false;

  connect(token: string) {
    // If socket already exists, return it (even if connecting)
    if (this.socket) {
      console.log('🟢 Socket instance already exists, reusing...');
      return this.socket;
    }

    console.log('🔌 Connecting to socket server...');
    this.socket = io(import.meta.env.VITE_API_SOCKET_URL || 'http://localhost:3100', {
      auth: {
        token: token
      },
      transports: ['polling', 'websocket'], // Try polling first for reliability
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      timeout: 10000
    });

    this.setupEventListeners();

    return this.socket;
  }

  private setupEventListeners() {
    if (!this.socket || this.listenersSet) return;

    this.socket.on('connect', () => {
      console.log('🟢 Connected to socket server (transport:', this.socket?.io.engine.transport.name, ')');
      this.isConnected = true;
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
      this.isConnected = false;
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Connection error:', error.message);
    });

    this.listenersSet = true;
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

  // Set active conversation (for notification logic)
  setActiveConversation(conversationId: string | null) {
    if (this.socket) {
      this.socket.emit('setActiveConversation', conversationId);
      console.log(`👁️ Set active conversation:`, conversationId);
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

  // Send message via socket
  sendMessage(data: {
    conversationId: string | number;
    receiverId: string | number;
    content: string;
    attachments?: string[]; // Array of attachment URLs (already uploaded)
  }) {
    if (this.socket) {
      this.socket.emit('sendMessage', data);
      console.log('📤 Sending message via socket:', data);
    } else {
      console.error('❌ Cannot send message: Socket not connected');
      throw new Error('Socket not connected');
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

  // Listen for message notifications (when receiver doesn't have conversation open)
  onMessageNotification(callback: (data: {
    type: string,
    conversationId: string,
    senderId: string,
    senderName: string,
    content: string,
    timestamp: string
  }) => void) {
    if (this.socket) {
      this.socket.on('messageNotification', callback);
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

  // Listen for message send acknowledgment
  onMessageSent(callback: (data: { success: boolean; message?: any; error?: string }) => void) {
    if (this.socket) {
      this.socket.on('messageSent', callback);
    }
  }

  // Listen for message send errors
  onMessageError(callback: (data: { error: string; originalMessage?: any }) => void) {
    if (this.socket) {
      this.socket.on('messageError', callback);
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
      this.listenersSet = false;
    }
  }

  // Wait for socket to be ready
  waitForConnection(): Promise<Socket> {
    return new Promise((resolve, reject) => {
      if (this.socket?.connected) {
        resolve(this.socket);
        return;
      }

      if (!this.socket) {
        reject(new Error('Socket not initialized'));
        return;
      }

      const timeout = setTimeout(() => {
        reject(new Error('Socket connection timeout'));
      }, 10000);

      this.socket.once('connect', () => {
        clearTimeout(timeout);
        if (this.socket) {
          resolve(this.socket);
        }
      });

      this.socket.once('connect_error', (error) => {
        clearTimeout(timeout);
        reject(error);
      });
    });
  }
}

export default new SocketService();