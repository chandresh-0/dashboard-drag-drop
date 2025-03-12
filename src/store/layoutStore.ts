import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LayoutItem {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  chartType: string;
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

interface LayoutStore {
  layouts: Layouts;
  layoutKeys: number[];
  updateLayouts: (newLayouts: Layouts) => void;
  addChart: (chartType: string, newLayout: Layouts) => void;
  deleteChart: (chartId: string) => void;
}

const initialLayout: Layouts = {
  xxl: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
  xl: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
  lg: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
  md: [{ i: "0", x: 0, y: 0, w: 3, h: 3, chartType: "bar" }],
  sm: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
  xs: [{ i: "0", x: 0, y: 0, w: 2, h: 3, chartType: "bar" }],
};

// Helper function to create chart type map
const createChartTypeMap = (layouts: Layouts): Record<string, string> => {
  const chartTypes: Record<string, string> = {};
  (Object.keys(layouts) as BreakPoint[]).forEach((breakpoint) => {
    layouts[breakpoint].forEach((item) => {
      if (!chartTypes[item.i]) {
        chartTypes[item.i] = item.chartType;
      }
    });
  });
  return chartTypes;
};

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      layouts: initialLayout,
      layoutKeys: [0],

      updateLayouts: (newLayouts) =>
        set((state) => {
          const chartTypes = createChartTypeMap(state.layouts);

          const updatedLayouts = (
            Object.keys(newLayouts) as BreakPoint[]
          ).reduce((acc, breakpoint) => {
            acc[breakpoint] = newLayouts[breakpoint].map(
              (item: LayoutItem) => ({
                ...item,
                chartType: chartTypes[item.i] || item.chartType,
              }),
            );
            return acc;
          }, {} as Layouts);

          return { layouts: updatedLayouts };
        }),

      deleteChart: (chartId: string) =>
        set((state) => {
          const chartTypes = createChartTypeMap(state.layouts);

          const newLayouts = (
            Object.keys(state.layouts) as BreakPoint[]
          ).reduce((acc, breakpoint) => {
            acc[breakpoint] = state.layouts[breakpoint]
              .filter((item) => item.i !== chartId)
              .map((item) => ({
                ...item,
                chartType: chartTypes[item.i],
              }));
            return acc;
          }, {} as Layouts);

          return {
            layoutKeys: state.layoutKeys.filter(
              (key) => key !== parseInt(chartId),
            ),
            layouts: newLayouts,
          };
        }),

      addChart: (chartType, newLayout) =>
        set((state) => {
          const newId = Math.max(...state.layoutKeys, -1) + 1;
          return {
            layoutKeys: [...state.layoutKeys, newId],
            layouts: {
              xxl: [...state.layouts.xxl, ...newLayout.xxl],
              xl: [...state.layouts.xl, ...newLayout.xl],
              lg: [...state.layouts.lg, ...newLayout.lg],
              md: [...state.layouts.md, ...newLayout.md],
              sm: [...state.layouts.sm, ...newLayout.sm],
              xs: [...state.layouts.xs, ...newLayout.xs],
            },
          };
        }),
    }),
    {
      name: "layout-storage",
    },
  ),
);
