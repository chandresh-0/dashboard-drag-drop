import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  TabLayouts,
  Layouts,
  LayoutStore,
  BreakPoint,
} from "./layoutStoreTypes";
// 📌 Default empty layout structure for new tabs
const defaultLayout: Layouts = {
  xxl: [],
  xl: [],
  lg: [],
  md: [],
  sm: [],
  xs: [],
};

// 📌 Initial layout for predefined tabs
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

// 📌 Maps chart IDs to their chart types (for consistency when updating layouts)
const createChartTypeMap = (layouts: Layouts): Record<string, string> =>
  Object.fromEntries(layouts.xxl.map((item) => [item.i, item.chartType]));

// 📌 Zustand store to manage chart layouts
export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      activeTab: "1",
      tabLayouts: initialTabLayouts,

      // ✅ Switches the active tab and ensures state updates correctly
      setActiveTab: (tabId: string) =>
        set((state) => ({
          activeTab: tabId,
          tabLayouts: {
            ...state.tabLayouts,
            [tabId]: { ...state.tabLayouts[tabId] },
          },
        })),

      // ✅ Updates chart positions while preserving chart types
      updateLayouts: (newLayouts) =>
        set((state) => {
          const currentTab = state.activeTab;
          const chartTypes = createChartTypeMap(
            state.tabLayouts[currentTab].layouts,
          );

          // Preserve chart types while updating layout positions
          const updatedLayouts: Layouts = Object.fromEntries(
            (Object.keys(newLayouts) as BreakPoint[]).map((breakpoint) => [
              breakpoint,
              newLayouts[breakpoint].map((item) => ({
                ...item,
                chartType: chartTypes[item.i] || item.chartType || "bar",
              })),
            ]),
          ) as unknown as Layouts; // ✅ Explicitly cast to Layouts

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

      // ✅ Deletes a chart from all screen sizes
      deleteChart: (chartId: string) =>
        set((state) => {
          const currentTab = state.activeTab;
          const currentTabLayout = state.tabLayouts[currentTab];
          const chartTypes = createChartTypeMap(currentTabLayout.layouts);

          // Remove chart from all breakpoints
          const newLayouts: Layouts = Object.fromEntries(
            (Object.keys(currentTabLayout.layouts) as BreakPoint[]).map(
              (breakpoint) => [
                breakpoint,
                currentTabLayout.layouts[breakpoint].filter(
                  (item) => item.i !== chartId,
                ),
              ],
            ),
          ) as unknown as Layouts;

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

      // ✅ Adds a new chart with a unique ID
      addChart: (chartType, newLayout) =>
        set((state) => {
          const currentTab = state.activeTab;
          const currentTabLayout = state.tabLayouts[currentTab];
          const newId = Math.max(...currentTabLayout.layoutKeys, -1) + 1;

          // Assign the chart type to each breakpoint's layout
          const layoutWithType: Layouts = Object.fromEntries(
            (Object.keys(newLayout) as BreakPoint[]).map((breakpoint) => [
              breakpoint,
              newLayout[breakpoint].map((item) => ({ ...item, chartType })),
            ]),
          ) as unknown as Layouts;

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
    { name: "layout-storage" },
  ),
);
