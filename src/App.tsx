import "react-resizable/css/styles.css";
import ReactGridLayout from "./Page/ReactGridLayout";
import HeaderTabs from "./components/HeaderTabs";
import Echarts from "./Charts/echarts";
import * as ChartsConfig from "./utils/charts";
import { GripVertical, X } from "lucide-react";
import { generateResponsiveGridLayout } from "@/utils/generateLayout";
import { useState, useEffect, useMemo } from "react";
import DropdownMenuCheckboxes from "./components/DropDownComponent";
import { useLayoutStore } from "./store/layoutStore";

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
  const { layouts, layoutKeys, updateLayouts, addChart, deleteChart } =
    useLayoutStore();

  const getChartConfig = useMemo(
    () => (id: number) => {
      const chartType = layouts.xxl[id]?.chartType;
      switch (chartType) {
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
    [layouts.xxl],
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
    const newId = layouts.xxl.length;
    const newLayout = generateResponsiveGridLayout(
      newId,
      chartType,
      String(newId),
    );
    addChart(chartType, newLayout);
  };

  const onLayoutChange = (_: LayoutItem[], allLayouts: Layouts) => {
    updateLayouts(allLayouts);
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
      {JSON.stringify(layouts)}
      <ReactGridLayout
        layouts={layouts}
        onLayoutChange={onLayoutChange}
      >
        {layoutKeys.map((id) => (
          <div
            key={id}
            className={`p-2 relative group rounded-lg shadow-md`}
          >
            <div className="absolute top-4 left-3 z-[11] flex gap-2">
              <div className="cursor-move text-gray-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:text-gray-800 drag-handle">
                <GripVertical />
              </div>
            </div>
            <div className="absolute top-4 right-4 z-[11] flex gap-2">
              <button
                onClick={() => deleteChart(String(id))}
                className="p-1 rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                aria-label="Delete chart"
              >
                <X size={16} />
              </button>
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
