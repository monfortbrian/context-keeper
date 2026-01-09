export interface Tab {
  url: string;
  title: string;
}

export interface Context {
  id: string;
  name: string;
  timestamp: number;
  tabs: Tab[];
}
