import React from "react";
import { Route } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
import AccessConfig from "../../pages/access";
import Registry from '../../pages/registry';


import "../index.scss";

export default function Content({ view }) {
    return (
        <CacheSwitch>
            <CacheRoute exact path={`/user-config-center`}>
                {(props) => <AccessConfig {...props} />}
            </CacheRoute>
            <Route path="/user-config-center/access" component={AccessConfig} />
            <Route path="/user-config-center/registry" component={Registry} />

        </CacheSwitch>
    );
};

