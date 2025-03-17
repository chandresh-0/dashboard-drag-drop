import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  chartType: string;
  minW: number;
  minH: number;
}

interface Layouts {
  xxl: LayoutItem[];
  xl: LayoutItem[];
  lg: LayoutItem[];
  md: LayoutItem[];
  sm: LayoutItem[];
  xs: LayoutItem[];
}

type BreakPoint = keyof Layouts;

interface TabLayouts {
  [tabId: string]: {
    layouts: Layouts;
    layoutKeys: number[];
  };
}

interface LayoutStore {
  activeTab: string;
  tabLayouts: TabLayouts;
  setActiveTab: (tabId: string) => void;
  updateLayouts: (newLayouts: Layouts) => void;
  addChart: (chartType: string, newLayout: Layouts) => void;
  deleteChart: (chartId: string) => void;
}

const defaultLayout: Layouts = {
  xxl: [],
  xl: [],
  lg: [],
  md: [],
  sm: [],
  xs: [],
};

const initialTabLayouts: TabLayouts = {
  "1": {
    layouts: {
      xxl: [
        { i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar", minW: 2, minH: 2 },
      ],
      xl: [
        { i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar", minW: 2, minH: 2 },
      ],
      lg: [
        { i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar", minW: 2, minH: 2 },
      ],
      md: [
        { i: "0", x: 0, y: 0, w: 3, h: 3, chartType: "bar", minW: 2, minH: 2 },
      ],
      sm: [
        { i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar", minW: 2, minH: 2 },
      ],
      xs: [
        { i: "0", x: 0, y: 0, w: 2, h: 3, chartType: "bar", minW: 2, minH: 2 },
      ],
    },
    layoutKeys: [0],
  },
  "2": { layouts: defaultLayout, layoutKeys: [] },
  "3": { layouts: defaultLayout, layoutKeys: [] },
};

// Helper function to create chart type map
const createChartTypeMap = (layouts: Layouts): Record<string, string> => {
  const chartTypes: Record<string, string> = {};
  // Use xxl as the source of truth for chart types
  layouts.xxl.forEach((item) => {
    chartTypes[item.i] = item.chartType;
  });
  return chartTypes;
};

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      activeTab: "1",
      tabLayouts: initialTabLayouts,

      setActiveTab: (tabId: string) =>
        set(() => ({
          activeTab: tabId,
        })),

      updateLayouts: (newLayouts) =>
        set((state) => {
          const currentTab = state.activeTab;
          const currentLayouts = state.tabLayouts[currentTab].layouts;
          const chartTypes = createChartTypeMap(currentLayouts);

          const updatedLayouts = (
            Object.keys(newLayouts) as BreakPoint[]
          ).reduce((acc, breakpoint) => {
            acc[breakpoint] = newLayouts[breakpoint].map(
              (item: LayoutItem) => ({
                ...item,
                chartType: chartTypes[item.i] || item.chartType || "bar",
              }),
            );
            return acc;
          }, {} as Layouts);

          return {
            tabLayouts: {
              ...state.tabLayouts,
              [currentTab]: {
                ...state.tabLayouts[currentTab],
                layouts: updatedLayouts,
              },
            },
          };
        }),

      deleteChart: (chartId: string) =>
        set((state) => {
          const currentTab = state.activeTab;
          const currentTabLayout = state.tabLayouts[currentTab];
          const chartTypes = createChartTypeMap(currentTabLayout.layouts);

          const newLayouts: Layouts = {
            xxl: currentTabLayout.layouts.xxl.filter(
              (item) => item.i !== chartId,
            ),
            xl: currentTabLayout.layouts.xl.filter(
              (item) => item.i !== chartId,
            ),
            lg: currentTabLayout.layouts.lg.filter(
              (item) => item.i !== chartId,
            ),
            md: currentTabLayout.layouts.md.filter(
              (item) => item.i !== chartId,
            ),
            sm: currentTabLayout.layouts.sm.filter(
              (item) => item.i !== chartId,
            ),
            xs: currentTabLayout.layouts.xs.filter(
              (item) => item.i !== chartId,
            ),
          };

          const breakpoints: BreakPoint[] = [
            "xxl",
            "xl",
            "lg",
            "md",
            "sm",
            "xs",
          ];
          breakpoints.forEach((breakpoint) => {
            newLayouts[breakpoint] = newLayouts[breakpoint].map((item) => ({
              ...item,
              chartType: chartTypes[item.i] || item.chartType || "bar",
            }));
          });

          return {
            tabLayouts: {
              ...state.tabLayouts,
              [currentTab]: {
                layouts: newLayouts,
                layoutKeys: currentTabLayout.layoutKeys.filter(
                  (key) => key !== parseInt(chartId),
                ),
              },
            },
          };
        }),

      addChart: (chartType, newLayout) =>
        set((state) => {
          const currentTab = state.activeTab;
          const currentTabLayout = state.tabLayouts[currentTab];
          const newId = Math.max(...currentTabLayout.layoutKeys, -1) + 1;

          const layoutWithType = (
            Object.keys(newLayout) as BreakPoint[]
          ).reduce((acc, breakpoint) => {
            acc[breakpoint] = newLayout[breakpoint].map((item) => ({
              ...item,
              chartType,
            }));
            return acc;
          }, {} as Layouts);

          return {
            tabLayouts: {
              ...state.tabLayouts,
              [currentTab]: {
                layoutKeys: [...currentTabLayout.layoutKeys, newId],
                layouts: {
                  xxl: [...currentTabLayout.layouts.xxl, ...layoutWithType.xxl],
                  xl: [...currentTabLayout.layouts.xl, ...layoutWithType.xl],
                  lg: [...currentTabLayout.layouts.lg, ...layoutWithType.lg],
                  md: [...currentTabLayout.layouts.md, ...layoutWithType.md],
                  sm: [...currentTabLayout.layouts.sm, ...layoutWithType.sm],
                  xs: [...currentTabLayout.layouts.xs, ...layoutWithType.xs],
                },
              },
            },
          };
        }),
    }),
    {
      name: "layout-storage",
    },
  ),
);
