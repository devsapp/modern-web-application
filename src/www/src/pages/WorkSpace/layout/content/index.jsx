import React from "react";
import { Route } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
import UserView from "../../pages/user-view";
import DeveloperView from "../../pages/developer-view";
import "./index.scss";

export default function Content({ view }) {
    return (
        <CacheSwitch>
            <CacheRoute exact path={`/workspace`}>
                {(props) => view === 'user-view' ? <UserView {...props} /> : <DeveloperView {...props} />}
            </CacheRoute>
            <Route path="/workspace/user-view" component={UserView} />
            <Route path="/workspace/developer-view" component={DeveloperView} />
            {/* <Route exact path="*" component={NotFound} /> */}
        </CacheSwitch>
    );
};

