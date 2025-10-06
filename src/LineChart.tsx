import React from "react";
import { Line } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "./ChartSetup";

interface Dataset {
  label: string;
  data: number[];
  fill?: boolean;
  tension?: number;
  borderColor?: string;
  backgroundColor?: string;
}

interface Props {
  labels: string[];
  datasets: Dataset[];
  title?: string;
  height?: number;
  options?: ChartOptions<"line">;
}

const LineChart: React.FC<Props> = ({ labels, datasets, title, height = 360, options }) => {
  const data: ChartData<"line", number[], string> = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      borderColor: ds.borderColor ?? "#2563eb",
      backgroundColor: ds.backgroundColor ?? "#2563eb33",
    })),
  };

  const defaultOptions: ChartOptions<"line"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as "top" },
      title: { display: !!title, text: title },
      tooltip: { mode: "index" as "index", intersect: false },
    },
    scales: {
      x: {
        stacked: false,
        ticks: { autoSkip: false, maxRotation: 45, minRotation: 45 },
      },
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ height }}>
      <Line data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

export default React.memo(LineChart);
