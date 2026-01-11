import { useState, useEffect } from 'react';
import { Info, Plus, ChevronDown, Trash2, RotateCcw } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Context } from '../types';
import { getContexts, deleteContext, restoreContext } from '../lib/chrome-api';

interface MainScreenProps {
  onInfoClick: () => void;
  onAddNew: () => void;
  userNickname?: string;
}

export function MainScreen({
  onInfoClick,
  onAddNew,
  userNickname = 'there',
}: MainScreenProps) {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [trashedContexts, setTrashedContexts] = useState<Context[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    loadContexts();
    updateGreeting();
  }, []);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour >= 5 && hour < 12) {
      timeGreeting = `Good morning, ${userNickname}! ☀️`;
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = `Good afternoon, ${userNickname}! ⚡`;
    } else if (hour >= 17 && hour < 22) {
      timeGreeting = `Good evening, ${userNickname}! 🌙`;
    } else {
      timeGreeting = `What's up, ${userNickname}! 🌟`;
    }

    setGreeting(timeGreeting);
  };

  const loadContexts = async () => {
    const allContexts = await getContexts();
    const active = allContexts.filter((c) => !c.isTrashed);
    const trashed = allContexts.filter((c) => c.isTrashed);

    setContexts(active.sort((a, b) => b.timestamp - a.timestamp));
    setTrashedContexts(trashed.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMoveToTrash = async (id: string) => {
    // Update context to mark as trashed
    const updatedContexts = contexts.map((c) =>
      c.id === id ? { ...c, isTrashed: true } : c
    );
    // This would need chrome.storage.local.set update
    await loadContexts();
  };

  const handleRestore = async (id: string) => {
    // Restore from trash
    await loadContexts();
  };

  const handlePermanentDelete = async (id: string) => {
    if (confirm('Permanently delete this context? This cannot be undone.')) {
      await deleteContext(id);
      await loadContexts();
    }
  };

  const handleRestoreContext = async (context: Context) => {
    await restoreContext(context);
  };

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const ContextAccordion = ({
    context,
    onDelete,
    onRestore: onRestoreItem,
  }: {
    context: Context;
    onDelete: (id: string) => void;
    onRestore?: (id: string) => void;
  }) => {
    const isExpanded = expandedId === context.id;

    return (
      <div
        style={{
          border: '1px solid #cccbcb',
          borderRadius: '8px',
          marginBottom: '12px',
          backgroundColor: '#fff',
        }}
      >
        {/* Header */}
        <button
          onClick={() => handleToggle(context.id)}
          style={{
            width: '100%',
            padding: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          <div style={{ flex: 1 }}>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '16px',
                fontWeight: '600',
                color: '#18181b',
                marginBottom: '4px',
              }}
            >
              {context.name}
            </div>
            <div
              style={{
                fontFamily: 'Inter, sans-serif',
                fontSize: '13px',
                color: '#5a5a5c',
              }}
            >
              {context.tabs.length} {context.tabs.length === 1 ? 'tab' : 'tabs'}{' '}
              • {formatTimeAgo(context.timestamp)}
            </div>
          </div>
          <ChevronDown
            size={20}
            color="#18181b"
            style={{
              transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s',
            }}
          />
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div style={{ padding: '0 16px 16px 16px' }}>
            <div
              style={{
                maxHeight: '200px',
                overflowY: 'auto',
                marginBottom: '12px',
              }}
            >
              {context.tabs.map((tab, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px',
                    borderRadius: '4px',
                    marginBottom: '4px',
                  }}
                >
                  {tab.favIconUrl ? (
                    <img
                      src={tab.favIconUrl}
                      alt=""
                      style={{ width: '16px', height: '16px' }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        backgroundColor: '#e4e4e7',
                        borderRadius: '2px',
                      }}
                    />
                  )}
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      color: '#18181b',
                      flex: 1,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {tab.title}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '8px' }}>
              {onRestoreItem ? (
                <>
                  <button
                    onClick={() => onRestoreItem(context.id)}
                    style={{
                      flex: 1,
                      height: '36px',
                      backgroundColor: '#18181b',
                      color: '#efeded',
                      border: 'none',
                      borderRadius: '6px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <RotateCcw size={16} />
                    Restore
                  </button>
                  <button
                    onClick={() => onDelete(context.id)}
                    style={{
                      height: '36px',
                      width: '36px',
                      backgroundColor: '#ef4444',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => handleRestoreContext(context)}
                    style={{
                      flex: 1,
                      height: '36px',
                      backgroundColor: '#18181b',
                      color: '#efeded',
                      border: 'none',
                      borderRadius: '6px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      cursor: 'pointer',
                    }}
                  >
                    Open {context.tabs.length}{' '}
                    {context.tabs.length === 1 ? 'tab' : 'tabs'}
                  </button>
                  <button
                    onClick={() => onDelete(context.id)}
                    style={{
                      height: '36px',
                      width: '36px',
                      backgroundColor: '#e4e4e7',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Trash2 size={16} color="#18181b" />
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const EmptyState = ({ message }: { message: string }) => (
    <div
      style={{
        textAlign: 'center',
        padding: '60px 20px',
        color: '#5a5a5c',
        fontFamily: 'Inter, sans-serif',
        fontSize: '15px',
      }}
    >
      {message}
    </div>
  );

  return (
    <div className="h-screen flex flex-col relative">
      {/* Info Icon */}
      <button
        onClick={onInfoClick}
        className="absolute top-4 right-4 p-0 bg-transparent border-0 cursor-pointer z-10"
      >
        <Info size={24} color="#18181b" strokeWidth={1.5} />
      </button>

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 pt-6">
        {/* Greeting */}
        <h1
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: '20px',
            fontWeight: '600',
            color: '#18181b',
            marginBottom: '20px',
          }}
        >
          {greeting}
        </h1>

        {/* Tabs + Add Button */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '16px',
          }}
        >
          <Tabs defaultValue="saved" className="w-full">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <TabsList
                style={{
                  backgroundColor: '#5a5a5c',
                  borderRadius: '10px',
                  padding: '4px',
                }}
              >
                <TabsTrigger
                  value="saved"
                  style={{
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    padding: '8px 20px',
                  }}
                >
                  Saved
                </TabsTrigger>
                <TabsTrigger
                  value="trash"
                  style={{
                    borderRadius: '8px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    padding: '8px 20px',
                  }}
                >
                  Trash
                </TabsTrigger>
              </TabsList>

              <button
                onClick={onAddNew}
                style={{
                  height: '40px',
                  padding: '0 20px',
                  backgroundColor: '#18181b',
                  color: '#efeded',
                  border: 'none',
                  borderRadius: '10px',
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Plus size={18} />
                Add new
              </button>
            </div>

            {/* Saved Tab Content */}
            <TabsContent
              value="saved"
              style={{ marginTop: '16px', flex: 1, overflow: 'auto' }}
            >
              {contexts.length === 0 ? (
                <EmptyState message="Your workspaces will appear here" />
              ) : (
                <>
                  {contexts.map((context) => (
                    <ContextAccordion
                      key={context.id}
                      context={context}
                      onDelete={handleMoveToTrash}
                    />
                  ))}
                  {contexts.length > 10 && (
                    <button
                      style={{
                        width: '100%',
                        height: '40px',
                        backgroundColor: '#18181b',
                        color: '#efeded',
                        border: 'none',
                        borderRadius: '10px',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                        cursor: 'pointer',
                        marginTop: '12px',
                      }}
                    >
                      Load older
                    </button>
                  )}
                </>
              )}
            </TabsContent>

            {/* Trash Tab Content */}
            <TabsContent
              value="trash"
              style={{ marginTop: '16px', flex: 1, overflow: 'auto' }}
            >
              {trashedContexts.length === 0 ? (
                <EmptyState message="Nothing here... yet!" />
              ) : (
                <>
                  {trashedContexts.map((context) => (
                    <ContextAccordion
                      key={context.id}
                      context={context}
                      onDelete={handlePermanentDelete}
                      onRestore={handleRestore}
                    />
                  ))}
                </>
              )}
            </TabsContent>
          </Tabs>
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
