import React from "react";
import { ConfigProvider } from "@b-design/ui";
import Content from "./Content";
import "./index.scss";

export default function RocketLayout({ view }) {
    return (
        <ConfigProvider>
            <div className="rocket-layout">
                <Content view={view} />
            </div>
        </ConfigProvider>
    );
}
