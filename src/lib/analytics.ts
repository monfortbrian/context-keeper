import mixpanel from 'mixpanel-browser';

const MIXPANEL_TOKEN = import.meta.env.VITE_MIXPANEL_TOKEN;

if (MIXPANEL_TOKEN) {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: true,
    track_pageview: true,
    persistence: 'localStorage',
  });
}

export const analytics = {
  // Identify user
  identify: (
    userId: string,
    traits: {
      name?: string;
      email?: string;
      job?: string;
    }
  ) => {
    mixpanel.identify(userId);
    mixpanel.people.set({
      $name: traits.name,
      $email: traits.email,
      job: traits.job,
    });
  },

  // Track event
  track: (eventName: string, properties?: Record<string, any>) => {
    mixpanel.track(eventName, properties);
  },

  // Track workspace created
  workspaceCreated: (workspaceName: string, tabCount: number) => {
    mixpanel.track('Workspace Created', {
      workspace_name: workspaceName,
      tab_count: tabCount,
    });
  },

  // Track workspace opened
  workspaceOpened: (workspaceId: string) => {
    mixpanel.track('Workspace Opened', {
      workspace_id: workspaceId,
    });
  },
};
