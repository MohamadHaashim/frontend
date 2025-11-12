import React from "react";
import ReactApexChart from "react-apexcharts";

class FunnelChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      series: [
        {
          name: "Funnel Series",
          data: [1380, "1265%", 1100, 990, 880],
        },
      ],
      options: {
        chart: {
          type: "bar",
          height: 350,
        },
        toolbar: {
          show: false,
        },
        plotOptions: {
          bar: {
            borderRadius: 0,
            horizontal: true,
            barHeight: "80%",
            isFunnel: true,
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opt) {
            return opt.w.globals.labels[opt.dataPointIndex] + ":  " + val;
          },
          dropShadow: {
            enabled: true,
          },
        },

        xaxis: {
          categories: [
            "Impression",
            "CTR ",
            "Clicks 600",
            "CVR 15%",
            "Orders 40",
          ],
        },
        legend: {
          show: false,
        },
        colors: ["#00976D", "#CAFCD0", "#00D26E"],
      },
    };
  }

  render() {
    return (
      <div id="chart">
        <ReactApexChart
          options={this.state.options}
          series={this.state.series}
          type="bar"
          height={300}
          width="100%"
        />
      </div>
    );
  }
}
export default FunnelChart;
