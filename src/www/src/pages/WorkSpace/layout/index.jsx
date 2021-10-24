import React from "react";
import { ConfigProvider } from "@b-design/ui";
import Content from "./content";
import "./index.scss";

export default function WorkspaceLayout({ view }) {
    return (
        <ConfigProvider>
            <div className="workspace-layout">
                <Content view={view} />
            </div>
        </ConfigProvider>
    );
}
