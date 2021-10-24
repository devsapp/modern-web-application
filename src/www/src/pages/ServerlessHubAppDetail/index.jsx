import React from "react";
import { Breadcrumb } from "@b-design/ui";
import AppContent from "./mid-content/index";
import "./index.scss";

class AppDetail extends React.Component {
    backToAppCenter = () => {
        this.props.history.push("/hubs");
    };

    render() {
        return (
            <div className="page-container">
                <div className="page-title-container">
                    <span className="title-name">
                        <Breadcrumb separator="/">
                            <Breadcrumb.Item onClick={this.backToAppCenter} >Serverless Hub</Breadcrumb.Item>
                            <Breadcrumb.Item >应用详情</Breadcrumb.Item>
                        </Breadcrumb>
                    </span>
                </div>
                <AppContent {...this.props} />
            </div>
        );
    }
}

export default AppDetail;
