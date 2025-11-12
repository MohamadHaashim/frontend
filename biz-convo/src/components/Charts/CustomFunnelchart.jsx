import React from "react";
import DashboardService from '../../services/DashboardService';
class CustomFunnelchart extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            chartData: {
                impressions:0,
                ctr:0.0,
                clicks:0,
                cr:0.0,
                orders_Ad:0,
            }
        };
    }

    async componentDidMount() {
        try {
            const funnelChartData = await DashboardService.getFunnelChartData();

            this.setState({
                chartData: {
                    impressions: funnelChartData.impressions,
                    ctr: funnelChartData.ctr,
                    clicks: funnelChartData.clicks,
                    cr: funnelChartData.cr,
                    orders_Ad: funnelChartData.orders_Ad,
                }
            });
        } catch (error) {
            console.error("Error fetching funnel chart data:", error);
        }
    }
    render() {
        return (
            <div className="div-container-funnel pt-4">
                <div className="div1">Impression: {this.state.chartData.impressions}</div>
                <div className="div1">CTR: {this.state.chartData.ctr}%</div>
                <div className="div1">Clicks: {this.state.chartData.clicks}</div>
                <div className="div1">CVR: {this.state.chartData.cr}%</div>
                <div className="div1">Orders: {this.state.chartData.orders_Ad}</div>
            </div>
        );
    }
}
export default CustomFunnelchart;
