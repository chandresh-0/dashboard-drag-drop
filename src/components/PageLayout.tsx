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
  margin?: number[];
  containerPadding?: number[];
  children?: React.ReactNode;
}

const calculateBreakpoint = () => {
  const viewportWidth = window.innerWidth;
  switch (true) {
    case (viewportWidth > 1600):
      return 'xxl';
    case (viewportWidth > 1200 && viewportWidth <= 1600):
      return 'xl';
    case (viewportWidth > 992 && viewportWidth <= 1200):
      return 'lg';
    case (viewportWidth > 768 && viewportWidth <= 992):
      return 'md';
    case (viewportWidth > 576 && viewportWidth <= 768):
      return 'sm';
    case (viewportWidth <= 576):
      return 'xs';
  }
}

const PageLayout = (props: PageLayoutProps) => {
  const [currentBreakPoint, setCurrentBreakPoint] = React.useState(calculateBreakpoint());

  const defaultProps = useMemo(
    () => ({
      className: "layout no-select",
      isDraggable: true,
      isResizable: true,
      breakpoints: { xxl: 1600, xl: 1200, lg: 992, md: 768, sm: 576, xs: 480 },
      cols: { xxl: 16, xl: 10, lg: 8, md: 6, sm: 4, xs: 2 },
      rowHeight: 140,
      margin: [0, 0],
      containerPadding: [0, 0],
      isBounded: true,
      onBreakpointChange: setCurrentBreakPoint,
    }),
    [],
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
    <>
    <ResponsiveGridLayout
      {...defaultProps}
      {...props}
      style={gridStyle}
      >
      {props.children}
      <Button>Close</Button>
    </ResponsiveGridLayout>
      </>
  );
};

export default PageLayout;
