import React from "react";
import { Bar } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "./ChartSetup";

interface Dataset {
  label: string;
  data: number[];
  borderColor?: string;
  backgroundColor?: string;
}

interface Props {
  labels: string[];
  datasets: Dataset[];
  title?: string;
  height?: number;
  options?: ChartOptions<"bar">;
}

const BarChart: React.FC<Props> = ({ labels, datasets, title, height = 360, options }) => {
  const data: ChartData<"bar", number[], string> = {
    labels,
    datasets: datasets.map((ds) => ({
      ...ds,
      borderColor: ds.borderColor ?? "#2563eb",
      backgroundColor: ds.backgroundColor ?? "#2563eb33",
    })),
  };

  const defaultOptions: ChartOptions<"bar"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as "top" },
      title: { display: !!title, text: title },
      tooltip: { mode: "index" as "index", intersect: false },
    },
    scales: {
      x: { stacked: false },
      y: { beginAtZero: true },
    },
  };

  return (
    <div style={{ height }}>
      <Bar data={data} options={{ ...defaultOptions, ...options }} />
    </div>
  );
};

export default React.memo(BarChart);
