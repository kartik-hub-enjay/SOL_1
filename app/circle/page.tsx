'use me';
'use client';

import { useEffect, useState, useRef } from 'react';
import AppShell from '@/components/AppShell';
import {
  getCurrentUser,
  getCircleMessages,
  sendCircleMessage,
  getCircleForCommunity,
} from '@/lib/dataService';
import { UserProfile, CircleMessage, Circle, SEEDED_STUDENTS } from '@/lib/seedData';
import ConstellationSVG from '@/components/ConstellationSVG';
import { MessageSquare, Send, Users, Shield, Sparkles } from 'lucide-react';

export default function CirclePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTag, setActiveTag] = useState<string>('web-dev');
  const [circle, setCircle] = useState<Circle | null>(null);
  const [messages, setMessages] = useState<CircleMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const availableTopics = [
    { tag: 'web-dev', name: 'Web Dev Starter Pod' },
    { tag: 'cybersecurity', name: 'Cybersecurity Pod' },
    { tag: 'poetry', name: 'Poetry Circle' },
  ];

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    // Read stored profile primary interest if available
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('spark_fingerprint_profile');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.primary_interest) {
            setActiveTag(parsed.primary_interest);
          }
        } catch {}
      }
    }
  }, []);

  useEffect(() => {
    if (activeTag) {
      getCircleForCommunity(activeTag).then((c) => setCircle(c));
      getCircleMessages(activeTag).then((msgs) => {
        setMessages(msgs);
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
      });
    }
  }, [activeTag]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !user) return;

    setSending(true);
    const content = inputText.trim();
    setInputText('');

    const newMsg = await sendCircleMessage(activeTag, user, content);
    setMessages((prev) => [...prev, newMsg]);
    setSending(false);

    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const podMembers = SEEDED_STUDENTS.slice(0, 6);

  return (
    <AppShell>
      <div className="h-[calc(100vh-5rem)] md:h-screen flex flex-col bg-ink">
        {/* Circle Chat Top Header */}
        <header className="px-6 py-4 bg-ink-raised border-b border-paper/10 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-mist/15 border border-violet-mist/30 flex items-center justify-center text-violet-mist">
              <MessageSquare className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-bold text-lg text-paper tracking-tight">
                  {circle?.tier ? circle.tier.toUpperCase().replace('_', ' ') : 'STARTER POD'} · #{activeTag}
                </h1>
                <span className="w-2 h-2 rounded-full bg-signal animate-pulse" />
              </div>
              <p className="font-mono text-xs text-paper/50">
                TRUSTED CIRCLE · 6 PEERS MATCHED BY FINGERPRINT
              </p>
            </div>
          </div>

          {/* Topic Switcher Pills */}
          <div className="hidden sm:flex items-center space-x-2">
            {availableTopics.map((item) => (
              <button
                key={item.tag}
                onClick={() => setActiveTag(item.tag)}
                className={`px-3 py-1.5 rounded-lg font-mono text-xs transition-all cursor-pointer ${
                  activeTag === item.tag
                    ? 'bg-violet-mist/20 text-violet-mist font-bold border border-violet-mist/40'
                    : 'bg-ink text-paper/50 hover:text-paper border border-paper/10'
                }`}
              >
                #{item.tag}
              </button>
            ))}
          </div>
        </header>

        {/* Chat Body + Sidebar */}
        <div className="flex-1 flex min-h-0">
          {/* Main Message Stream */}
          <div className="flex-1 flex flex-col min-w-0 bg-ink">
            {/* Messages container */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.length === 0 ? (
                /* Empty state per Section 3 Voice guide */
                <div className="h-full flex flex-col items-center justify-center text-center p-8 text-paper/60 space-y-3">
                  <Sparkles className="w-8 h-8 text-ember/50" />
                  <p className="font-display font-medium text-base text-paper max-w-sm">
                    Say the first thing — someone here is thinking about the same thing you are.
                  </p>
                </div>
              ) : (
                messages.map((msg) => {
                  const isMe = user?.id === msg.user_id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start space-x-3 ${isMe ? 'flex-row-reverse space-x-reverse' : ''}`}
                    >
                      {/* Constellation Seal Icon */}
                      <div className="shrink-0 pt-0.5">
                        <ConstellationSVG
                          seedData={{
                            seed: (msg.user_display_name || msg.user_id).length * 77,
                            depth_first: 0.8,
                            overt_social: 0.5,
                            truth_seeking: 0.7,
                          }}
                          width={32}
                          height={32}
                          seal={true}
                        />
                      </div>

                      {/* Message Bubble */}
                      <div className={`max-w-md space-y-1 ${isMe ? 'items-end text-right' : ''}`}>
                        <div className="flex items-center space-x-2 font-mono text-[10px] text-paper/50">
                          <span className="font-bold text-paper/80">
                            {isMe ? 'You' : msg.user_display_name || 'Circle Peer'}
                          </span>
                          <span>·</span>
                          <span>
                            {new Date(msg.created_at).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-sm font-body leading-relaxed ${
                            isMe
                              ? 'bg-ember text-ink font-medium rounded-tr-none shadow-md shadow-ember/10'
                              : 'bg-ink-raised border border-paper/10 text-paper rounded-tl-none'
                          }`}
                        >
                          {msg.content}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Footer */}
            <form onSubmit={handleSendMessage} className="p-4 bg-ink-raised border-t border-paper/10 flex items-center space-x-3">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message your #${activeTag} circle...`}
                className="flex-1 px-4 py-3 rounded-xl bg-ink border border-paper/10 text-paper text-sm focus:outline-none focus:border-violet-mist transition-colors"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="py-3 px-5 rounded-xl bg-violet-mist text-ink font-display font-bold text-sm flex items-center space-x-2 hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer shadow-lg shadow-violet-mist/10"
              >
                <span>Send</span>
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

          {/* Right Sidebar: Circle Peers */}
          <aside className="hidden lg:block w-72 bg-ink-raised border-l border-paper/10 p-6 overflow-y-auto space-y-6">
            <div>
              <h3 className="font-mono text-xs font-bold text-paper/60 uppercase tracking-wider mb-3">
                Circle Members (6)
              </h3>
              <div className="space-y-3">
                {podMembers.map((m) => (
                  <div key={m.id} className="flex items-center space-x-3 p-2 rounded-xl bg-ink/50 border border-paper/5">
                    <ConstellationSVG
                      seedData={{ seed: m.id.length * 66, depth_first: 0.7, overt_social: 0.6, truth_seeking: 0.8 }}
                      width={28}
                      height={28}
                      seal={true}
                    />
                    <div className="overflow-hidden">
                      <div className="font-display font-bold text-xs text-paper truncate">{m.display_name}</div>
                      <div className="font-mono text-[10px] text-paper/40 truncate">{m.email.split('@')[1]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-ink border border-paper/10 text-xs font-mono text-paper/60 space-y-2">
              <div className="flex items-center space-x-1.5 text-signal font-bold">
                <Shield className="w-3.5 h-3.5" />
                <span>Circle Privacy Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Messages inside your Starter Pod stay private to your 6 circle members. Only aggregate engagement scores drive National Guild tier ladder progress.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </AppShell>
  );
}
