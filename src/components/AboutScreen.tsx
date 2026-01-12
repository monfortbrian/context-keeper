import { Info } from 'lucide-react';

interface AboutScreenProps {
  onBack: () => void;
}

export function AboutScreen({ onBack }: AboutScreenProps) {
  return (
    <div className="h-dvh flex flex-col relative">
      {/* Info Icon - Sticky with blur background */}
      <div className="sticky top-4 right-4 z-10 flex justify-end px-4">
        <button
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

      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-md mx-auto px-8 py-8 pb-32">
          {/* Title */}
          <h1
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '15px',
              fontWeight: '400',
              color: '#18181b',
              marginBottom: '32px',
            }}
          >
            Hi there!
          </h1>

          {/* Content */}
          <p
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              fontWeight: '400',
              color: '#18181b',
              lineHeight: '1.6',
              marginBottom: '20px',
            }}
          >
            Context Keeper is your personal workspace manager for Chrome.
          </p>

          <p
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              fontWeight: '400',
              color: '#18181b',
              lineHeight: '1.6',
              marginBottom: '20px',
            }}
          >
            Designed for professionals who juggle multiple projects, Context
            Keeper helps you save entire browsing sessions as named workspaces.
            Whether you're switching between client projects, research tasks, or
            personal browsing, you can restore any workspace with a single
            click—bringing back all your tabs exactly as you left them.
          </p>

          <p
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              fontWeight: '400',
              color: '#18181b',
              lineHeight: '1.6',
              marginBottom: '20px',
            }}
          >
            Built with privacy in mind, all your data stays local on your
            device. We don't track your browsing, collect personal information,
            or share your data with third parties. Context Keeper is a
            lightweight, fast, and secure tool designed to make your workflow
            seamless.
          </p>

          <p
            style={{
              fontFamily: 'IBM Plex Mono, monospace',
              fontSize: '12px',
              fontWeight: '400',
              color: '#18181b',
              lineHeight: '1.6',
              marginBottom: '40px',
            }}
          >
            If you have feedback or need support, we'd love to hear from you at{' '}
            <span style={{ fontWeight: '600' }}>
              <a href="mailto:monfortnkurunziza0@gmail.com">
                monfortnkurunziza0@gmail.com
              </a>
            </span>
          </p>
        </div>
      </div>

      {/* Fixed Bottom - Button + Footer */}
      <div style={{ borderTop: '1px solid #cccbcb' }}>
        <div className="px-8 pt-4 pb-3">
          <button
            onClick={onBack}
            className="transition-opacity hover:opacity-90"
            style={{
              width: '100%',
              height: '48px',
              backgroundColor: '#18181b',
              color: '#efeded',
              fontFamily: 'Inter, sans-serif',
              fontSize: '15px',
              fontWeight: '400',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              maxWidth: '360px',
              marginLeft: 'auto',
              marginRight: 'auto',
              display: 'block',
            }}
          >
            Back
          </button>
        </div>

        <div className="py-3 text-center">
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
    </div>
  );
}
