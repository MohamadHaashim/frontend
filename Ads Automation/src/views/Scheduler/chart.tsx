import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement
} from "chart.js";
import { Bar, Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  plugins: {
    legend: {
      display: true,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      display: true,
    },
    y: {
      display: true,
    },
  },
};

interface chartData{
    datas:any
}

const SchedularChart: React.FunctionComponent<chartData> = (props) => {
    const activeSubscription = {
        labels:["Reports" ,"Rules" ],
        dataUnit: "USD",
        stacked: true,
        datasets: [
          {
            label: "Total Count",
            barPercentage: 0.5,
            categoryPercentage: 0.7,
            backgroundColor: [
              "#FE9900",
              "#FE9900",
              "#FE9900",
              "#FE9900",
              "#FE9900",
              "#FE9900",
            ],
            data: [
              
                props.datas.reportsData.totalCount,
                props.datas.rulesData.totalCount,
            ],
          },
          {
            label:"Success Count",
            barPercentage: 0.5,
            categoryPercentage: 0.7,
            backgroundColor: [
              "#3d3d3d",
              "#3d3d3d",
              "#3d3d3d",
              "#3d3d3d",
              "#3d3d3d",
              "#3d3d3d",
            ],
            data: [
                props.datas.reportsData.successCount,
                props.datas.rulesData.successCount,
            ],
          },
          {
            label:"Failed Count",
            barPercentage: 0.5,
            categoryPercentage: 0.7,
            backgroundColor: [
              "#1b9217",
              "#1b9217",
              "#1b9217",
              "#1b9217",
              "#1b9217",
              "#1b9217",
            ],
            data: [
                props.datas.reportsData.failedCount,
                props.datas.rulesData.failedCount,
            
            ],
          },
        ],
      };
    // const activeSubscription = {
    //     labels:["Total count","Success Count" ,"Failed Count" ],
    //     dataUnit: "USD",
    //     stacked: true,
    //     datasets: [
    //       {
    //         label: "Reports",
    //         barPercentage: 0.5,
    //         categoryPercentage: 0.7,
    //         backgroundColor: [
    //           "#FE9900",
    //           "#FE9900",
    //           "#FE9900",
    //           "#FE9900",
    //           "#FE9900",
    //           "#FE9900",
    //         ],
    //         data: [
              
    //             props.datas.reportsData.totalCount,
    //             props.datas.reportsData.successCount,
    //             props.datas.reportsData.failedCount,
            
    //         ],
    //       },
    //       {
    //         label:"Rules",
    //         barPercentage: 0.5,
    //         categoryPercentage: 0.7,
    //         backgroundColor: [
    //           "#3d3d3d",
    //           "#3d3d3d",
    //           "#3d3d3d",
    //           "#3d3d3d",
    //           "#3d3d3d",
    //           "#3d3d3d",
    //         ],
    //         data: [

    //             props.datas.rulesData.totalCount,
    //             props.datas.rulesData.successCount,
    //             props.datas.rulesData.failedCount,
            
    //         ],
    //       },
    //     ],
    //   };
  return (
    <div>
        <Bar
                options={options}
                data={activeSubscription}
                height={40}
                width={120}
            />
    </div>
  );
};

export default SchedularChart;
