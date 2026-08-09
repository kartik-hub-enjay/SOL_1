'use me';
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import NeonMesh from '@/components/ui/neon-mesh';
import { getUniversities, setCurrentUser } from '@/lib/dataService';
import { University, UserProfile } from '@/lib/seedData';

// Icons
const UserIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
    <circle cx="12" cy="7" r="4"></circle>
  </svg>
);

const MailIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
    <polyline points="22,6 12,13 2,6"></polyline>
  </svg>
);

const LockIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <circle cx="12" cy="16" r="1"></circle>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const EyeIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

const BuildingIcon: React.FC = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect>
    <path d="M9 22v-4h6v4"></path>
    <path d="M8 6h.01"></path>
    <path d="M16 6h.01"></path>
    <path d="M12 6h.01"></path>
    <path d="M12 10h.01"></path>
    <path d="M12 14h.01"></path>
    <path d="M16 10h.01"></path>
    <path d="M16 14h.01"></path>
    <path d="M8 10h.01"></path>
    <path d="M8 14h.01"></path>
  </svg>
);

// Floating Label Input Component with Dark Background Lock
const FloatingLabelInput: React.FC<{
  id: string;
  type: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  icon: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
}> = ({ id, type, value, onChange, placeholder, icon, rightIcon, onRightIconClick }) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-paper/50 transition-colors group-focus-within:text-[#BEF202] z-10">
        {icon}
      </div>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        className="flex h-11 w-full rounded-xl border border-white/15 bg-[#050702]/80 text-[#F6F4FF] pl-10 pr-10 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEF202] focus-visible:border-transparent transition-all duration-200 peer placeholder-transparent"
        placeholder={placeholder}
      />
      <label
        htmlFor={id}
        className={`absolute left-10 transition-all duration-200 pointer-events-none text-sm font-medium z-10 ${
          isFocused || value
            ? '-top-2.5 text-xs bg-[#050702] px-2 text-[#BEF202] rounded-md border border-[#BEF202]/40 shadow-sm'
            : 'top-3 text-paper/50'
        }`}
      >
        {placeholder}
      </label>
      {rightIcon && (
        <button
          type="button"
          onClick={onRightIconClick}
          className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-paper/50 hover:text-paper transition-colors focus:outline-none z-10"
        >
          {rightIcon}
        </button>
      )}
    </div>
  );
};

export default function SignupPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<University[]>([]);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [universityId, setUniversityId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getUniversities().then((unis) => {
      setUniversities(unis);
      if (unis.length > 0) setUniversityId(unis[0].id);
    });
  }, []);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!fullName || !email || !password || !universityId) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        display_name: fullName,
        university_id: universityId,
        created_at: new Date().toISOString(),
        onboarding_complete: false,
      };

      setCurrentUser(newUser);
      router.push('/onboarding');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050702] text-paper flex flex-col justify-center items-center p-4 selection:bg-[#2e4ed2] selection:text-[#ee9dd6]">
      {/* 3D Kinetic Verlet Mesh Full Screen Background */}
      <div className="fixed inset-0 w-full h-full z-0 pointer-events-auto">
        <NeonMesh
          showOverlayText={false}
          bgColor="#050702"
          baseMeshColor="101, 163, 13"
          neonLime="#BEF202"
          className="w-full h-full"
        />
      </div>

      {/* Main Glassmorphism Card Container (Black Glass) */}
      <div className="relative z-10 w-full max-w-md pointer-events-auto">
        <div className="relative bg-black/80 border border-white/15 rounded-3xl p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.85)] backdrop-blur-2xl transition-all duration-200">
          
          {/* Centered Large SOL Logo Header */}
          <div className="flex flex-col items-center text-center mb-6">
            <Link href="/" className="relative h-24 sm:h-28 w-56 sm:w-64 mb-1 hover:scale-105 transition-transform">
              <Image
                src="/sol-logo.png"
                alt="SOL Logo"
                fill
                className="object-contain"
                priority
              />
            </Link>
            <h1 className="text-2xl font-display font-bold tracking-tight text-paper">
              Create an account
            </h1>
            <p className="text-xs font-mono text-paper/60 mt-1">
              Enter your details below to join SOL
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-mono text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSignup} className="space-y-4">
            {/* Full Name Input */}
            <FloatingLabelInput
              id="fullName"
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              icon={<UserIcon />}
            />

            {/* University Selection Input */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-paper/50 z-10">
                <BuildingIcon />
              </div>
              <select
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className="flex h-11 w-full rounded-xl border border-white/15 bg-[#050702]/80 text-[#F6F4FF] pl-10 pr-4 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BEF202] transition-all duration-200 cursor-pointer"
              >
                {universities.map((uni) => (
                  <option key={uni.id} value={uni.id} className="bg-[#050702] text-[#F6F4FF]">
                    {uni.name} ({uni.domain})
                  </option>
                ))}
              </select>
            </div>

            {/* Email Input */}
            <FloatingLabelInput
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              icon={<MailIcon />}
            />

            {/* Password Input */}
            <FloatingLabelInput
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              icon={<LockIcon />}
              rightIcon={showPassword ? <EyeOffIcon /> : <EyeIcon />}
              onRightIconClick={() => setShowPassword(!showPassword)}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-bold bg-[#2e4ed2] text-[#ee9dd6] hover:bg-[#ee9dd6] hover:text-[#2e4ed2] h-11 px-4 py-2 w-full transition-all duration-200 cursor-pointer shadow-lg disabled:opacity-50 mt-2"
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center text-xs font-mono text-paper/60">
            Already have an account?{' '}
            <Link
              href="/login"
              className="text-[#BEF202] font-bold underline underline-offset-4 hover:opacity-80 transition-opacity"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
