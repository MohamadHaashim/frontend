import { useEffect, useState } from "react";
import { Bar, Line } from "react-chartjs-2";
import {
  refBarChart,
  refBarChart4,
  refBarChartSet2,
  refBarChartSet3,
  mainBalance,
  mainBalanceSet2,
  mainBalanceSet3,
  availableBalance,
  summaryBalance,
  summaryBalanceMonth,
  summaryBalanceCurrent,
  summaryBalanceYear,
} from "./PanelChartData";

export const BalanceFlowChart = ({ state }) => {
  const [data, setData] = useState(mainBalance);
  useEffect(() => {
    let defaultData;
    if (state === "month") {
      defaultData = mainBalanceSet2;
    } else if (state === "year") {
      defaultData = mainBalanceSet3;
    } else {
      defaultData = mainBalance;
    }
    setData(defaultData);
  }, [state]);
  return (
    <Line
      data={data}
      options={{
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data.datasets[tooltipItem[0].datasetIndex].label;
            },
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]] + " BTC";
            },
          },
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 10,
              },
              gridLines: {
                color: "rgba(82, 100, 132, 0.2)",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 5,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 20,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
};

export const ReferralCharts = ({ state }) => {
  const [data, setData] = useState(refBarChart);
  useEffect(() => {
    let object;
    if (state === "7") {
      object = refBarChartSet2;
    } else if (state === "15") {
      object = refBarChartSet3;
    } else {
      object = refBarChart4;
    }
    setData(object);
  }, [state]);
  return (
    <Bar
      data={data}
      className="chart-refer-stats chartjs-render-monitor"
      options={{
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return false;
            },
            label: function (tooltipItem, data) {
              return `${data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]]} people`;
            },
          },
          backgroundColor: "#fff",
          titleFontSize: 11,
          titleFontColor: "#6783b8",
          titleMarginBottom: 4,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 10,
          bodySpacing: 3,
          yPadding: 8,
          xPadding: 8,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: false,
              ticks: {
                beginAtZero: true,
              },
            },
          ],
          xAxes: [
            {
              display: false,
            },
          ],
        },
      }}
    />
  );
};

export const AvailableBalanceCharts = ({ currency }) => {
  return (
    <Bar
      data={availableBalance}
      options={{
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          enabled: true,
          callbacks: {
            title: function (tooltipItem, data) {
              return data.datasets[tooltipItem[0].datasetIndex].label;
            },
            label: function (tooltipItem, data) {
              return `${data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]]} ${currency}`;
            },
          },
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              display: false,
            },
          ],
          xAxes: [
            {
              display: false,
            },
          ],
        },
      }}
    />
  );
};

export const BalanceSummaryChart = ({ state }) => {
  const [data, setData] = useState(summaryBalance);
  useEffect(() => {
    let defaultData;
    if (state === "month") {
      defaultData = summaryBalanceMonth;
    } else if (state === "year") {
      defaultData = summaryBalanceYear;
    } else if (state === "current") {
      defaultData = summaryBalanceCurrent;
    } else {
      defaultData = summaryBalance;
    }
    setData(defaultData);
  }, [state]);

  return (
    <Line
      data={data}
      options={{
        legend: {
          display: false,
        },
        maintainAspectRatio: false,
        tooltips: {
          callbacks: {
            title: function (tooltipItem, data) {
              return data["labels"][tooltipItem[0]["index"]];
            },
            label: function (tooltipItem, data) {
              return data.datasets[tooltipItem.datasetIndex]["data"][tooltipItem["index"]] + " BTC";
            },
          },
          backgroundColor: "#eff6ff",
          titleFontSize: 13,
          titleFontColor: "#6783b8",
          titleMarginBottom: 6,
          bodyFontColor: "#9eaecf",
          bodyFontSize: 12,
          bodySpacing: 4,
          yPadding: 10,
          xPadding: 10,
          footerMarginTop: 0,
          displayColors: false,
        },
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: false,
                fontSize: 12,
                fontColor: "#9eaecf",
                padding: 10,
              },
              gridLines: {
                color: "rgba(82, 100, 132, 0.2)",
                tickMarkLength: 0,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
              },
            },
          ],
          xAxes: [
            {
              ticks: {
                fontSize: 12,
                fontColor: "#9eaecf",
                source: "auto",
                padding: 5,
              },
              gridLines: {
                color: "transparent",
                tickMarkLength: 20,
                zeroLineColor: "rgba(82, 100, 132, 0.2)",
                offsetGridLines: true,
              },
            },
          ],
        },
      }}
    />
  );
};
