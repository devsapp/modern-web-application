import React from "react";
import { Route } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
import BasicInfoView from "../../pages/basicinfo-view";
import ConfigView from '../../pages/config-view';
import DebugView from '../../pages/debug-view';
import MonitorView from '../../pages/monitor-view';
import STView from '../../pages/st-view';
import TerminalView from '../../pages/terminal-view';


import "./index.scss";

export default function Content({ view }) {
    return (
        <CacheSwitch>
            <CacheRoute exact path={`/userapp`}>
                {(props) => view === 'basicinfo' ? <BasicInfoView {...props} /> : <ConfigView {...props} />}
            </CacheRoute>
            <Route path="/userapp/basicinfo-view" component={BasicInfoView} />
            <Route path="/userapp/config-view" component={ConfigView} />
            <Route path="/userapp/debug-view" component={DebugView} />
            <Route path="/userapp/monitor-view" component={MonitorView} />
            <Route path="/userapp/st-view" component={STView} />
            <Route path="/userapp/terminal-view" component={TerminalView} />
        </CacheSwitch>
    );
};

