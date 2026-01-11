import { useState, useEffect } from 'react';
import {
  Info,
  Plus,
  ChevronDown,
  Trash2,
  RotateCcw,
  FolderOpen,
} from 'lucide-react';
import type { Context } from '../types';

interface MainScreenProps {
  onInfoClick: () => void;
  userNickname?: string;
}

export function MainScreen({
  onInfoClick,
  userNickname = 'there',
}: MainScreenProps) {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [trashedContexts, setTrashedContexts] = useState<Context[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [greeting, setGreeting] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [activeTab, setActiveTab] = useState<'saved' | 'trash'>('saved');

  useEffect(() => {
    loadContexts();
    updateGreeting();
  }, [userNickname]);

  const updateGreeting = () => {
    const hour = new Date().getHours();
    let timeGreeting = '';

    if (hour >= 5 && hour < 12) {
      timeGreeting = `Good morning, ${userNickname}! ☀️`;
    } else if (hour >= 12 && hour < 17) {
      timeGreeting = `Good afternoon, ${userNickname}! 🚀`;
    } else if (hour >= 17 && hour < 22) {
      timeGreeting = `Good evening, ${userNickname}! ✨`;
    } else {
      timeGreeting = `Hey ${userNickname}! 🌙`;
    }

    setGreeting(timeGreeting);
  };

  const loadContexts = async () => {
    try {
      const result = await chrome.storage.local.get(['contexts']);
      const allContexts: Context[] = (result.contexts as Context[]) || [];

      const active = allContexts.filter((c) => !c.isTrashed);
      const trashed = allContexts.filter((c) => c.isTrashed);

      setContexts(active.sort((a, b) => b.timestamp - a.timestamp));
      setTrashedContexts(trashed.sort((a, b) => b.timestamp - a.timestamp));
    } catch (error) {
      console.error('Error loading contexts:', error);
    }
  };

  const handleAddNew = async () => {
    try {
      const tabs = await chrome.tabs.query({ currentWindow: true });

      const newContext: Context = {
        id: Date.now().toString(),
        name: `Workspace ${contexts.length + 1}`,
        timestamp: Date.now(),
        tabs: tabs.map((tab) => ({
          url: tab.url || '',
          title: tab.title || 'Untitled',
          favIconUrl: tab.favIconUrl,
        })),
        isTrashed: false,
      };

      const allContexts = [...contexts, newContext];
      await chrome.storage.local.set({ contexts: allContexts });
      await loadContexts();

      setExpandedId(newContext.id);
      setEditingId(newContext.id);
      setEditingName(newContext.name);
    } catch (error) {
      console.error('Error adding context:', error);
    }
  };

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleStartEdit = (context: Context) => {
    setEditingId(context.id);
    setEditingName(context.name);
  };

  const handleSaveEdit = async () => {
    if (!editingId || !editingName.trim()) return;

    const updatedContexts = contexts.map((c) =>
      c.id === editingId ? { ...c, name: editingName.trim() } : c
    );

    await chrome.storage.local.set({ contexts: updatedContexts });
    await loadContexts();
    setEditingId(null);
    setEditingName('');
  };

  const handleMoveToTrash = async (id: string) => {
    const allContexts = [...contexts, ...trashedContexts];
    const updatedContexts = allContexts.map((c) =>
      c.id === id ? { ...c, isTrashed: true } : c
    );

    await chrome.storage.local.set({ contexts: updatedContexts });
    await loadContexts();
  };

  const handleRestore = async (id: string) => {
    const allContexts = [...contexts, ...trashedContexts];
    const updatedContexts = allContexts.map((c) =>
      c.id === id ? { ...c, isTrashed: false } : c
    );

    await chrome.storage.local.set({ contexts: updatedContexts });
    await loadContexts();
  };

  const handlePermanentDelete = async (id: string) => {
    if (confirm('Permanently delete this workspace? This cannot be undone.')) {
      const allContexts = [...contexts, ...trashedContexts];
      const updatedContexts = allContexts.filter((c) => c.id !== id);

      await chrome.storage.local.set({ contexts: updatedContexts });
      await loadContexts();
    }
  };

  const handleRestoreContext = async (context: Context) => {
    for (const tab of context.tabs) {
      await chrome.tabs.create({ url: tab.url, active: false });
    }
  };

  const formatTimeAgo = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 30) return `${days}d ago`;

    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const ContextCard = ({
    context,
    onDelete,
    onRestore: onRestoreItem,
  }: {
    context: Context;
    onDelete: (id: string) => void;
    onRestore?: (id: string) => void;
  }) => {
    const isExpanded = expandedId === context.id;
    const isEditing = editingId === context.id;

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
            {isEditing ? (
              <input
                value={editingName}
                onChange={(e) => setEditingName(e.target.value)}
                onBlur={handleSaveEdit}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSaveEdit();
                  if (e.key === 'Escape') {
                    setEditingId(null);
                    setEditingName('');
                  }
                }}
                autoFocus
                onClick={(e) => e.stopPropagation()}
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#18181b',
                  border: '1px solid #cccbcb',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  width: '100%',
                  outline: 'none',
                }}
              />
            ) : (
              <div
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#18181b',
                  marginBottom: '4px',
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  handleStartEdit(context);
                }}
              >
                {context.name}
              </div>
            )}
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
                      style={{
                        width: '16px',
                        height: '16px',
                        minWidth: '16px',
                        minHeight: '16px',
                        objectFit: 'contain',
                      }}
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '16px',
                        height: '16px',
                        minWidth: '16px',
                        minHeight: '16px',
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
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <FolderOpen size={16} />
                    Open
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
      {/* Info Icon with blur */}
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

      {/* Content */}
      <div className="flex-1 flex flex-col overflow-hidden px-4 pt-2">
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
          {/* Custom Tabs */}
          <div
            style={{
              backgroundColor: '#5a5a5c',
              borderRadius: '10px',
              padding: '4px',
              display: 'flex',
              gap: '4px',
            }}
          >
            <button
              onClick={() => setActiveTab('saved')}
              style={{
                padding: '8px 20px',
                backgroundColor: activeTab === 'saved' ? '#fff' : 'transparent',
                color: activeTab === 'saved' ? '#18181b' : '#efeded',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Saved
            </button>
            <button
              onClick={() => setActiveTab('trash')}
              style={{
                padding: '8px 20px',
                backgroundColor: activeTab === 'trash' ? '#fff' : 'transparent',
                color: activeTab === 'trash' ? '#18181b' : '#efeded',
                border: 'none',
                borderRadius: '8px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Trash
            </button>
          </div>

          {/* Add Button */}
          <button
            onClick={handleAddNew}
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

        {/* Tab Content */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          {activeTab === 'saved' ? (
            contexts.length === 0 ? (
              <EmptyState message="Your workspaces will appear here" />
            ) : (
              <>
                {contexts.map((context) => (
                  <ContextCard
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
            )
          ) : trashedContexts.length === 0 ? (
            <EmptyState message="Nothing here... yet!" />
          ) : (
            <>
              {trashedContexts.map((context) => (
                <ContextCard
                  key={context.id}
                  context={context}
                  onDelete={handlePermanentDelete}
                  onRestore={handleRestore}
                />
              ))}
            </>
          )}
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
