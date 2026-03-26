import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Send } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

function Avatar({ name, size = 32 }) {
  const initials = name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?';
  const colors = ['from-rose-500 to-pink-500', 'from-indigo-500 to-violet-500', 'from-emerald-500 to-teal-500', 'from-amber-500 to-orange-500', 'from-sky-500 to-cyan-500'];
  const color = colors[name?.charCodeAt(0) % colors.length] || colors[0];
  return (
    <div className={`rounded-full bg-gradient-to-br ${color} flex items-center justify-center text-white font-bold flex-shrink-0`}
      style={{ width: size, height: size, fontSize: size * 0.35 }}>
      {initials}
    </div>
  );
}

export default function GroupChat({ currentUser }) {
  const queryClient = useQueryClient();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const { data: messages = [] } = useQuery({
    queryKey: ['groupMessages'],
    queryFn: () => base44.entities.TeamMessage.filter({ message_type: 'group' }, 'created_date', 100),
    refetchInterval: 5000,
  });

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMutation = useMutation({
    mutationFn: () => base44.entities.TeamMessage.create({
      sender_email: currentUser.email,
      sender_name: currentUser.full_name,
      message: input,
      message_type: 'group',
    }),
    onSuccess: () => {
      setInput('');
      queryClient.invalidateQueries({ queryKey: ['groupMessages'] });
    },
  });

  const handleSend = () => { if (input.trim()) sendMutation.mutate(); };

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        <h2 className="text-white font-black text-base" style={{ fontFamily: "'Syne', sans-serif" }}>Team Chat</h2>
        <span className="text-xs text-white/30 ml-auto">{messages.length} messages</span>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-white/30 py-10 text-sm">No messages yet. Say hi! 👋</div>
        ) : (
          messages.map(msg => {
            const isMe = msg.sender_email === currentUser?.email;
            return (
              <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                {!isMe && <Avatar name={msg.sender_name} />}
                <div className={`max-w-[70%] ${isMe ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                  {!isMe && <span className="text-xs text-white/30 px-1">{msg.sender_name}</span>}
                  <div className={`px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${isMe ? 'text-white rounded-br-sm' : 'text-white/80 border border-white/[0.07] rounded-bl-sm'}`}
                    style={{ background: isMe ? 'linear-gradient(135deg, #f43f5e, #ec4899)' : 'rgba(255,255,255,0.05)' }}>
                    {msg.message}
                  </div>
                  <span className="text-[10px] text-white/20 px-1">
                    {msg.created_date ? formatDistanceToNow(new Date(msg.created_date), { addSuffix: true }) : ''}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      <div className="px-6 py-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-3 rounded-2xl border border-white/[0.08] px-4 py-3" style={{ background: 'rgba(255,255,255,0.03)' }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="Message the team..."
            className="flex-1 bg-transparent border-none outline-none text-sm text-white/80 placeholder-white/25"
          />
          <button onClick={handleSend} disabled={!input.trim()}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
            style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
            <Send className="w-3.5 h-3.5 text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}