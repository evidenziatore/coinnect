import React from "react";
import { Pie } from "react-chartjs-2";
import type { ChartData, ChartOptions } from "chart.js";
import "./ChartSetup";

interface Props {
  labels: string[];
  values: number[];
  colors: string[];
  title?: string;
  height?: number;
}

const PieChart: React.FC<Props> = ({ labels, values, colors, title, height = 360 }) => {
  const data: ChartData<"pie", number[], string> = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: colors,
        borderColor: colors,
        borderWidth: 1,
      },
    ],
  };

  const options: ChartOptions<"pie"> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "right" as "right" },
      title: { display: !!title, text: title },
      tooltip: { mode: "nearest" as "nearest", intersect: true },
    },
  };

  return (
    <div style={{ height }}>
      <Pie data={data} options={options} />
    </div>
  );
};

export default React.memo(PieChart);
