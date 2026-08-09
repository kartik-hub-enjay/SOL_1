'use client';

import { useEffect, useState, useRef } from 'react';
import AppShell from '@/components/AppShell';
import AvatarList, { AvatarListItem } from '@/components/AvatarList';
import {
  getCurrentUser,
  getCircleMessages,
  sendCircleMessage,
  getCircleForCommunity,
  getJoinedCommunityIds,
  getCommunities,
} from '@/lib/dataService';
import { UserProfile, CircleMessage, Circle, Community } from '@/lib/seedData';
import ConstellationSVG from '@/components/ConstellationSVG';
import {
  MessageSquare,
  Send,
  Sparkles,
  Code,
  Shield,
  Feather,
  Palette,
  Mic,
  Music,
  Bot,
  Database,
} from 'lucide-react';

const tagIconMap: Record<string, any> = {
  'web-dev': Code,
  'cybersecurity': Shield,
  'poetry': Feather,
  'design': Palette,
  'debate': Mic,
  'music-production': Music,
  'robotics': Bot,
  'data-science': Database,
};

export default function CirclePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [activeTag, setActiveTag] = useState<string>('web-dev');
  const [circle, setCircle] = useState<Circle | null>(null);
  const [messages, setMessages] = useState<CircleMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [sending, setSending] = useState(false);
  const [allCommunities, setAllCommunities] = useState<Community[]>([]);
  const [joinedIds, setJoinedIds] = useState<string[]>([]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);
    setJoinedIds(getJoinedCommunityIds());

    getCommunities().then((comms) => setAllCommunities(comms));

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

  // Only show joined communities in the AvatarList
  const joinedCommunities = allCommunities.filter((c) => joinedIds.includes(c.id));
  const displayCommunities = joinedCommunities.length > 0 ? joinedCommunities : allCommunities.slice(0, 3);

  const avatarItemsWithActive: AvatarListItem[] = displayCommunities.map((comm) => ({
    id: comm.id,
    name: comm.name,
    tag: comm.tag,
    icon: tagIconMap[comm.tag] || Sparkles,
    active: comm.tag === activeTag,
  }));

  return (
    <AppShell>
      <div className="h-full flex flex-col bg-black text-paper overflow-hidden">
        {/* Circle Chat Top Header - FIXED / STICKY */}
        <header className="px-6 py-3.5 bg-black border-b border-paper/10 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#2e4ed2]/20 border border-[#2e4ed2]/40 flex items-center justify-center text-[#2e4ed2]">
              <MessageSquare className="w-5 h-5" />
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-bold text-lg text-paper tracking-tight">
                  {circle?.tier ? circle.tier.toUpperCase().replace('_', ' ') : 'STARTER POD'} · #{activeTag}
                </h1>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="font-mono text-xs text-paper/50">
                TRUSTED CIRCLE · 6 PEERS MATCHED BY FINGERPRINT
              </p>
            </div>
          </div>

          {/* Joined Circles Avatar List Selector */}
          <div className="flex items-center space-x-3">
            <span className="hidden sm:inline font-mono text-xs text-paper/40 uppercase tracking-wider">
              My Joined Circles:
            </span>
            <AvatarList
              items={avatarItemsWithActive}
              onSelect={(item) => setActiveTag(item.tag)}
            />
          </div>
        </header>

        {/* Main Message Stream */}
        <div className="flex-1 flex flex-col min-w-0 bg-black overflow-hidden">
          {/* Messages container - INTERNAL SCROLL ONLY */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 min-h-0">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-8 text-paper/60 space-y-3">
                <Sparkles className="w-8 h-8 text-[#ee9dd6]/60" />
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
                            ? 'bg-[#2e4ed2] text-white font-medium rounded-tr-none shadow-md shadow-[#2e4ed2]/20'
                            : 'bg-black/85 border border-paper/15 text-paper rounded-tl-none'
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

          {/* Input Footer with centered, taller rounded input and inner send button */}
          <form onSubmit={handleSendMessage} className="p-4 bg-black border-t border-paper/10 shrink-0">
            <div className="max-w-2xl mx-auto relative w-full flex items-center border border-paper/20 rounded-full px-5 py-3 bg-transparent focus-within:border-[#2e4ed2] transition-colors shadow-sm">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Message your #${activeTag} circle...`}
                className="w-full pr-12 text-sm text-paper bg-transparent focus:outline-none placeholder:text-paper/40"
              />
              <button
                type="submit"
                disabled={!inputText.trim() || sending}
                className="absolute right-2 p-2.5 rounded-full bg-paper/10 text-paper hover:bg-[#2e4ed2] hover:text-white disabled:opacity-30 disabled:hover:bg-paper/10 disabled:hover:text-paper transition-all cursor-pointer flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </AppShell>
  );
}
