import React from "react";
import AppCard from './app-card';
import { Consumer } from '../hub-config';

export default function SearchResult({ apps = [], initAppTemplate, onSearch }) {
    return (
        <Consumer>
            {({ collectApps, collectApp }) =>
                <div className="result-container">
                    <If condition={apps.length > 0}>
                        {apps.map((app, i) => <AppCard key={`app${i}`} data={app} initAppTemplate={initAppTemplate} collectApps={collectApps} collectApp={collectApp} searchApp={onSearch} />)}
                    </If>
                    <If condition={apps.length === 0}>

                        <span>搜索不到结果</span>
                    </If>
                </div>}
        </Consumer>
    );
}