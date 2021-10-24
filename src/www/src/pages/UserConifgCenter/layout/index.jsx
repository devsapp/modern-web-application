import React from "react";
import { ConfigProvider } from "@b-design/ui";
import Content from "./Content";
import LeftMenu from './LeftMenu';
import "./index.scss";

export default function RocketLayout({ view }) {
    return (
        <ConfigProvider>
            <div className="config-layout-container">
                <div className="config-nav">
                    <LeftMenu />
                </div>
                <div className="config-content">
                    <Content view={view} />
                </div>
            </div>
        </ConfigProvider>
    );
}
