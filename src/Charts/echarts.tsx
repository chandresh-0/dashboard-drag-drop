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

  // ✅ Initialize chart only once
  useEffect(() => {
    if (!chartRef.current) return;

    chartInstance.current = echarts.init(chartRef.current);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  // ✅ Update chart options when `option` changes
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(option);
    }
  }, [option]);

  // ✅ Exposing the `resize` function to the parent
  useImperativeHandle(ref, () => ({
    resize() {
      chartInstance.current?.resize();
    },
  }));

  // Resize handler
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
