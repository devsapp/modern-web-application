import React from "react";
import { ConfigProvider } from "@b-design/ui";
import Content from "./content";
import "./index.scss";

export default function ServerlessHubLayout() {
    const view = localStorage.getItem('hub-path');
    return (
        <ConfigProvider>
            <div className="serverless-hub-layout">
                <Content view={view} />
            </div>
        </ConfigProvider>
    );
}
