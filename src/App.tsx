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
  X,
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Header - Fixed */}
      <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-600 to-indigo-600 p-6 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
            <Layers className="h-6 w-6 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-white">Context Keeper</h1>
            <p className="text-sm text-blue-100">Your workspace time machine</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Save Section */}
        {!showSaveDialog ? (
          <Button
            onClick={() => setShowSaveDialog(true)}
            disabled={isLoading}
            className="w-full h-14 text-base font-medium shadow-md hover:shadow-lg transition-all"
            size="lg"
          >
            <Save className="mr-2 h-5 w-5" />
            Save Current Context
          </Button>
        ) : (
          <Card className="border-blue-200 shadow-md">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Save Context</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowSaveDialog(false);
                    setContextName('');
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <CardDescription>
                Give your current workspace a memorable name
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Input
                placeholder="e.g., Client Project Work"
                value={contextName}
                onChange={(e) => setContextName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSave()}
                className="text-base h-12"
                autoFocus
              />
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full h-12"
                size="lg"
              >
                <Save className="mr-2 h-5 w-5" />
                Save Context
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between px-1">
          <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
            {contexts.length} saved{' '}
            {contexts.length === 1 ? 'context' : 'contexts'}
          </span>
          {contexts.length > 0 && (
            <span className="text-xs text-slate-400">
              Latest: {formatDate(contexts[0].timestamp)}
            </span>
          )}
        </div>

        {/* Contexts List */}
        <ScrollArea className="h-[calc(100vh-320px)]">
          <div className="space-y-4 pr-4">
            {contexts.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="pt-16 pb-16">
                  <div className="text-center">
                    <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                      <Layers className="h-10 w-10 text-slate-400" />
                    </div>
                    <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100 mb-2">
                      No saved contexts yet
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
                      Save your first workspace to quickly restore your tabs
                      later
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              contexts.map((context) => (
                <Card
                  key={context.id}
                  className="hover:shadow-lg transition-all border-slate-200 dark:border-slate-800"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg mb-2 break-words">
                          {context.name}
                        </CardTitle>
                        <div className="flex items-center gap-3 text-sm text-slate-500">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>{formatDate(context.timestamp)}</span>
                          </div>
                          <Badge variant="secondary" className="gap-1">
                            <Globe className="h-3 w-3" />
                            {context.tabs.length}{' '}
                            {context.tabs.length === 1 ? 'tab' : 'tabs'}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Tab Preview */}
                    <div className="space-y-1.5 text-sm text-slate-600 dark:text-slate-400">
                      {context.tabs.slice(0, 3).map((tab, idx) => (
                        <div key={idx} className="flex items-start gap-2">
                          <span className="text-slate-400 mt-0.5">•</span>
                          <p className="flex-1 truncate">{tab.title}</p>
                        </div>
                      ))}
                      {context.tabs.length > 3 && (
                        <p className="text-slate-400 pl-4">
                          +{context.tabs.length - 3} more{' '}
                          {context.tabs.length - 3 === 1 ? 'tab' : 'tabs'}
                        </p>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        onClick={() => handleRestore(context)}
                        disabled={isLoading}
                        className="flex-1 h-11"
                      >
                        <FolderOpen className="mr-2 h-4 w-4" />
                        Restore
                      </Button>
                      <Button
                        onClick={() => handleDelete(context.id)}
                        disabled={isLoading}
                        variant="destructive"
                        size="icon"
                        className="h-11 w-11"
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
