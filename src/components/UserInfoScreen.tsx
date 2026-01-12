import { useState } from 'react';
import { Info } from 'lucide-react';
import { analytics } from '../lib/analytics';

interface UserInfoScreenProps {
  onComplete: (data: {
    nickname: string;
    email?: string;
    job?: string;
  }) => void;

  onInfoClick: () => void;
}

export function UserInfoScreen({
  onComplete,
  onInfoClick,
}: UserInfoScreenProps) {
  const [nickname, setNickname] = useState('');
  const [email, setEmail] = useState('');
  const [job, setJob] = useState('');

  const fieldStyle: React.CSSProperties = {
    width: '100%',
    height: '40px',
    boxSizing: 'border-box',
    backgroundColor: '#e4e4e7',
    border: '1px solid #cccbcb',
    borderRadius: '6px',
    fontFamily: 'Inter, sans-serif',
    fontSize: '14px',
    lineHeight: '20px',
    color: '#18181b',
    padding: '0 12px',
    outline: 'none',
  };

  // Email validation
  const isValidEmail = (email: string): boolean => {
    if (!email) return true; // Email is optional

    // Basic email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    // List of valid TLDs (top-level domains)
    const validTLDs = [
      // Common
      'com',
      'org',
      'net',
      'edu',
      'gov',
      'mil',
      'int',
      // Email providers
      'gmail',
      'outlook',
      'yahoo',
      'hotmail',
      'icloud',
      'protonmail',
      // Country codes (popular)
      'us',
      'uk',
      'ca',
      'au',
      'de',
      'fr',
      'jp',
      'cn',
      'in',
      'br',
      'co',
      'io',
      'ai',
      'me',
      'app',
      'dev',
      'tech',
      'design',
      // Business
      'biz',
      'info',
      'name',
      'pro',
    ];

    // Extract TLD
    const tld = email.split('.').pop()?.toLowerCase();
    if (!tld) return false;

    // Check if TLD is valid
    return validTLDs.includes(tld);
  };

  const handleSubmit = async () => {
    // Validate name
    if (!nickname.trim()) {
      alert('Please enter your name');
      return;
    }

    // Validate email if provided
    if (email.trim() && !isValidEmail(email.trim())) {
      alert(
        'Please enter a valid email address (e.g., john@gmail.com, sarah@company.com)'
      );
      return;
    }

    const userData = {
      nickname: nickname.trim(),
      email: email.trim() || undefined,
      job: job || undefined,
    };

    // Track analytics
    try {
      analytics.identify(Date.now().toString(), {
        name: userData.nickname,
        email: userData.email,
        job: userData.job,
      });

      analytics.track('User Onboarded', {
        has_email: !!userData.email,
        has_job: !!userData.job,
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }

    // Complete onboarding
    onComplete(userData);
  };

  return (
    <div className="h-screen w-full overflow-x-hidden flex flex-col relative">
      {/* Info Icon */}
      <div className="sticky top-4 right-4 z-10 flex justify-end px-4">
        <button
          onClick={onInfoClick}
          className="p-2 border-0 cursor-pointer"
          style={{
            background: 'rgba(239, 237, 237, 0.8)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            borderRadius: '8px',
          }}
        >
          <Info size={24} color="#18181b" strokeWidth={1.5} />
        </button>
      </div>

      {/* Skip Button */}

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-4">
        <div className="w-full mx-auto" style={{ maxWidth: '360px' }}>
          {/* Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="nickname"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                color: '#18181b',
              }}
            >
              What should we call you?
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="Jonathan"
              style={fieldStyle}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '20px' }}>
            <label
              htmlFor="email"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                color: '#18181b',
              }}
            >
              Get updates?{' '}
              <span style={{ color: '#5a5a5c', fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jonathan@example.com"
              style={fieldStyle}
            />
          </div>

          {/* Job */}
          <div style={{ marginBottom: '32px' }}>
            <label
              htmlFor="job"
              style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                display: 'block',
                fontFamily: 'Inter, sans-serif',
                color: '#18181b',
              }}
            >
              You are a...{' '}
              <span style={{ color: '#5a5a5c', fontWeight: 400 }}>
                (optional)
              </span>
            </label>
            <select
              id="job"
              value={job}
              onChange={(e) => setJob(e.target.value)}
              style={{
                ...fieldStyle,
                color: job ? '#18181b' : '#5a5a5c',
                appearance: 'none',
                paddingRight: '36px',
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='%235a5a5c' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E")`,
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'right 12px center',
              }}
            >
              <option value="" disabled>
                Select your role
              </option>
              <option value="designer">Product Designer</option>
              <option value="data-analyst">Data Analyst</option>
              <option value="developer">Software Engineer</option>
              <option value="product-manager">Project Manager</option>
              <option value="content-creator">Content Creator</option>
              <option value="researcher">Researcher</option>
              <option value="entrepreneur">Entrepreneur</option>
              <option value="student">Student</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#18181b',
              color: '#efeded',
              borderRadius: '10px',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: '400',
            }}
          >
            {nickname.trim() ? `Alright ${nickname.trim()}` : 'Alright....'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center">
        <span
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '11px',
            color: '#5a5a5c',
          }}
        >
          v1.0.0
        </span>
      </div>
    </div>
  );
}
