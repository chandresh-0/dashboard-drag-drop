import "react-resizable/css/styles.css";
import ReactGridLayout from "./Page/ReactGridLayout";
import HeaderTabs from "./components/HeaderTabs";
import Echarts from "./Charts/echarts";
import * as ChartsConfig from "./utils/charts";
import { GripVertical, X } from "lucide-react";
import { generateResponsiveGridLayout } from "@/utils/generateLayout";
import { useMemo, useRef } from "react";
import DropdownMenuCheckboxes from "./components/DropDownComponent";
import { useLayoutStore } from "./store/layoutStore";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { DatePickerWithRange } from "./components/DateRangePicker";
import { Button } from "./components/ui/button";
import MapContainer from "./components/Map";

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
  minW: number;
  minH: number;
}

interface Layouts {
  xxl: LayoutItem[];
  xl: LayoutItem[];
  lg: LayoutItem[];
  md: LayoutItem[];
  sm: LayoutItem[];
  xs: LayoutItem[];
}

interface RefType {
  resize: () => void;
  reRender: () => void;
}

function App() {
  const {
    activeTab,
    tabLayouts,
    setActiveTab,
    updateLayouts,
    addChart,
    deleteChart,
  } = useLayoutStore();
  const chartRef = useRef<RefType>(null);

  const currentLayouts = tabLayouts[activeTab].layouts;
  const currentLayoutKeys = tabLayouts[activeTab].layoutKeys;

  const getChartConfig = useMemo(
    () => (id: number) => {
      const chartType = currentLayouts.xxl.find(
        (res) => res.i === String(id),
      )?.chartType;
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
        case "barRace":
          return { ...ChartsConfig.barRaceOption, animation: true }; // Ensure animation is enabled
        default:
          return ChartsConfig.barOptions;
      }
    },
    [currentLayouts.xxl],
  );

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab.id);
    if (chartRef.current) {
      chartRef.current.reRender();
    }
  };

  const tabs = [
    { name: "Dashboard", id: "1", value: "dashboard" },
    { name: "NDR", id: "2", value: "ndr" },
    { name: "Billing", id: "3", value: "billing" },
  ];

  const addNewCharts = (chartType: string) => {
    const newId = currentLayouts.xxl.length;
    const newLayout = generateResponsiveGridLayout(
      newId,
      chartType,
      String(newId),
    );

    addChart(chartType, newLayout);
  };

  const onLayoutChange = (_: LayoutItem[], allLayouts: Layouts) => {
    updateLayouts(allLayouts);
    if (chartRef.current) {
      chartRef.current.resize();
      chartRef.current.reRender();
    }
  };

  return (
    <>
      <MapContainer />
      <div className="flex justify-between p-1 bg-white">
        <HeaderTabs
          scrollableTabs={tabs}
          getActiveTab={handleTabChange}
        />
        <div className="flex gap-2 items-center">
          <DatePickerWithRange />
          <DropdownMenuCheckboxes newChart={addNewCharts} />
        </div>
      </div>

      <ReactGridLayout
        layouts={currentLayouts}
        onLayoutChange={onLayoutChange}
      >
        {currentLayoutKeys.map((id) => (
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() => deleteChart(String(id))}
                      className="w-fit p-1 h-fit rounded-full bg-red-500 hover:bg-red-600 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      aria-label="Delete chart"
                    >
                      <X size={16} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Delete Chart</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            {/* <Echarts option={getChartConfig(id)} ref={chartRef} /> */}
            <Echarts
              key={`${activeTab}-${id}`}
              option={getChartConfig(id)}
              ref={chartRef}
            />
          </div>
        ))}
      </ReactGridLayout>
    </>
  );
}

export default App;

//  bar race not working
