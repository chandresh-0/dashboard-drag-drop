import { Responsive, WidthProvider } from "react-grid-layout";
import React from "react";
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

const PageLayout = (props: PageLayoutProps) => {
  const [currentBreakPoints, setCurrentBreakPoints] = React.useState("");
  const defaultProps = {
    className: " no-select",
    isDraggable: true,
    isResizable: true,
    breakpoints: { xxl: 1600, xl: 1200, lg: 992, md: 768, sm: 576, xs: 480 },
    cols: { xxl: 12, xl: 10, lg: 8, md: 6, sm: 4, xs: 2 },
    rowHeight: 200,
    margin: [0, 0],
    containerPadding: [0, 0],
    isBounded: true,
    onBreakpointChange: setCurrentBreakPoints,
  };

  return (
    <>
      <ResponsiveGridLayout
        {...defaultProps}
        {...props}
      >
        {props.children}
      </ResponsiveGridLayout>
    </>
  );
};

export default PageLayout;
