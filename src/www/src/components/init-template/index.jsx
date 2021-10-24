import React, { Component } from "react";
import _ from "loadsh";
import InitDialog from './init-dialog';
import request from '../../utils/request';
import './index.scss';

function SLoading() {
    return <div className="init-loading-container">
        <div className="init-loading" />
        <span className="loading-word">努力安装中...</span>
    </div>
}
export default class InitTemplage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            originData: {},
            params: [],
            showInitInfoDialog: false,
            showParamsDialog: false,
            workspace: '',
            initInfo: '',
            initTitle: '',
            initEnd: false,
            initError: false
        }
    }


    initAppTemplate = async (data) => {
        await request('appCenter/initAppTemplate', data, this.renderInitInfo);
        this.setState({
            originData: data
        })
    }

    openInitDialog = async (workspace) => {
        this.setState({
            showInitInfoDialog: true,
            initEnd: false,
            initError: false,
            initTitle: '应用初始化',
            initInfo: '',
            workspace
        })
    }
    setInitInfoContent = async (content) => {
        this.setState({
            initTitle: <SLoading />,
            initInfo: content
        })
    }
    showError = async (content) => {
        this.setState({
            initTitle: <div style={{ color: 'red' }}>模板初始化异常</div>,
            initInfo: content,
            initError: true
        })
    }

    closeInitDialog = async (callback) => {
        this.setState({
            showInitInfoDialog: false,
            params: []
        }, () => {
            callback && callback()
        })
    }

    initEnd = async (content) => {
        let { initError, initTitle } = this.state;
        const { callback } = this.props;
        callback && callback();
        if (!initError) {
            initTitle = '初始化成功,请进入下一步操作';
        }

        this.setState({
            initEnd: true,
            initTitle
        });
    }

    openParamsDialog = (data) => {
        let stateData = { showParamsDialog: true };
        if (data) {
            const { result, params } = data;
            stateData = Object.assign({}, stateData, { workspace: result, params })
        }
        this.setState(stateData);
    }

    renderInitInfo = async (data) => {
        switch (data.status) {
            case -1:
                this.showError(data.result);
                break;
            case 1:
                this.openInitDialog(data.result);
                break;
            case 2:
                this.setInitInfoContent(data.result);
                break;
            case 3:
                this.initEnd();
                break;
            case 4:
                this.openParamsDialog(data);
            default:
                break;
        }
    }

    goToConfig = async () => {
        this.closeInitDialog(() => {
            const { redirect = 'project-config' } = this.props;
            const { workspace } = this.state;
            const path = {
                pathname: `/${redirect}`,
                search: `workspace=${workspace}`,
            };
            this.props.history.push(path);
        });
    }

    closeParamsDialog = () => {
        this.setState({
            showParamsDialog: false
        })
    }

    submitParams = async (params) => {
        const { workspace } = this.state;
        const result = await request('configCenter/addPreConfig', { params, workspace });
        if (result.code === 200) {
            this.setState({
                showInitInfoDialog: false,
                showParamsDialog: false,
            }, () => {
                const { pathname = 'project-config' } = this.props;
                const path = {
                    pathname: `/${pathname}`,
                    search: `workspace=${workspace}`,
                };
                this.props.history.push(path);
            });
        }
    }

    render() {
        const { showInitInfoDialog, initInfo, initError, initEnd, initTitle, showParamsDialog, params, originData } = this.state;
        return <InitDialog
            visible={showInitInfoDialog}
            params={params}
            originData={originData}
            data={{ initInfo, initError, initEnd, initTitle }}
            showParamsDialog={showParamsDialog}
            submitParams={this.submitParams}
            openParamsDialog={this.openParamsDialog}
            closeParamsDialog={this.closeParamsDialog}
            closeInitDialog={this.closeInitDialog}
            goToConfig={this.goToConfig} />

    }
}