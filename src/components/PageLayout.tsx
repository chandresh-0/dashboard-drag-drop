import { Responsive, WidthProvider } from "react-grid-layout";
import React, { useMemo } from "react";
import { Button } from "./ui/button";
import "react-grid-layout/css/styles.css";

const ResponsiveGridLayout = WidthProvider(Responsive);

interface PageLayoutProps {
  className?: string;
  isDraggable?: boolean;
  isResizable?: boolean;
  breakpoints?: Record<string, number>;
  cols?: Record<string, number>;
  rowHeight?: number;
  margin?: [number, number];
  containerPadding?: [number, number];
  children?: React.ReactNode;
  layouts?: {
    [key: string]: Array<{
      i: string;
      x: number;
      y: number;
      w: number;
      h: number;
      static?: boolean;
    }>;
  };
  onLayoutChange?: (layout: any, layouts: any) => void;
}

const PageLayout = (props: PageLayoutProps) => {
  const [currentBreakPoint, setCurrentBreakPoint] = React.useState("");

  const defaultProps = useMemo(
    () => ({
      autoSize: true,
      className: "layout no-select",
      isDraggable: true,
      isResizable: true,
      draggableHandle: ".drag-handle",
      breakpoints: { xxl: 1600, xl: 1200, lg: 992, md: 768, sm: 576, xs: 480 },
      cols: { xxl: 16, xl: 12, lg: 8, md: 6, sm: 4, xs: 2 },
      rowHeight: 140,
      margin: [0, 0] as [number, number],
      containerPadding: [0, 0] as [number, number],
      isBounded: true,
      onBreakpointChange: setCurrentBreakPoint,
      onResizeStop: () => {
        // Trigger a window resize event to make charts re-render
        window.dispatchEvent(new Event("resize"));
      },
      onLayoutChange: props.onLayoutChange,
    }),
    [props.onLayoutChange],
  );

  const gridStyle = useMemo(() => {
    const cols =
      defaultProps.cols[currentBreakPoint as keyof typeof defaultProps.cols] ||
      12;
    const cellWidth = `${100 / cols}%`;
    return {
      backgroundSize: `${cellWidth} ${defaultProps.rowHeight}px`,
    };
  }, [currentBreakPoint, defaultProps.cols, defaultProps.rowHeight]);

  return (
    <ResponsiveGridLayout
      {...defaultProps}
      {...props}
      style={gridStyle}
    >
      {props.children}
    </ResponsiveGridLayout>
  );
};

export default PageLayout;
