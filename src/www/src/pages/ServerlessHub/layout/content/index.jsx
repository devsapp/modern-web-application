import React from "react";
import { Route } from "react-router-dom";
import CacheRoute, { CacheSwitch } from "react-router-cache-route";
import SpecialView from "../../pages/special-view";
import CollectView from '../../pages/collect-view';
import NewView from '../../pages/new-view';
import DownloadMoreView from '../../pages/download-more-view';
import "./index.scss";

// const PATH_MAP = {
//     '/hubs/special-view': SpecialView,
//     '/hubs/new-view': NewView,
//     '/hubs/collect-view': CollectView,
//     '/hubs/download-more-view': DownloadMoreView
// }


export default function Content({ view }) {

    return (
        <CacheSwitch>
            <Route exact path={`/hubs`}>
                {(props) => <SpecialView {...props} />}
            </Route>
            <Route path="/hubs/special-view" component={SpecialView} />
            <Route path="/hubs/collect-view" component={CollectView} />
            <Route path="/hubs/new-view" component={NewView} />
            <Route path="/hubs/download-more-view" component={DownloadMoreView} />
        </CacheSwitch>
    );
};

