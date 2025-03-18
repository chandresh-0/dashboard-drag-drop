import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as echarts from "echarts";

interface EchartProps {
  option: any;
}

interface RefType {
  resize: () => void;
  reRender: () => void;
}

const EChart = forwardRef<RefType, EchartProps>((props, ref) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const { option } = props;

  const initChart = () => {
    if (!chartRef.current) return;

    if (chartInstance.current) {
      chartInstance.current.dispose(); // Dispose of the old chart instance
    }

    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current.setOption(option, {
      notMerge: true,
      lazyUpdate: false,
    });
  };

  useEffect(() => {
    initChart();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  useEffect(() => {
    initChart(); // Ensure a full reset when options change
  }, [option]);

  useImperativeHandle(ref, () => ({
    resize() {
      chartInstance.current?.resize();
    },
    reRender() {
      initChart(); // Fully reset the chart
    },
  }));

  const handleResize = () => {
    chartInstance.current?.resize();
  };

  return (
    <div
      ref={chartRef}
      className="bg-white rounded-lg p-2 shadow-2xl"
      style={{ width: "100%", height: "100%" }}
    />
  );
});

export default EChart;
