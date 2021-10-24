import React from "react";
import _ from "loadsh";
import { Breadcrumb, Tab } from '@b-design/ui';
import UserAppLayout from './layout';
import { getParams } from '../../utils/common';
import basicinfo from "../../assets/userapp-basicinfo.png";
import config from "../../assets/userapp-config.png";
import monitor from "../../assets/userapp-monitor.png";
import st from "../../assets/userapp-st.png";
import debug from "../../assets/userapp-debug.png";
import terminal from "../../assets/userapp-terminal.png";

import "./index.scss";

const tabs = [
    { tab: '基本信息', key: '/userapp/basicinfo-view', icon: basicinfo },
    { tab: '配置信息', key: '/userapp/config-view', icon: config },
    { tab: '可观测', key: '/userapp/monitor-view', icon: monitor },
    { tab: '压测', key: '/userapp/st-view', icon: st },
    { tab: '端云调试', key: '/userapp/debug-view', icon: debug, iconWidth: 23 },
    { tab: '终端', key: '/userapp/terminal-view', icon: terminal },
];
const BASIC_ROUT_NAME = '/userapp';
const DEFAULT_ROUT_PATH = '/userapp/basicinfo-view';
export default function UserAppDetail({ history, location }) {

    const workspace = getParams('workspace');
    const appName = getParams('appName');
    let { pathname = DEFAULT_ROUT_PATH } = location;
    pathname = pathname === BASIC_ROUT_NAME ? DEFAULT_ROUT_PATH : pathname
    return (
        <div className="page-container">
            <div className="title-container">
                <span className="title-breadcrumb">
                    <Breadcrumb separator="/">
                        <Breadcrumb.Item onClick={() => history.goBack()} >工作空间</Breadcrumb.Item>
                        <Breadcrumb.Item >应用详情</Breadcrumb.Item>
                    </Breadcrumb>
                </span>
            </div>
            <div className="userapp-container">
                <div className="tab-container">
                    <Tab shape={'wrapped'} onChange={(key) => {
                        const path = {
                            pathname: key,
                            search: `workspace=${workspace}&appName=${appName}`,
                        };
                        history.push(path)
                    }} className="next-tabs-blue" defaultActiveKey={pathname}>
                        {tabs.map(tab => (
                            <Tab.Item title={<div className="tab-inner"><img src={tab.icon} style={tab.iconWidth ? { width: tab.iconWidth } : null} /><span>{tab.tab}</span></div>} key={tab.key}>
                            </Tab.Item>
                        ))}
                    </Tab>
                </div>
                <div className="content-container" style={{ height: window.innerHeight - 180, overflowY: 'auto' }}>
                    <UserAppLayout view={'basicinfo'} history={history} />
                </div>
            </div>

        </div>
    );
}