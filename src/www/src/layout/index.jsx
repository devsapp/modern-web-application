import React from "react";
import { ConfigProvider } from "@alifd/next";
import Content from "./Content";
import LeftMenu from "./LeftMenu";
import TopBar from './top-bar';
import "./index.scss";

export default function MainLayout() {
  return (
    <ConfigProvider>
      <div className="layout">
        <TopBar />
        <div className="layout-shell">
          {/* <div className="layout-navigation">
            <LeftMenu />
          </div> */}
          <div className="layout-content">
            <Content />
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
