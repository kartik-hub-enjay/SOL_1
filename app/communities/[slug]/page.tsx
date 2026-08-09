'use me';
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import AppShell from '@/components/AppShell';
import {
  getCommunityBySlug,
  getOpportunities,
  getJoinedCommunityIds,
  toggleCommunityMembership,
  getCurrentUser,
} from '@/lib/dataService';
import { Community, Opportunity, UserProfile, SEEDED_STUDENTS } from '@/lib/seedData';
import ConstellationSVG from '@/components/ConstellationSVG';
import {
  Users,
  MessageSquare,
  Award,
  Send,
  Check,
  ArrowLeft,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface FeedPost {
  id: string;
  authorName: string;
  authorEmail: string;
  content: string;
  createdAt: string;
}

export default function SingleCommunityPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const [community, setCommunity] = useState<Community | null>(null);
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [joined, setJoined] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);

  // Feed posts
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [newPostText, setNewPostText] = useState('');

  useEffect(() => {
    const currentUser = getCurrentUser();
    setUser(currentUser);

    if (slug) {
      getCommunityBySlug(slug).then((comm) => {
        if (comm) {
          setCommunity(comm);
          const joinedList = getJoinedCommunityIds();
          setJoined(joinedList.includes(comm.id));

          getOpportunities(comm.tag).then((opps) => setOpportunities(opps));

          // Seed sample feed posts for this community
          const samplePosts: FeedPost[] = [
            {
              id: 'p1',
              authorName: SEEDED_STUDENTS[1].display_name,
              authorEmail: SEEDED_STUDENTS[1].email,
              content: `Excited for this week's ${comm.name} sprint! Check out the upcoming opportunity listed on the sidebar.`,
              createdAt: '2 hours ago',
            },
            {
              id: 'p2',
              authorName: SEEDED_STUDENTS[2].display_name,
              authorEmail: SEEDED_STUDENTS[2].email,
              content: `Has anyone reviewed the latest papers on ${comm.tag}? Let's discuss in our Circle chat tonight!`,
              createdAt: '5 hours ago',
            },
          ];

          if (typeof window !== 'undefined') {
            const localPostsKey = `spark_posts_${comm.slug}`;
            const stored = localStorage.getItem(localPostsKey);
            if (stored) {
              try {
                setPosts(JSON.parse(stored));
              } catch {
                setPosts(samplePosts);
              }
            } else {
              setPosts(samplePosts);
            }
          }
        }
      });
    }
  }, [slug]);

  const handleToggleJoin = () => {
    if (!community) return;
    const next = toggleCommunityMembership(community.id);
    setJoined(next.includes(community.id));
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() || !user || !community) return;

    const newPost: FeedPost = {
      id: `post-${Date.now()}`,
      authorName: user.display_name,
      authorEmail: user.email,
      content: newPostText,
      createdAt: 'Just now',
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    setNewPostText('');

    if (typeof window !== 'undefined') {
      localStorage.setItem(`spark_posts_${community.slug}`, JSON.stringify(updated));
    }
  };

  if (!community) {
    return (
      <AppShell>
        <div className="p-8 text-center text-paper/50 font-mono">Loading community...</div>
      </AppShell>
    );
  }

  const members = SEEDED_STUDENTS.slice(0, 8);

  return (
    <AppShell>
      <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
        {/* Back Link */}
        <Link
          href="/communities"
          className="inline-flex items-center space-x-1.5 font-mono text-xs text-paper/60 hover:text-paper transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Communities</span>
        </Link>

        {/* Community Header Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-ink-raised border border-paper/10 relative overflow-hidden space-y-4">
          <div
            className="absolute top-0 right-0 w-64 h-64 opacity-10 rounded-full blur-3xl pointer-events-none"
            style={{ backgroundColor: community.cover_accent }}
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
            <div className="space-y-2">
              <div className="flex items-center space-x-3">
                <span
                  className="px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider"
                  style={{
                    backgroundColor: `${community.cover_accent}20`,
                    color: community.cover_accent,
                    border: `1px solid ${community.cover_accent}40`,
                  }}
                >
                  #{community.tag}
                </span>
                <span className="text-xs font-mono text-paper/50 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>52 Active Members</span>
                </span>
              </div>

              <h1 className="font-display font-bold text-3xl sm:text-4xl text-paper">
                {community.name}
              </h1>

              <p className="text-sm text-paper/70 font-body max-w-2xl">
                {community.description}
              </p>
            </div>

            <button
              onClick={handleToggleJoin}
              className={`py-3 px-6 rounded-xl font-mono text-xs font-bold flex items-center space-x-2 transition-all cursor-pointer shadow-lg ${
                joined
                  ? 'bg-signal/20 text-signal border border-signal/40'
                  : 'bg-ember text-ink hover:opacity-90 shadow-ember/10'
              }`}
            >
              {joined ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Joined Community</span>
                </>
              ) : (
                <span>Join Community</span>
              )}
            </button>
          </div>
        </div>

        {/* Main Grid: Feed & Sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Feed Column (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            <h2 className="font-display font-bold text-xl text-paper flex items-center space-x-2">
              <MessageSquare className="w-5 h-5 text-ember" />
              <span>Community Feed & Discussion</span>
            </h2>

            {/* Post Creation Box */}
            <form onSubmit={handleCreatePost} className="p-4 rounded-2xl bg-ink-raised border border-paper/10 space-y-3">
              <textarea
                rows={3}
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder={`Share an update or question with ${community.name}...`}
                className="w-full p-3 rounded-xl bg-ink border border-paper/10 text-paper text-sm focus:outline-none focus:border-ember transition-colors"
              />
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={!newPostText.trim()}
                  className="py-2 px-5 rounded-xl bg-ember text-ink font-display font-bold text-xs flex items-center space-x-1.5 hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
                >
                  <span>Post Update</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>

            {/* Feed Posts */}
            <div className="space-y-4">
              {posts.map((post) => (
                <div key={post.id} className="p-5 rounded-2xl bg-ink-raised border border-paper/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-violet-mist/20 border border-violet-mist/40 flex items-center justify-center font-bold text-violet-mist text-xs">
                        {post.authorName[0]}
                      </div>
                      <div>
                        <div className="font-display font-bold text-xs text-paper">{post.authorName}</div>
                        <div className="font-mono text-[10px] text-paper/40">{post.authorEmail}</div>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] text-paper/40">{post.createdAt}</span>
                  </div>

                  <p className="text-sm text-paper/80 font-body leading-relaxed">{post.content}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar (1 col) */}
          <div className="space-y-6">
            {/* Members Section */}
            <div className="p-6 rounded-2xl bg-ink-raised border border-paper/10 space-y-4">
              <h3 className="font-display font-bold text-sm text-paper uppercase tracking-wider font-mono text-paper/80">
                Community Members ({members.length + 42})
              </h3>
              <div className="space-y-3">
                {members.map((m) => (
                  <div key={m.id} className="flex items-center space-x-3">
                    <ConstellationSVG
                      seedData={{ seed: m.id.length * 88, depth_first: 0.7, overt_social: 0.5, truth_seeking: 0.8 }}
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

            {/* Upcoming Opportunities mini-section */}
            <div className="p-6 rounded-2xl bg-ink-raised border border-paper/10 space-y-4">
              <h3 className="font-display font-bold text-sm text-paper uppercase tracking-wider font-mono flex items-center space-x-2">
                <Award className="w-4 h-4 text-signal" />
                <span>Upcoming Opportunities</span>
              </h3>

              <div className="space-y-3">
                {opportunities.slice(0, 3).map((opp) => (
                  <a
                    key={opp.id}
                    href={opp.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block p-3.5 rounded-xl bg-ink border border-paper/10 hover:border-signal/50 transition-colors space-y-1.5"
                  >
                    <div className="font-display font-bold text-xs text-paper hover:text-signal transition-colors flex items-center justify-between">
                      <span className="truncate pr-2">{opp.title}</span>
                      <ExternalLink className="w-3 h-3 text-paper/40 shrink-0" />
                    </div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-paper/50">
                      <span>{opp.org_name}</span>
                      <span className="flex items-center space-x-1 text-signal">
                        <Calendar className="w-3 h-3" />
                        <span>{opp.event_date}</span>
                      </span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
