import { Button } from "@/components/ui/button";
import PageLayout from "../components/PageLayout";
// import "./styles.css";
import "react-grid-layout/css/styles.css";
import "react-resizable/css/styles.css";
const layouts = {
  xxl: [
    { i: "l1", x: 0, y: 0, w: 4, h: 3 },
    { i: "m1", x: 4, y: 0, w: 4, h: 3 },
    { i: "m2", x: 4, y: 5, w: 4, h: 3 },
    { i: "r1", x: 8, y: 0, w: 4, h: 3 },
    { i: "l2", x: 0, y: 8, w: 4, h: 3 },
    { i: "m3", x: 4, y: 9, w: 4, h: 3 },
    { i: "r2", x: 8, y: 8, w: 4, h: 3 },
    { i: "r3", x: 8, y: 0, w: 4, h: 3, static: true }, // 간격을 y 로 지정 하려면 static: true 로 지정 해야함.
  ],
  xl: [
    { i: "l1", x: 0, y: 0, w: 3, h: 4, resizeHandles: ["e"] },
    { i: "m1", x: 3, y: 0, w: 4, h: 3 },
    { i: "m2", x: 3, y: 5, w: 4, h: 3 },
    { i: "r1", x: 8, y: 0, w: 3, h: 5 },
    { i: "l2", x: 0, y: 8, w: 3, h: 5 },
    { i: "m3", x: 3, y: 9, w: 4, h: 3 },
    { i: "r2", x: 8, y: 8, w: 3, h: 2 },
    { i: "r3", x: 8, y: 0, w: 3, h: 2 },
  ],
  lg: [
    { i: "l1", x: 0, y: 0, w: 3, h: 4, resizeHandles: ["e"] },
    { i: "m1", x: 3, y: 0, w: 2, h: 3 },
    { i: "m2", x: 3, y: 5, w: 2, h: 3 },
    { i: "r1", x: 8, y: 0, w: 3, h: 5 },
    { i: "l2", x: 0, y: 8, w: 3, h: 5 },
    { i: "m3", x: 3, y: 9, w: 2, h: 3 },
    { i: "r2", x: 8, y: 8, w: 3, h: 2 },
    { i: "r3", x: 8, y: 0, w: 3, h: 2 },
  ],
  md: [
    { i: "l1", x: 0, y: 0, w: 3, h: 4, resizeHandles: ["e"] },
    { i: "m1", x: 3, y: 0, w: 3, h: 3 },
    { i: "m2", x: 3, y: 3, w: 3, h: 3 },
    { i: "r1", x: 0, y: 8, w: 3, h: 4 },
    { i: "l2", x: 0, y: 8, w: 3, h: 5 },
    { i: "m3", x: 3, y: 5, w: 3, h: 3 },
    { i: "r2", x: 8, y: 8, w: 3, h: 2 },
    { i: "r3", x: 8, y: 0, w: 3, h: 2 },
  ],
  sm: [
    { i: "l1", x: 0, y: 0, w: 2, h: 3, resizeHandles: ["e"] },
    { i: "m1", x: 3, y: 0, w: 2, h: 2 },
    { i: "m2", x: 3, y: 0, w: 2, h: 2 },
    { i: "r1", x: 0, y: 0, w: 2, h: 3 },
    { i: "l2", x: 0, y: 0, w: 2, h: 4 },
    { i: "m3", x: 3, y: 0, w: 2, h: 2 },
    { i: "r2", x: 3, y: 0, w: 2, h: 2 },
    { i: "r3", x: 3, y: 0, w: 2, h: 2 },
  ],
  xs: [
    { i: "l1", x: 0, y: 0, w: 2, h: 3, resizeHandles: ["e"] },
    { i: "m1", x: 0, y: 0, w: 2, h: 2 },
    { i: "m2", x: 0, y: 0, w: 2, h: 2 },
    { i: "r1", x: 0, y: 0, w: 2, h: 3 },
    { i: "l2", x: 0, y: 0, w: 2, h: 4 },
    { i: "m3", x: 0, y: 0, w: 2, h: 2 },
    { i: "r2", x: 0, y: 0, w: 2, h: 2 },
    { i: "r3", x: 0, y: 0, w: 2, h: 2 },
  ],
};
const ReactGridLayout = ({ children }: { children: any }) => {
  return (
    <PageLayout layouts={layouts}>
      {children}
    </PageLayout>
  );
};

export default ReactGridLayout;
