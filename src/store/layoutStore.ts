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
  // Use xxl as the source of truth for chart types
  layouts.xxl.forEach((item) => {
    chartTypes[item.i] = item.chartType;
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
                chartType: chartTypes[item.i] || item.chartType || "bar",
              }),
            );
            return acc;
          }, {} as Layouts);

          return { layouts: updatedLayouts };
        }),

      deleteChart: (chartId: string) =>
        set((state) => {
          // Store the chart types before deletion
          const chartTypes = createChartTypeMap(state.layouts);

          // Explicitly delete from all breakpoints
          const newLayouts: Layouts = {
            xxl: state.layouts.xxl.filter((item) => item.i !== chartId),
            xl: state.layouts.xl.filter((item) => item.i !== chartId),
            lg: state.layouts.lg.filter((item) => item.i !== chartId),
            md: state.layouts.md.filter((item) => item.i !== chartId),
            sm: state.layouts.sm.filter((item) => item.i !== chartId),
            xs: state.layouts.xs.filter((item) => item.i !== chartId),
          };

          // Preserve chart types for remaining items
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
            layoutKeys: state.layoutKeys.filter(
              (key) => key !== parseInt(chartId),
            ),
            layouts: newLayouts,
          };
        }),

      addChart: (chartType, newLayout) =>
        set((state) => {
          const newId = Math.max(...state.layoutKeys, -1) + 1;
          // Ensure the new layout has the correct chart type
          const layoutWithType = (
            Object.keys(newLayout) as BreakPoint[]
          ).reduce((acc, breakpoint) => {
            acc[breakpoint] = newLayout[breakpoint].map((item) => ({
              ...item,
              chartType, // Ensure the new chart gets the correct type
            }));
            return acc;
          }, {} as Layouts);

          return {
            layoutKeys: [...state.layoutKeys, newId],
            layouts: {
              xxl: [...state.layouts.xxl, ...layoutWithType.xxl],
              xl: [...state.layouts.xl, ...layoutWithType.xl],
              lg: [...state.layouts.lg, ...layoutWithType.lg],
              md: [...state.layouts.md, ...layoutWithType.md],
              sm: [...state.layouts.sm, ...layoutWithType.sm],
              xs: [...state.layouts.xs, ...layoutWithType.xs],
            },
          };
        }),
    }),
    {
      name: "layout-storage",
    },
  ),
);
