import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Heart, Reply, MoreHorizontal, Loader2, AtSign } from 'lucide-react';
import { getPostComments, createComment, likeComment, deleteComment, getUserId } from '../../services/circlesApi';

interface Comment {
  id: string;
  post_id: string;
  user_id: string;
  content: string;
  parent_comment_id?: string;
  mentions: string[];
  likes_count: number;
  replies_count: number;
  created_at: string;
  replies?: Comment[];
}

interface CommentModalProps {
  postId: string;
  isOpen: boolean;
  onClose: () => void;
  onCommentAdded?: () => void;
}

const CommentModal: React.FC<CommentModalProps> = ({ postId, isOpen, onClose, onCommentAdded }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const currentUserId = getUserId();

  useEffect(() => {
    if (isOpen) {
      fetchComments();
    }
  }, [isOpen, postId]);

  useEffect(() => {
    if (replyingTo && inputRef.current) {
      inputRef.current.focus();
      setNewComment(`@${replyingTo.user_id.slice(0, 8)} `);
    }
  }, [replyingTo]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await getPostComments(postId);
      setComments(response.comments || []);
    } catch (error) {
      console.error('Error fetching comments:', error);
    }
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    try {
      await createComment(postId, newComment, replyingTo?.id);
      setNewComment('');
      setReplyingTo(null);
      fetchComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error creating comment:', error);
    }
    setSubmitting(false);
  };

  const handleLikeComment = async (commentId: string) => {
    try {
      await likeComment(commentId);
      fetchComments();
    } catch (error) {
      console.error('Error liking comment:', error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId);
      fetchComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 7) return `${days}d`;
    return date.toLocaleDateString();
  };

  const renderComment = (comment: Comment, isReply = false) => (
    <div key={comment.id} className={`${isReply ? 'ml-10 mt-3' : 'mb-4'}`}>
      <div className="flex gap-3">
        {/* Avatar */}
        <div className={`${isReply ? 'w-8 h-8' : 'w-10 h-10'} rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white font-medium flex-shrink-0`}>
          {comment.user_id.charAt(0).toUpperCase()}
        </div>
        
        <div className="flex-1 min-w-0">
          {/* Comment Content */}
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm text-gray-900">
                User {comment.user_id.slice(0, 8)}
              </span>
              <span className="text-xs text-gray-500">{formatTime(comment.created_at)}</span>
            </div>
            <p className="text-gray-800 text-sm mt-1 whitespace-pre-wrap">
              {comment.content.split(/(@\S+)/g).map((part, i) => 
                part.startsWith('@') ? (
                  <span key={i} className="text-purple-600 font-medium">{part}</span>
                ) : part
              )}
            </p>
          </div>
          
          {/* Actions */}
          <div className="flex items-center gap-4 mt-1 ml-2">
            <button 
              onClick={() => handleLikeComment(comment.id)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-500 transition-colors"
            >
              <Heart className={`w-3.5 h-3.5 ${comment.likes_count > 0 ? 'fill-red-500 text-red-500' : ''}`} />
              {comment.likes_count > 0 && comment.likes_count}
            </button>
            <button 
              onClick={() => setReplyingTo(comment)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors"
            >
              <Reply className="w-3.5 h-3.5" />
              Reply
            </button>
            {comment.user_id === currentUserId && (
              <button
                onClick={() => handleDeleteComment(comment.id)}
                className="text-xs text-gray-400 hover:text-red-500 transition-colors"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Replies */}
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map(reply => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal - Slide up from bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-h-[85vh] flex flex-col transform transition-transform animate-slide-up"
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900">Comments</h3>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No comments yet</p>
              <p className="text-sm mt-1">Be the first to comment!</p>
            </div>
          ) : (
            comments.map(comment => renderComment(comment))
          )}
        </div>
        
        {/* Reply indicator */}
        {replyingTo && (
          <div className="px-4 py-2 bg-purple-50 border-t border-purple-100 flex items-center justify-between">
            <span className="text-sm text-purple-600">
              Replying to <strong>User {replyingTo.user_id.slice(0, 8)}</strong>
            </span>
            <button 
              onClick={() => {
                setReplyingTo(null);
                setNewComment('');
              }}
              className="p-1 hover:bg-purple-100 rounded-full"
            >
              <X className="w-4 h-4 text-purple-600" />
            </button>
          </div>
        )}
        
        {/* Comment Input */}
        <div className="px-4 py-3 border-t border-gray-100 bg-white">
          <div className="flex items-end gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
              {currentUserId.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 relative">
              <textarea
                ref={inputRef}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment... Use @ to mention someone"
                rows={1}
                className="w-full px-4 py-2.5 bg-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmitComment();
                  }
                }}
              />
            </div>
            <button
              onClick={handleSubmitComment}
              disabled={!newComment.trim() || submitting}
              className="p-2.5 bg-purple-600 text-white rounded-full hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      
      <style>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default CommentModal;
