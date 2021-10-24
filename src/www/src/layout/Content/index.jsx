import React from "react";
import { Route } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
import ServerlessHub from "../../pages/ServerlessHub/index";
import ServerlessHubAppDetail from '../../pages/ServerlessHubAppDetail';
import NotFound from "../../pages/NotFound";
import "./index.scss";

export default function Content() {
  return (
    <CacheSwitch>
      <CacheRoute exact path="/hubs">
        {(props) => <ServerlessHub {...props} />}
      </CacheRoute>
      <Route path="/hubs" component={ServerlessHub} />
      <Route path="/app-detail" component={ServerlessHubAppDetail} />
      <Route exact path="*" component={NotFound} />
    </CacheSwitch>
  );
};

