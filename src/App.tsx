import "react-resizable/css/styles.css";
import ReactGridLayout from "./Page/ReactGridLayout";
import HeaderTabs from "./components/HeaderTabs";
import Echarts from "./Charts/echarts";
import * as ChartsConfig from "./utils/charts";
import { GripVertical } from "lucide-react";
import { generateResponsiveGridLayout } from "@/utils/generateLayout";
import { useState, useEffect, useMemo } from "react";
import DropdownMenuCheckboxes from "./components/DropDownComponent";

interface Tab {
  name: string;
  id: string;
  value: string;
}

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

function App() {
  const [layoutsKeys, setLayoutsKeys] = useState<number[]>([]);
  const [layout, setLayout] = useState<Layouts>({
    xxl: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
    xl: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
    lg: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
    md: [{ i: "0", x: 0, y: 0, w: 3, h: 3, chartType: "bar" }],
    sm: [{ i: "0", x: 0, y: 0, w: 4, h: 3, chartType: "bar" }],
    xs: [{ i: "0", x: 0, y: 0, w: 2, h: 3, chartType: "bar" }],
  });

  const getChartConfig = useMemo(
    () => (id: number) => {
      if (!layout.xxl[id]) return ChartsConfig.barOptions;
      console.log();
      switch (layout.xxl[id].chartType) {
        case "line":
          return ChartsConfig.lineOptions;
        case "stackColumn":
          return ChartsConfig.stackColumn;
        case "pie":
          return ChartsConfig.pie;
        case "donut":
          return ChartsConfig.donut;
        case "semiDonut":
          return ChartsConfig.semiDonut;
        case "barRace":
          return ChartsConfig.barRaceOption;
        case "heatMap":
          return ChartsConfig.heatMapConfig;
        default:
          return ChartsConfig.barOptions;
      }
    },
    [layout.xxl],
  );

  const [activeTab, setActiveTab] = useState<Tab | null>(null);

  const handleTabChange = (tab: Tab) => {
    console.log("Selected Tab:", tab);
    setActiveTab(tab);
  };

  const tabs = [
    { name: "Dashboard", id: "1", value: "dashboard" },
    { name: "NDR", id: "2", value: "ndr" },
    { name: "Billing", id: "3", value: "billing" },
  ];
  const addNewCharts = (chartType: string) => {
    const newId = layout.xxl.length;
    debugger;
    const newLayout = generateResponsiveGridLayout(1, chartType, String(newId));
    setLayoutsKeys((prev) => [...prev, newId]);
    setLayout((prev) => ({
      xxl: [...prev.xxl, ...newLayout.xxl],
      xl: [...prev.xl, ...newLayout.xl],
      lg: [...prev.lg, ...newLayout.lg],
      md: [...prev.md, ...newLayout.md],
      sm: [...prev.sm, ...newLayout.sm],
      xs: [...prev.xs, ...newLayout.xs],
    }));
  };

  return (
    <>
      <div className="flex justify-between p-1 bg-white">
        <HeaderTabs
          scrollableTabs={tabs}
          getActiveTab={handleTabChange}
        />
        <DropdownMenuCheckboxes newChart={addNewCharts} />
      </div>
      {JSON.stringify(layout)}
      <ReactGridLayout layouts={layout}>
        {layoutsKeys.map((id) => (
          <div
            key={id}
            className={`p-2 relative group rounded-lg shadow-lg`}
          >
            <div className="absolute top-4 left-3 z-[11] cursor-move text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-gray-800 drag-handle">
              <GripVertical />
            </div>

            <Echarts option={getChartConfig(id)} />
          </div>
        ))}
      </ReactGridLayout>
    </>
  );
}

export default App;

//  bar race not working
