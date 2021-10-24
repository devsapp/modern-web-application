import React, { Component } from "react";
import _ from "loadsh";
import { Loading } from '@b-design/ui';
import AppCard from '../components/app-card';
import SearchCategory from '../components/search-category';

import * as request from '../../../utils/request';
import { Consumer } from '../hub-config';
import "../index.scss";
export default class DownloadMoreVIew extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apps: [],
            params: [],
            category: []
        }
    }
    componentDidMount = async () => {
        await this.searchApp();
        await this.getCategory();
    }


    openLoading = () => {
        this.setState({
            loading: true
        })
    }

    closeLoading = () => {
        this.setState({
            loading: false
        })
    }

    getTags = async () => {
        const result = await request.get('appCenter/getTags');
        return _.get(result, 'data.tags', []);
    }

    getCategory = async () => {
        const result = await request.get('appCenter/getCategory');
        const category = _.get(result, 'data.category', []);
        this.setState({
            category: Object.keys(category).map((key) => ({ label: category[key], value: key }))
        });
        this.closeLoading();
    }

    searchApp = async (noLoading = false, data = {}) => {
        if (!noLoading) {
            this.openLoading();
        }
        data = Object.assign({}, data, { type: 'Application', sort: 'download' })
        const result = await request.post('appCenter/getApps', data);
        const apps = _.get(result, 'data.apps', []);
        this.setState({
            apps
        });
        this.closeLoading();
    }

    changeCategory = (value) => {
        this.searchApp(false, { category: value })
    }
    changeRuntime = (values) => {
        console.log(values);
    }

    initAppTemplate = async (data) => {
        this.initTemplateInstance && this.initTemplateInstance.initAppTemplate(data);
    }

    render() {
        const { apps, category, loading, } = this.state;
        const { history } = this.props;
        return <Consumer>
            {({ collectApps, collectApp }) => <div className="serverless-hub-container">

                <div className="center-content-container">

                    <div className="app-list-container" >
                        < Loading tip="应用查询"
                            visible={loading}
                            style={{ position: 'relative',width: '100%'  }}
                            indicator={<div className="load-container load8" >
                                <div className="loader"></div>
                            </div>}>
                            {/* <div className="app-search-tags">tags</div> */}
                            {apps.map && apps.map((app, i) => <AppCard key={`app${i}`} data={app} initAppTemplate={this.initAppTemplate} collectApps={collectApps} collectApp={collectApp} searchApp={() => this.searchApp(true)} />)}
                        </Loading>
                    </div>

                    <div className="search-category-container">
                        <SearchCategory category={category} changeCategory={this.changeCategory} changeRuntime={this.changeRuntime} />
                    </div>
                </div>
          

            </div>}</Consumer>
    }
}