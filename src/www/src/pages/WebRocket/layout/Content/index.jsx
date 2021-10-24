import React from "react";
import { Route } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
import Terminal from "../../terminal";
import PublishConfig from '../../pulish-config';

import "./index.scss";

export default function Content({ view }) {
    return (
        <CacheSwitch>
            <CacheRoute exact path={`/rocket`}>
                {(props) => view === 'publish-config' ? <PublishConfig {...props} /> : <Terminal {...props} />}
            </CacheRoute>
            <Route path="/rocket/terminal" component={Terminal} />
            <Route path="/rocket/publish-config" component={PublishConfig} />

        </CacheSwitch>
    );
};

