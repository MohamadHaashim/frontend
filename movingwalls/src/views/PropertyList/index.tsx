import React, { Component } from "react";
import AuthLayout from "../../layouts/auth";
import './index.css';
import PropertyListNavbar from "../../components/property-list/property-nav/index";
import BillBoardListing from "../../components/property-list/property-search/index";
interface PropertyListProps {
    currencyCode: any;
}
class PropertyDetails extends Component<PropertyListProps> {

    state = {
        filterChildData: {},
        currencyCode: this.props.currencyCode || localStorage.getItem("currencyCode")
    };

    constructor(props: any) {
        super(props);
    }

    // Callback to update the parent's state with the new dates
    handleCallback = (childData: any) => {
        this.setState({ filterChildData: childData });
    };

    render() {
        return (
            <div>
                <AuthLayout>
                    <div className="container p-0">
                        <PropertyListNavbar parentCallback={this.handleCallback} />
                        <BillBoardListing filterData={this.state.filterChildData} currencyCode={this.state.currencyCode} />
                    </div>
                </AuthLayout>
            </div>
        );
    }
}

export default PropertyDetails;
