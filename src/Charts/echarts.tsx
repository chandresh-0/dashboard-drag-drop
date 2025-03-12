import { forwardRef, useEffect, useImperativeHandle, useRef } from "react";
import * as echarts from "echarts";

interface EchartProps {
  option: any;
}
interface RefType {
  resize: () => void;
}

const EChart = forwardRef<RefType, EchartProps>((props, ref) => {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.EChartsType | null>(null);
  const { option } = props;

  useEffect(() => {
    if (!chartRef.current) return;

    // Initialize chart
    chartInstance.current = echarts.init(chartRef.current);
    chartInstance.current.setOption(option);

    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, [option]);

  // ✅ Exposing the `resize` function to parent
  useImperativeHandle(ref, () => ({
    resize() {
      chartInstance.current?.resize();
    },
  }));

  return (
    <div
      ref={chartRef}
      className="bg-white rounded-lg p-2 shadow-2xl "
      style={{ width: "100%", height: "100%" }}
    />
  );
});

export default EChart;
