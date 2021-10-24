import React, { Component } from "react";
import _ from "loadsh";
import { Tab } from '@b-design/ui';
import request from '../../../utils/request';
import ComponentMarkdown from './component-markdown';
import ComponentInstallDialog from './component-install-dialog';
export default class ComponentInfo extends Component {

    constructor(props) {
        super(props);
        this.state = {
            installTitle: '',
            showInstallInfoDialog: false,
            installInfo: ''
        }
    }
    componentDidMount = async () => {

    }

    installComponent = async (component) => {
        await request('componentCenter/installComponent', { component }, this.renderInstallInfo)
    }

    showError = async (content) => {
        this.setState({
            initTitle: <div style={{ color: 'red' }}>安装异常</div>,
            initInfo: content,
            initError: true
        })
    }
    openInstallDialog = () => {
        this.setState({
            showInstallInfoDialog: true,
            installTitle: '组件安装中...'
        })
    }

    closeInstallDialog = async (callback) => {
        this.setState({
            showInstallInfoDialog: false,
            params: []
        }, () => {
            callback && callback()
        })
    }

    installEnd = async () => {
        this.setState({
            installTitle: '恭喜您，安装完成'
        })
        const { refreshInstalledData, componentInfo } = this.props;
        refreshInstalledData && refreshInstalledData(componentInfo.name);
        setTimeout(this.closeInstallDialog, 1000);

    }

    setInstallInfoContent = async (installInfo) => {
        this.setState({
            installInfo
        })
    }

    renderInstallInfo = async (data) => {
        switch (data.status) {
            case -1:
                this.showError(data.result);
                break;
            case 0:
                this.installEnd();
                break;
            case 1:
                this.openInstallDialog(data.result);
                break;
            case 2:
                this.setInstallInfoContent(data.result);
                break;

            default:
                break;
        }
    }



    render() {
        const { componentInfo, localData } = this.props;
        const { showInstallInfoDialog, installInfo, installTitle } = this.state;
        return <div className="component-info">
            <div className="component-basic-info">
                <div className="component-img">
                    <div className="avartor-img"></div>
                </div>
                <div className="compoinent-info-container">
                    <div className="title">
                        <span className="title-detail">{componentInfo.name}</span>
                        <span className="more">{componentInfo.home || ''}</span>
                    </div>
                    <div className="static-info">
                        <span className="title" style={{ marginRight: 12 }}>{componentInfo.category}</span>
                        <span className="download" style={{ fontSize: '12px' }}>下载数：{componentInfo.download}</span>
                        <span className="star"></span>
                        <span ></span>
                    </div>
                    <div className="profile">
                        {componentInfo.description}
                    </div>

                    <If condition={!localData.fullPath}>
                        <div className="option" onClick={() => this.installComponent(componentInfo.name)}>
                            {/* <If condition={localData.fullPath}>
                            <span>卸载</span>
                        </If> */}

                            <span >安装</span>

                        </div>
                    </If>
                </div>
            </div>
            <div className="component-tab">
                <Tab >
                    <Tab.Item title={'详情'} >
                        <div style={{ height: window.innerHeight - 320, overflowY: ' auto', borderTop: '1px solid #eee' }}>
                            <div style={{ paddingLeft: 80, paddingRight: 80, }}> <ComponentMarkdown readme={componentInfo.readme || ''} /></div>
                        </div>
                    </Tab.Item>
                </Tab>
            </div>
            <ComponentInstallDialog visible={showInstallInfoDialog} data={{ installInfo, installTitle }} closeInstallDialog={this.closeInstallDialog} />
        </div>
    }
}