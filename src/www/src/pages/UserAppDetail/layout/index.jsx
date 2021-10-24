import React from "react";
import { ConfigProvider } from "@b-design/ui";
import Content from "./Content";
import "./index.scss";

export default function UserAppDetailLayout({ view }) {
    return (
        <ConfigProvider>
            <div className="userapp-layout">
                <Content view={view} />
            </div>
        </ConfigProvider>
    );
}
