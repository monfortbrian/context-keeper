import { useState } from 'react';
import { Info } from 'lucide-react';

interface UserInfoScreenProps {
  onComplete: (data: {
    nickname: string;
    email?: string;
    job?: string;
  }) => void;
  onSkip: () => void;
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

  const handleSubmit = () => {
    if (!nickname.trim()) {
      alert('Please enter your name');
      return;
    }

    onComplete({
      nickname: nickname.trim(),
      email: email.trim() || undefined,
      job: job || undefined,
    });
  };

  return (
    <div className="h-dvh w-full overflow-x-hidden flex flex-col relative">
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

      {/* Main Content */}
      <div className="flex-1 flex flex-col justify-center px-4">
        <div className="w-full mx-auto" style={{ maxWidth: '360px' }}>
          {/* Name */}
          <div style={{ marginBottom: '20px' }}>
            <label
              style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                display: 'block',
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
              style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                display: 'block',
              }}
            >
              Get updates?
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
              style={{
                fontSize: '14px',
                fontWeight: 500,
                marginBottom: '8px',
                display: 'block',
              }}
            >
              You are a...
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
              <option value="">Select</option>
              <option value="product-designer">Product Designer</option>
              <option value="developer">Developer</option>
              <option value="project-manager">Project Manager</option>
              <option value="student">Student</option>
              <option value="researcher">Researcher</option>
              <option value="entrepreneur">Entrepreneur</option>
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
            }}
          >
            {nickname.trim() ? `Alright ${nickname.trim()}` : 'Alright ....'}
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="py-4 text-center">
        <span style={{ fontSize: '11px', color: '#5a5a5c' }}>v1.0.0</span>
      </div>
    </div>
  );
}
