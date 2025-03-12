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

interface LayoutStore {
  layouts: Layouts;
  layoutKeys: number[];
  updateLayouts: (newLayouts: Layouts) => void;
  addChart: (chartType: string, newLayout: Layouts) => void;
  deleteChart: (chartId: string) => void;
}

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set, get) => ({
      layouts: {
        xxl: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
        xl: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
        lg: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
        md: [{ i: "0", x: 0, y: 0, w: 3, h: 3, chartType: "bar" }],
        sm: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
        xs: [{ i: "0", x: 0, y: 0, w: 2, h: 3, chartType: "bar" }],
      },
      layoutKeys: [0],

      updateLayouts: (newLayouts) =>
        set((state) => {
          const updatedLayouts = Object.keys(newLayouts).reduce(
            (acc, breakpoint) => {
              acc[breakpoint] = newLayouts[breakpoint].map((item) => ({
                ...item,
                chartType:
                  state.layouts[breakpoint].find(
                    (existing) => existing.i === item.i,
                  )?.chartType ||
                  item.chartType ||
                  "bar",
              }));
              return acc;
            },
            {} as Layouts,
          );

          return { layouts: updatedLayouts };
        }),

      deleteChart: (chartId: string) =>
        set((state) => {
          const newLayouts = Object.keys(state.layouts).reduce(
            (acc, breakpoint) => {
              acc[breakpoint] = state.layouts[breakpoint]
                .filter((item) => item.i !== chartId)
                .map((item) => ({
                  ...item,
                  chartType:
                    state.layouts[breakpoint].find(
                      (existing) => existing.i === item.i,
                    )?.chartType || item.chartType,
                }));
              return acc;
            },
            {} as Layouts,
          );

          return {
            layoutKeys: state.layoutKeys.filter(
              (key) => key !== parseInt(chartId),
            ),
            layouts: newLayouts,
          };
        }),

      addChart: (chartType, newLayout) =>
        set((state) => {
          const newId = state.layouts.xxl.length;
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
