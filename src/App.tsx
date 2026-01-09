import { useState, useEffect } from 'react';
import type { Context } from './types';
import {
  saveContext,
  getContexts,
  restoreContext,
  deleteContext,
} from './lib/chrome-api';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Save,
  FolderOpen,
  Trash2,
  Globe,
  Calendar,
  Layers,
} from 'lucide-react';

function App() {
  const [contexts, setContexts] = useState<Context[]>([]);
  const [contextName, setContextName] = useState('');
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadContexts();
  }, []);

  const loadContexts = async () => {
    const data = await getContexts();
    setContexts(data.sort((a, b) => b.timestamp - a.timestamp));
  };

  const handleSave = async () => {
    if (!contextName.trim()) {
      alert('Please enter a context name');
      return;
    }

    setIsLoading(true);
    try {
      await saveContext(contextName);
      await loadContexts();
      setContextName('');
      setShowSaveDialog(false);
    } catch (error) {
      console.error('Error saving context:', error);
      alert('Failed to save context');
    }
    setIsLoading(false);
  };

  const handleRestore = async (context: Context) => {
    setIsLoading(true);
    try {
      await restoreContext(context);
    } catch (error) {
      console.error('Error restoring context:', error);
      alert('Failed to restore context');
    }
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this context?')) return;

    setIsLoading(true);
    try {
      await deleteContext(id);
      await loadContexts();
    } catch (error) {
      console.error('Error deleting context:', error);
      alert('Failed to delete context');
    }
    setIsLoading(false);
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div className="w-[420px] h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">Context Keeper</h1>
            <p className="text-sm text-blue-100">Your workspace time machine</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Save Section */}
        {!showSaveDialog ? (
          <Button
            onClick={() => setShowSaveDialog(true)}
            disabled={isLoading}
            className="w-full h-12 text-base font-medium shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <Save className="mr-2 h-5 w-5" />
            Save Current Context
          </Button>
        ) : (
          <Card className="mb-4 border-blue-200 shadow-md">
            <CardContent className="pt-4 space-y-3">
              <Input
                placeholder="e.g., Client Project Work"
                value={contextName}
                onChange={(e) => setContextName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                className="text-base"
                autoFocus
              />
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="flex-1"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save
                </Button>
                <Button
                  onClick={() => {
                    setShowSaveDialog(false);
                    setContextName('');
                  }}
                  disabled={isLoading}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Bar */}
        <div className="flex items-center justify-between py-3 px-1">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {contexts.length} saved{' '}
            {contexts.length === 1 ? 'context' : 'contexts'}
          </span>
        </div>

        {/* Contexts List */}
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-3">
            {contexts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-12 pb-12">
                  <div className="text-center">
                    <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Layers className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-1">
                      No saved contexts yet
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Save your first workspace to get started
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              contexts.map((context) => (
                <Card
                  key={context.id}
                  className="hover:shadow-md transition-shadow border-slate-200 dark:border-slate-800"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base truncate">
                          {context.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-2 mt-1">
                          <Calendar className="h-3 w-3" />
                          <span>{formatDate(context.timestamp)}</span>
                        </CardDescription>
                      </div>
                      <Badge variant="secondary" className="ml-2 shrink-0">
                        <Globe className="h-3 w-3 mr-1" />
                        {context.tabs.length}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    {/* Tab Preview */}
                    <div className="mb-3 space-y-1 text-xs text-slate-600 dark:text-slate-400">
                      {context.tabs.slice(0, 2).map((tab, idx) => (
                        <p
                          key={idx}
                          className="truncate flex items-center gap-1"
                        >
                          <span className="text-slate-400">•</span>
                          {tab.title}
                        </p>
                      ))}
                      {context.tabs.length > 2 && (
                        <p className="text-slate-400">
                          +{context.tabs.length - 2} more tabs
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleRestore(context)}
                        disabled={isLoading}
                        className="flex-1"
                        size="sm"
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Restore
                      </Button>
                      <Button
                        onClick={() => handleDelete(context.id)}
                        disabled={isLoading}
                        variant="destructive"
                        size="sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

export default App;
