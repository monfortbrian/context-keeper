import type { Context, Tab } from '../types';

export const saveContext = async (name: string): Promise<Context> => {
  // Get all tabs in current window
  const tabs = await chrome.tabs.query({ currentWindow: true });

  const context: Context = {
    id: Date.now().toString(),
    name: name || `Context ${Date.now()}`,
    timestamp: Date.now(),
    tabs: tabs.map((tab) => ({
      url: tab.url || '',
      title: tab.title || 'Untitled',
    })),
  };

  // Get existing contexts
  const result = await chrome.storage.local.get('contexts');
  const contexts: Context[] = Array.isArray(result.contexts)
    ? result.contexts
    : [];

  // Add new context
  contexts.push(context);

  // Save to storage
  await chrome.storage.local.set({ contexts });

  return context;
};

export const getContexts = async (): Promise<Context[]> => {
  const result = await chrome.storage.local.get('contexts');
  return Array.isArray(result.contexts) ? result.contexts : [];
};

export const restoreContext = async (context: Context): Promise<void> => {
  // Open all tabs
  for (const tab of context.tabs) {
    await chrome.tabs.create({ url: tab.url });
  }
};

export const deleteContext = async (id: string): Promise<void> => {
  const result = await chrome.storage.local.get('contexts');
  const contexts: Context[] = Array.isArray(result.contexts)
    ? result.contexts
    : [];

  const updated = contexts.filter((c) => c.id !== id);
  await chrome.storage.local.set({ contexts: updated });
};
