import React, { Component } from "react";
import _ from "loadsh";
import { Search, Tab, Notification } from '@b-design/ui';
import SearchResult from './components/search-result';
import ServerlessHubLayout from './layout';
import * as request from '../../utils/request';
import { Provider } from './hub-config';
import "./index.scss";
const tabs = [
    { tab: '优选', key: '/hubs/special-view' },
    { tab: '新品', key: '/hubs/new-view', },
    { tab: '热门', key: '/hubs/download-more-view' },
    { tab: '收藏', key: '/hubs/collect-view' }
];
const DEFAULT_ROUT_PATH = '/hubs/special-view';
const DEFAULT_BASIC_NAME = '/hubs';
export default class ServerlessHub extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            accessVisible: false,
            searchValue: '',
            accessInfo: {},
            apps: [],
            isSearch: false,
            safetyCode: '',
            collectApps: []
        }
    }

    componentDidMount = async () => {
     
        $(window).resize(() => {
            this.forceUpdate();
        });
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


    searchApp = async (data = {}, noLoading = false) => {
        if (!noLoading) {
            this.openLoading();
        }
        data = Object.assign({}, data, { type: 'Application' })
        const result = await request.post('appCenter/getApps', data);
        const apps = _.get(result, 'data.apps', []);
        this.setState({
            apps,
            isSearch: true
        });
        this.closeLoading();
    }

    resetSearch = () => {
        this.setState({
            apps: [],
            isSearch: false
        });
    }

    collectApp = async (package_name, isCollect) => {
        const { safetyCode } = this.state;
        if (safetyCode) {
            const result = await request('userAppCenter/collectApp', { safety_code: safetyCode, package_name });
            if (result.code === 200) {
                let title = '收藏成功';
                if (isCollect) {
                    title = '取消收藏';
                }
                Notification.open({
                    title,
                    type: 'success'
                });
                this.getCollectApps();
            }

        } else {
            Notification.open({
                title: '您还没有登录，请前去登录'
            })
        }
    }

    getSafetyCode = async () => {
        const result = await request('userCenter/getSaftyCode');
        if (result.code === 200) {
            this.setState({
                safetyCode: result.data
            });
        }

    }

    getCollectApps = async () => {
        const result = await request('userAppCenter/getCollectApp');
        if (result.code === 200) {
            const collectApps = result.data.map((item) => item.package);
            this.setState({
                collectApps
            })
        }
    }


    initAppTemplate = async (data) => {
        this.initTemplateInstance && this.initTemplateInstance.initAppTemplate(data);
    }

    render() {
        const { apps, isSearch, collectApps, accessInfo, accessVisible } = this.state;
        const { history, location } = this.props;
        let { pathname = DEFAULT_ROUT_PATH } = location;
        pathname = pathname === DEFAULT_BASIC_NAME ? DEFAULT_ROUT_PATH : pathname;

        const confusedAccessInfo = _.get(accessInfo, 'confusedAccessInfo', { _key: '' }); //获取加密的秘钥信息
        const noAccess = Object.keys(confusedAccessInfo).length === 0;

        return (
            <Provider value={{ collectApps, collectApp: this.collectApp }}>
                <div className="serverless-hub-container">
                    <div className="top-search-container">
                        <div className="top-title">
                            <div className="top-name">Serverless Hub</div>
                        </div>
                        <div className="top-search-content" style={{ marginRight: 10 }}>
                            <Search
                                key="3"
                                id="search-input"
                                placeholder="快速查找"
                                onSearch={async (v) => {
                                    console.log('ffff');
                                    this.setState({
                                        searchValue: v
                                    })
                                    await this.searchApp({ keyword: v });
                                }}
                                searchText={<span></span>}
                                style={{ width: '300px' }}
                            />
                        </div>
                    </div>
                    <div className="top-desc">
                        <Tab
                            className="next-tabs-blue"
                            onClick={this.resetSearch}
                            activeKey={pathname}
                            defaultActiveKey={pathname}
                            onChange={(key) => {
                                localStorage.setItem('hub-path', key);
                                const path = {
                                    pathname: key
                                };

                                history.push(path);
                            }} >
                            {tabs.map(tab => (
                                <Tab.Item title={<div className="tab-inner"><img src={tab.icon} style={tab.iconWidth ? { width: tab.iconWidth } : null} /><span>{tab.tab}</span></div>} key={tab.key}>
                                </Tab.Item>
                            ))}
                        </Tab>
                    </div>
                    <div className="center-content-container" style={{ height: window.innerHeight - 160 }}>
                        <If condition={isSearch}>
                            <SearchResult initAppTemplate={this.initAppTemplate} apps={apps} onSearch={() => this.searchApp({ keyword: this.state.searchValue }, true)} />
                        </If>
                        <If condition={!isSearch}>
                            <ServerlessHubLayout />
                        </If>
                    </div>
                </div>
            </Provider>
        );
    }
}