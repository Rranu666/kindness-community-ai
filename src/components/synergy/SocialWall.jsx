import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Heart, MessageCircle, Send, Image, X, ChevronDown, ChevronUp } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function Avatar({ name, size = 36 }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const colors = ['from-rose-500 to-pink-500', 'from-indigo-500 to-violet-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-sky-500 to-cyan-500', 'from-purple-500 to-fuchsia-500'];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div className={`rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
}

function PostCard({ post, currentUser }) {
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');

  const { data: comments = [] } = useQuery({
    queryKey: ['comments', post.id],
    queryFn: () => base44.entities.SocialComment.filter({ post_id: post.id }, 'created_date', 50),
    enabled: showComments,
  });

  const liked = post.likes?.includes(currentUser?.email);

  const likeMutation = useMutation({
    mutationFn: async () => {
      const newLikes = liked
        ? (post.likes || []).filter(e => e !== currentUser.email)
        : [...(post.likes || []), currentUser.email];
      return base44.entities.SocialPost.update(post.id, { likes: newLikes, like_count: newLikes.length });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['socialPosts'] }),
  });

  const commentMutation = useMutation({
    mutationFn: () => base44.entities.SocialComment.create({
      post_id: post.id,
      author_email: currentUser.email,
      author_name: currentUser.full_name,
      content: commentText,
    }),
    onSuccess: async () => {
      setCommentText('');
      await base44.entities.SocialPost.update(post.id, { comment_count: (post.comment_count || 0) + 1 });
      queryClient.invalidateQueries({ queryKey: ['comments', post.id] });
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
    },
  });

  return (
    <div className="rounded-2xl border border-white/[0.07] overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <div className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <Avatar name={post.author_name} />
          <div>
            <div className="font-semibold text-white text-sm">{post.author_name}</div>
            <div className="text-xs text-white/30">
              {post.created_date ? formatDistanceToNow(new Date(post.created_date), { addSuffix: true }) : 'just now'}
            </div>
          </div>
        </div>
        <p className="text-white/80 text-sm leading-relaxed mb-3">{post.content}</p>
        {post.image_url && (
          <img src={post.image_url} alt="post" className="rounded-xl w-full object-cover max-h-72 mb-3" />
        )}
        <div className="flex items-center gap-5 pt-3 border-t border-white/[0.05]">
          <button
            onClick={() => currentUser && likeMutation.mutate()}
            className={`flex items-center gap-2 text-xs font-semibold transition-colors ${liked ? 'text-rose-400' : 'text-white/35 hover:text-rose-400'}`}
          >
            <Heart className={`w-4 h-4 ${liked ? 'fill-rose-400' : ''}`} />
            {post.like_count || 0}
          </button>
          <button
            onClick={() => setShowComments(!showComments)}
            className="flex items-center gap-2 text-xs font-semibold text-white/35 hover:text-white/70 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            {post.comment_count || 0} {showComments ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>
        </div>
      </div>

      {showComments && (
        <div className="border-t border-white/[0.06] px-5 py-4 space-y-3" style={{ background: 'rgba(0,0,0,0.15)' }}>
          {comments.map(c => (
            <div key={c.id} className="flex items-start gap-3">
              <Avatar name={c.author_name} size={28} />
              <div className="flex-1 rounded-xl px-3 py-2 text-xs" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <span className="font-semibold text-white/80 mr-2">{c.author_name}</span>
                <span className="text-white/60">{c.content}</span>
              </div>
            </div>
          ))}
          {currentUser && (
            <div className="flex gap-2 mt-2">
              <Avatar name={currentUser.full_name} size={28} />
              <div className="flex-1 flex items-center gap-2 rounded-xl border border-white/[0.08] px-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                <input
                  value={commentText}
                  onChange={e => setCommentText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && commentText.trim() && commentMutation.mutate()}
                  placeholder="Write a comment..."
                  className="flex-1 bg-transparent border-none outline-none text-xs text-white/80 py-2"
                />
                <button onClick={() => commentText.trim() && commentMutation.mutate()} disabled={!commentText.trim()}>
                  <Send className="w-3.5 h-3.5 text-rose-400 disabled:opacity-30" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function SocialWall({ currentUser }) {
  const queryClient = useQueryClient();
  const [postText, setPostText] = useState('');

  const { data: posts = [], isLoading } = useQuery({
    queryKey: ['socialPosts'],
    queryFn: () => base44.entities.SocialPost.list('-created_date', 30),
    refetchInterval: 15000,
  });

  const createPost = useMutation({
    mutationFn: () => base44.entities.SocialPost.create({
      author_email: currentUser.email,
      author_name: currentUser.full_name,
      content: postText,
      likes: [],
      like_count: 0,
      comment_count: 0,
    }),
    onSuccess: () => {
      setPostText('');
      queryClient.invalidateQueries({ queryKey: ['socialPosts'] });
    },
  });

  return (
    <div className="max-w-2xl mx-auto space-y-5 p-6">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        <h2 className="text-white font-black text-lg" style={{ fontFamily: "'Syne', sans-serif" }}>Social Wall</h2>
      </div>

      {currentUser && (
        <div className="rounded-2xl border border-white/[0.07] p-4" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <div className="flex gap-3">
            <Avatar name={currentUser.full_name} />
            <div className="flex-1">
              <textarea
                value={postText}
                onChange={e => setPostText(e.target.value)}
                placeholder="Share something with the community..."
                className="w-full bg-transparent border-none outline-none text-sm text-white/80 placeholder-white/25 resize-none"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  onClick={() => postText.trim() && createPost.mutate()}
                  disabled={!postText.trim() || createPost.isPending}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-40"
                  style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}
                >
                  <Send className="w-3.5 h-3.5" /> Post
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="text-center text-white/30 py-10 text-sm">Loading posts...</div>
      ) : posts.length === 0 ? (
        <div className="text-center text-white/30 py-10 text-sm">No posts yet. Be the first to share!</div>
      ) : (
        posts.map(post => <PostCard key={post.id} post={post} currentUser={currentUser} />)
      )}
    </div>
  );
}