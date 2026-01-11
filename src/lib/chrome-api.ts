import type { Context } from '../types';

export const saveContext = async (
  name: string,
  selectedTabs: chrome.tabs.Tab[]
): Promise<Context> => {
  const context: Context = {
    id: Date.now().toString(),
    name: name,
    timestamp: Date.now(),
    tabs: selectedTabs.map((tab) => ({
      url: tab.url || '',
      title: tab.title || 'Untitled',
      favIconUrl: tab.favIconUrl,
    })),
  };

  const result = await chrome.storage.local.get('contexts');
  const contexts: Context[] = Array.isArray(result.contexts)
    ? result.contexts
    : [];

  contexts.push(context);
  await chrome.storage.local.set({ contexts });

  return context;
};

export const getContexts = async (): Promise<Context[]> => {
  const result = await chrome.storage.local.get('contexts');
  return Array.isArray(result.contexts) ? result.contexts : [];
};

export const updateContextName = async (
  id: string,
  newName: string
): Promise<void> => {
  const result = await chrome.storage.local.get('contexts');
  const contexts: Context[] = Array.isArray(result.contexts)
    ? result.contexts
    : [];

  const updated = contexts.map((c) =>
    c.id === id ? { ...c, name: newName } : c
  );
  await chrome.storage.local.set({ contexts: updated });
};

export const restoreContext = async (context: Context): Promise<void> => {
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

export const getCurrentTabs = async (): Promise<chrome.tabs.Tab[]> => {
  return await chrome.tabs.query({ currentWindow: true });
};
