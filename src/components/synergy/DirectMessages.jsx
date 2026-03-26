import { useState, useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Send, ArrowLeft } from 'lucide-react';
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

export default function DirectMessages({ currentUser }) {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  const { data: teamMembers = [] } = useQuery({
    queryKey: ['teamMembers'],
    queryFn: () => base44.entities.TeamMember.list(),
  });

  const { data: allDMs = [] } = useQuery({
    queryKey: ['directMessages', currentUser?.email],
    queryFn: () => base44.entities.TeamMessage.filter({ message_type: 'direct' }, 'created_date', 200),
    refetchInterval: 5000,
    enabled: !!currentUser,
  });

  const conversation = allDMs.filter(m =>
    (m.sender_email === currentUser?.email && m.receiver_email === selectedUser?.email) ||
    (m.sender_email === selectedUser?.email && m.receiver_email === currentUser?.email)
  );

  // Get unique contacts from DM history + team members
  const contactEmails = new Set(allDMs.flatMap(m => [m.sender_email, m.receiver_email]).filter(e => e !== currentUser?.email));
  const contacts = teamMembers.filter(m => m.email !== currentUser?.email);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation.length]);

  const sendMutation = useMutation({
    mutationFn: () => base44.entities.TeamMessage.create({
      sender_email: currentUser.email,
      sender_name: currentUser.full_name,
      receiver_email: selectedUser.email,
      message: input,
      message_type: 'direct',
    }),
    onSuccess: () => {
      setInput('');
      queryClient.invalidateQueries({ queryKey: ['directMessages', currentUser?.email] });
    },
  });

  if (selectedUser) {
    return (
      <div className="flex flex-col h-full">
        <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
          <button onClick={() => setSelectedUser(null)} className="text-white/40 hover:text-white transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <Avatar name={selectedUser.full_name} />
          <div>
            <div className="text-white font-semibold text-sm">{selectedUser.full_name}</div>
            <div className="text-xs text-white/30">{selectedUser.department || selectedUser.email}</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {conversation.length === 0 ? (
            <div className="text-center text-white/30 py-10 text-sm">Start a conversation with {selectedUser.full_name}</div>
          ) : (
            conversation.map(msg => {
              const isMe = msg.sender_email === currentUser?.email;
              return (
                <div key={msg.id} className={`flex items-end gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  {!isMe && <Avatar name={msg.sender_name} />}
                  <div className={`max-w-[70%] flex flex-col gap-1 ${isMe ? 'items-end' : 'items-start'}`}>
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
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && input.trim() && sendMutation.mutate()}
              placeholder={`Message ${selectedUser.full_name}...`}
              className="flex-1 bg-transparent border-none outline-none text-sm text-white/80 placeholder-white/25"
            />
            <button onClick={() => input.trim() && sendMutation.mutate()} disabled={!input.trim()}
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-all disabled:opacity-30"
              style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>
              <Send className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-3">
        <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
        <h2 className="text-white font-black text-base" style={{ fontFamily: "'Syne', sans-serif" }}>Direct Messages</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {contacts.length === 0 ? (
          <div className="text-center text-white/30 py-10 text-sm">No team members found</div>
        ) : (
          contacts.map(member => {
            const lastMsg = allDMs.filter(m =>
              (m.sender_email === currentUser?.email && m.receiver_email === member.email) ||
              (m.sender_email === member.email && m.receiver_email === currentUser?.email)
            ).slice(-1)[0];
            const unread = allDMs.filter(m => m.sender_email === member.email && m.receiver_email === currentUser?.email).length;
            return (
              <button key={member.id} onClick={() => setSelectedUser(member)}
                className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-all text-left">
                <Avatar name={member.full_name} />
                <div className="flex-1 min-w-0">
                  <div className="text-white font-semibold text-sm">{member.full_name}</div>
                  <div className="text-xs text-white/30 truncate">{lastMsg ? lastMsg.message : member.department || 'Start a conversation'}</div>
                </div>
                {unread > 0 && (
                  <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #f43f5e, #ec4899)' }}>{unread}</span>
                )}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}