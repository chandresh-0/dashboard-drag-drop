import { useEffect, useRef } from "react";
import * as echarts from "echarts";

const EChart = ({ option }: { option: any }) => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const myChart = echarts.init(chartRef.current);
    myChart.setOption(option);

    const handleResize = () => {
      myChart.resize();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
      myChart.dispose();
    };
  }, [option]);

  useEffect(() => {
    if (chartRef.current) {
      const myChart = echarts.init(chartRef.current);
      myChart.setOption(option);
      setTimeout(() => {
        myChart.resize();
      }, 1000);
    }
  }, [option]);

  return (
    <div
      ref={chartRef}
      className="bg-white rounded-lg p-2 shadow-2xl "
      style={{ width: "100%", height: "100%" }}
    />
  );
};

export default EChart;
