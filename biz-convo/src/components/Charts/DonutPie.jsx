import React from "react";
import ReactApexChart from "react-apexcharts";

class DonutPie extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            series: props.series || [44, 55, 41, 17], // Use props.series if provided, otherwise use the default values
            options: {
                chart: {
                    type: "donut",
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                            },
                            legend: {
                                position: "bottom",
                            },
                        },
                    },
                ],
                colors: props.colors || ["#00976D", "#CAFCD0", "#00D26E", "#00D26E"], // Use props.colors if provided, otherwise use the default values
                labels: props.labels || [
                    "Color represents A",
                    "Color represents B",
                    "Color represents C",
                    "Color represents D",
                ],
            },
        };
    }

    componentDidUpdate(prevProps) {
        if (
            prevProps.series !== this.props.series ||
            prevProps.colors !== this.props.colors ||
            prevProps.labels !== this.props.labels
        ) {
            this.setState({
                series: this.props.series || [44, 55, 41, 17],
                options: {
                    ...this.state.options,
                    colors: this.props.colors || ["#00976D", "#CAFCD0", "#00D26E", "#00D26E"],
                    labels: this.props.labels || [
                        "Color represents A",
                        "Color represents B",
                        "Color represents C",
                        "Color represents D",
                    ],
                },
            });
        }
    }


    render() {
        return (
            <div id="chart">
                <ReactApexChart
                    options={this.state.options}
                    series={this.state.series}
                    type="donut"
                    height={300}
                    width="100%"
                />
            </div>
        );
    }
}

export default DonutPie;
