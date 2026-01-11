export interface Tab {
  url: string;
  title: string;
  favIconUrl?: string;
}

export interface Context {
  id: string;
  name: string;
  timestamp: number;
  tabs: Tab[];
  isTrashed?: boolean;
}
