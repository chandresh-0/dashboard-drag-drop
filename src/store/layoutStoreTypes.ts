// 📌 Defines a single chart's position, size, and type
export interface LayoutItem {
  i: string; // Chart ID
  x: number; // X position
  y: number; // Y position
  w: number; // Width
  h: number; // Height
  chartType: string; // Type of chart (bar, line, etc.)
  minW: number; // Minimum width
  minH: number; // Minimum height
}

// 📌 Defines layouts for different screen sizes (responsive breakpoints)
export interface Layouts {
  xxl: LayoutItem[];
  xl: LayoutItem[];
  lg: LayoutItem[];
  md: LayoutItem[];
  sm: LayoutItem[];
  xs: LayoutItem[];
}

export type BreakPoint = keyof Layouts;

// 📌 Stores layouts and chart keys for each tab
export interface TabLayouts {
  [tabId: string]: {
    layouts: Layouts;
    layoutKeys: number[];
  };
}

// 📌 Zustand store export interface for managing layout state
export interface LayoutStore {
  activeTab: string; // Current active tab ID
  tabLayouts: TabLayouts; // All layouts per tab
  setActiveTab: (tabId: string) => void; // Switch active tab
  updateLayouts: (newLayouts: Layouts) => void; // Update chart positions
  addChart: (chartType: string, newLayout: Layouts) => void; // Add a new chart
  deleteChart: (chartId: string) => void; // Remove a chart
}
