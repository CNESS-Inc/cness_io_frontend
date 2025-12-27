import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, ThumbsUp, ThumbsDown, CheckCircle, 
  Clock, ChevronDown, ChevronUp, Plus, Send, User,
  HelpCircle, Loader2, Tag, Eye, MessageSquare
} from 'lucide-react';
import axios from 'axios';

interface Prompt {
  id: string;
  circle_id: string;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  title: string;
  content: string;
  tags: string[];
  answer_count: number;
  upvotes: number;
  downvotes: number;
  views: number;
  is_pinned: boolean;
  is_closed: boolean;
  created_at: string;
}

interface Answer {
  id: string;
  prompt_id: string;
  parent_answer_id?: string;
  depth: number;
  author_id: string;
  author_name: string;
  author_avatar?: string;
  content: string;
  upvotes: number;
  downvotes: number;
  is_accepted: boolean;
  reply_count: number;
  created_at: string;
  replies?: Answer[];
}

interface PromptsQAProps {
  circleId: string;
  isMember: boolean;
}

const PromptsQA: React.FC<PromptsQAProps> = ({ circleId, isMember }) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [loadingAnswers, setLoadingAnswers] = useState(false);
  
  // Form state
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const userId = localStorage.getItem('Id') || localStorage.getItem('user_id') || 'guest';

  useEffect(() => {
    fetchPrompts();
  }, [circleId]);

  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/circles/${circleId}/prompts`);
      setPrompts(response.data.prompts || []);
    } catch (error) {
      console.error('Error fetching prompts:', error);
    }
    setLoading(false);
  };

  const fetchAnswers = async (promptId: string) => {
    setLoadingAnswers(true);
    try {
      const response = await axios.get(`/api/circles/prompts/${promptId}/answers`);
      setAnswers(response.data.answers || []);
    } catch (error) {
      console.error('Error fetching answers:', error);
    }
    setLoadingAnswers(false);
  };

  const handleCreatePrompt = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    setSubmitting(true);
    try {
      await axios.post(`/api/circles/${circleId}/prompts?user_id=${userId}`, {
        title: newTitle,
        content: newContent,
        tags: []
      });
      setNewTitle('');
      setNewContent('');
      setShowCreateForm(false);
      fetchPrompts();
    } catch (error) {
      console.error('Error creating prompt:', error);
    }
    setSubmitting(false);
  };

  const handleSubmitAnswer = async () => {
    if (!newAnswer.trim() || !selectedPrompt) return;
    setSubmitting(true);
    try {
      await axios.post(`/api/circles/prompts/${selectedPrompt.id}/answers?user_id=${userId}`, {
        content: newAnswer,
        parent_answer_id: null
      });
      setNewAnswer('');
      fetchAnswers(selectedPrompt.id);
      // Update answer count locally
      setPrompts(prompts.map(p => 
        p.id === selectedPrompt.id ? {...p, answer_count: p.answer_count + 1} : p
      ));
    } catch (error) {
      console.error('Error submitting answer:', error);
    }
    setSubmitting(false);
  };

  const handleSubmitReply = async (answerId: string) => {
    if (!replyContent.trim() || !selectedPrompt) return;
    setSubmitting(true);
    try {
      await axios.post(`/api/circles/prompts/${selectedPrompt.id}/answers?user_id=${userId}`, {
        content: replyContent,
        parent_answer_id: answerId
      });
      setReplyContent('');
      setReplyingTo(null);
      fetchAnswers(selectedPrompt.id);
    } catch (error) {
      console.error('Error submitting reply:', error);
    }
    setSubmitting(false);
  };

  const handleVote = async (type: 'prompt' | 'answer', id: string, vote: 'up' | 'down') => {
    try {
      if (type === 'prompt') {
        await axios.post(`/api/circles/prompts/${id}/vote?user_id=${userId}&vote=${vote}`);
        setPrompts(prompts.map(p => 
          p.id === id ? {...p, [vote === 'up' ? 'upvotes' : 'downvotes']: p[vote === 'up' ? 'upvotes' : 'downvotes'] + 1} : p
        ));
      } else {
        await axios.post(`/api/circles/answers/${id}/vote?user_id=${userId}&vote=${vote}`);
        fetchAnswers(selectedPrompt!.id);
      }
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return then.toLocaleDateString();
  };

  const selectPrompt = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    fetchAnswers(prompt.id);
  };

  // Answer component with threading support
  const AnswerCard: React.FC<{ answer: Answer; depth?: number }> = ({ answer, depth = 0 }) => {
    const maxDepth = 3;
    const indent = Math.min(depth, maxDepth) * 24;

    return (
      <div style={{ marginLeft: `${indent}px` }}>
        <div className={`p-4 rounded-xl ${answer.is_accepted ? 'bg-green-50 border-2 border-green-200' : 'bg-gray-50'} mb-3`}>
          {/* Answer Header */}
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
              {answer.author_avatar ? (
                <img src={answer.author_avatar} alt={answer.author_name} className="w-8 h-8 rounded-full" />
              ) : (
                <User className="w-4 h-4 text-purple-600" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-medium text-gray-900">{answer.author_name}</span>
                {answer.is_accepted && (
                  <span className="flex items-center gap-1 px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    Accepted
                  </span>
                )}
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {formatTimeAgo(answer.created_at)}
                </span>
              </div>
              <p className="text-gray-700 mt-2 whitespace-pre-wrap">{answer.content}</p>
              
              {/* Answer Actions */}
              <div className="flex items-center gap-4 mt-3">
                <button 
                  onClick={() => handleVote('answer', answer.id, 'up')}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600"
                >
                  <ThumbsUp className="w-4 h-4" />
                  {answer.upvotes}
                </button>
                <button 
                  onClick={() => handleVote('answer', answer.id, 'down')}
                  className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600"
                >
                  <ThumbsDown className="w-4 h-4" />
                  {answer.downvotes}
                </button>
                {isMember && depth < maxDepth && (
                  <button 
                    onClick={() => { setReplyingTo(answer.id); setReplyContent(''); }}
                    className="flex items-center gap-1 text-sm text-purple-600 hover:text-purple-700"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Reply
                  </button>
                )}
              </div>

              {/* Reply Input */}
              {replyingTo === answer.id && (
                <div className="mt-3 flex gap-2">
                  <input
                    type="text"
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a reply..."
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    onKeyDown={(e) => e.key === 'Enter' && handleSubmitReply(answer.id)}
                  />
                  <button
                    onClick={() => handleSubmitReply(answer.id)}
                    disabled={submitting || !replyContent.trim()}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg text-sm hover:bg-purple-700 disabled:opacity-50"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Reply'}
                  </button>
                  <button
                    onClick={() => setReplyingTo(null)}
                    className="px-3 py-2 text-gray-500 hover:text-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Nested Replies */}
        {answer.replies && answer.replies.length > 0 && (
          <div className="mt-2">
            {answer.replies.map((reply) => (
              <AnswerCard key={reply.id} answer={reply} depth={depth + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  // Detail View
  if (selectedPrompt) {
    return (
      <div className="space-y-4">
        {/* Back Button */}
        <button
          onClick={() => { setSelectedPrompt(null); setAnswers([]); }}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
        >
          <ChevronUp className="w-5 h-5 rotate-[-90deg]" />
          Back to Questions
        </button>

        {/* Question Detail */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-start gap-4">
            {/* Voting */}
            <div className="flex flex-col items-center gap-1">
              <button 
                onClick={() => handleVote('prompt', selectedPrompt.id, 'up')}
                className="p-2 rounded-lg hover:bg-green-50 text-gray-400 hover:text-green-600"
              >
                <ChevronUp className="w-6 h-6" />
              </button>
              <span className="text-lg font-bold text-gray-900">
                {selectedPrompt.upvotes - selectedPrompt.downvotes}
              </span>
              <button 
                onClick={() => handleVote('prompt', selectedPrompt.id, 'down')}
                className="p-2 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600"
              >
                <ChevronDown className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 mb-2">{selectedPrompt.title}</h2>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{selectedPrompt.content}</p>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {selectedPrompt.author_name}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {formatTimeAgo(selectedPrompt.created_at)}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="w-4 h-4" />
                  {selectedPrompt.views} views
                </span>
                <span className="flex items-center gap-1">
                  <MessageCircle className="w-4 h-4" />
                  {selectedPrompt.answer_count} answers
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Answer Input */}
        {isMember && !selectedPrompt.is_closed && (
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
            <h3 className="font-semibold text-gray-900 mb-3">Your Answer</h3>
            <textarea
              value={newAnswer}
              onChange={(e) => setNewAnswer(e.target.value)}
              placeholder="Share your knowledge or experience..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleSubmitAnswer}
                disabled={submitting || !newAnswer.trim()}
                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                Post Answer
              </button>
            </div>
          </div>
        )}

        {/* Answers List */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {selectedPrompt.answer_count} {selectedPrompt.answer_count === 1 ? 'Answer' : 'Answers'}
          </h3>
          
          {loadingAnswers ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-purple-600" />
            </div>
          ) : answers.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-xl">
              <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">No answers yet. Be the first to answer!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {answers.map((answer) => (
                <AnswerCard key={answer.id} answer={answer} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Questions & Answers</h3>
          <p className="text-sm text-gray-500">{prompts.length} questions</p>
        </div>
        {isMember && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700"
          >
            <Plus className="w-5 h-5" />
            Ask Question
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-purple-200">
          <h4 className="font-semibold text-gray-900 mb-4">Ask a Question</h4>
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="What's your question? Be specific."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl mb-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <textarea
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            placeholder="Provide details about your question..."
            rows={4}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button
              onClick={() => { setShowCreateForm(false); setNewTitle(''); setNewContent(''); }}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              onClick={handleCreatePrompt}
              disabled={submitting || !newTitle.trim() || !newContent.trim()}
              className="flex items-center gap-2 px-6 py-2 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 disabled:opacity-50"
            >
              {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <HelpCircle className="w-4 h-4" />}
              Post Question
            </button>
          </div>
        </div>
      )}

      {/* Questions List */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 animate-pulse">
              <div className="flex gap-4">
                <div className="w-12 h-20 bg-gray-200 rounded" />
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : prompts.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100">
          <HelpCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h4 className="text-lg font-semibold text-gray-900 mb-2">No Questions Yet</h4>
          <p className="text-gray-500 mb-4">Be the first to ask a question in this community!</p>
          {isMember && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-2.5 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700"
            >
              Ask the First Question
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {prompts.map((prompt) => (
            <div
              key={prompt.id}
              onClick={() => selectPrompt(prompt)}
              className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-200 cursor-pointer transition-all"
            >
              <div className="flex gap-4">
                {/* Vote Count */}
                <div className="flex flex-col items-center justify-center min-w-[50px] py-2 px-3 bg-gray-50 rounded-xl">
                  <span className="text-lg font-bold text-gray-900">{prompt.upvotes - prompt.downvotes}</span>
                  <span className="text-xs text-gray-500">votes</span>
                </div>
                
                {/* Answer Count */}
                <div className={`flex flex-col items-center justify-center min-w-[50px] py-2 px-3 rounded-xl ${
                  prompt.answer_count > 0 ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-500'
                }`}>
                  <span className="text-lg font-bold">{prompt.answer_count}</span>
                  <span className="text-xs">answers</span>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-900 mb-1 line-clamp-2">{prompt.title}</h4>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-2">{prompt.content}</p>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>{prompt.author_name}</span>
                    <span>•</span>
                    <span>{formatTimeAgo(prompt.created_at)}</span>
                    <span>•</span>
                    <span>{prompt.views} views</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PromptsQA;
