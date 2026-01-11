import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Globe, X } from 'lucide-react';

interface TabSelectorProps {
  tabs: chrome.tabs.Tab[];
  onSave: (name: string, selectedTabs: chrome.tabs.Tab[]) => void;
  onCancel: () => void;
}

export function TabSelector({ tabs, onSave, onCancel }: TabSelectorProps) {
  const [contextName, setContextName] = useState('');
  const [selectedTabs, setSelectedTabs] = useState<Set<number>>(
    new Set(tabs.map((_, i) => i))
  );

  const toggleTab = (index: number) => {
    const newSelected = new Set(selectedTabs);
    if (newSelected.has(index)) {
      newSelected.delete(index);
    } else {
      newSelected.add(index);
    }
    setSelectedTabs(newSelected);
  };

  const toggleAll = () => {
    if (selectedTabs.size === tabs.length) {
      setSelectedTabs(new Set());
    } else {
      setSelectedTabs(new Set(tabs.map((_, i) => i)));
    }
  };

  const handleSave = () => {
    if (!contextName.trim()) {
      alert('Please enter a context name');
      return;
    }
    if (selectedTabs.size === 0) {
      alert('Please select at least one tab');
      return;
    }

    const selected = tabs.filter((_, i) => selectedTabs.has(i));
    onSave(contextName, selected);
  };

  return (
    <div className="flex flex-col h-full min-h-screen">
      {/* Header */}
      <div className="p-4 border-b space-y-3 bg-white">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Select Tabs to Save</h2>
          <Button variant="ghost" size="icon" onClick={onCancel}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Input
          placeholder="Context name (e.g., Client Project)"
          value={contextName}
          onChange={(e) => setContextName(e.target.value)}
          className="text-base"
        />

        <div className="flex items-center justify-between text-sm">
          <Button variant="ghost" size="sm" onClick={toggleAll} className="h-8">
            {selectedTabs.size === tabs.length ? 'Deselect All' : 'Select All'}
          </Button>
          <span className="text-slate-500">
            {selectedTabs.size} of {tabs.length} selected
          </span>
        </div>
      </div>

      {/* Tab List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-2">
          {tabs.map((tab, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 rounded-lg border hover:bg-slate-50 cursor-pointer transition bg-white"
              onClick={() => toggleTab(index)}
            >
              <Checkbox
                checked={selectedTabs.has(index)}
                onCheckedChange={() => toggleTab(index)}
                className="mt-1"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {tab.favIconUrl ? (
                    <img
                      src={tab.favIconUrl}
                      alt=""
                      className="w-4 h-4"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <Globe className="w-4 h-4 text-slate-400" />
                  )}
                  <span className="text-sm font-medium truncate">
                    {tab.title}
                  </span>
                </div>
                <p className="text-xs text-slate-500 truncate mt-1">
                  {tab.url}
                </p>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t bg-white">
        <Button
          onClick={handleSave}
          disabled={selectedTabs.size === 0}
          className="w-full h-12"
          size="lg"
        >
          Save {selectedTabs.size} {selectedTabs.size === 1 ? 'Tab' : 'Tabs'}
        </Button>
      </div>
    </div>
  );
}
