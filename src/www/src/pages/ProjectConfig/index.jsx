import React, { Component } from "react";
import _ from "loadsh";
import { Nav, Button, Icon, Field, Dialog, Notification, Breadcrumb, SplitButton } from '@b-design/ui';
import { parseDocument, stringify } from 'yaml'
import Editor from "../../components/Editor";
import DragToChangeValue from '../../components/DragToChangeValue';
import { addOpenLinks, removeOpenLinks } from '../../utils/url';
import request from '../../utils/request';
import BasicConfig from './components/basic-config';
import ServiceConfig from './components/service-config';
import ExecuteDialog from './components/execute-dialog';
import { getParams, setParams, throttle } from '../../utils/common';
import { generateMagicVariables } from '../../utils/parsed';
import { Provider } from './project-config-context';
import vscodeIcon from "../../assets/vscode.png";
import "./index.scss";
const { SubNav, Item } = Nav;
const BASIC_CONFIG_ID = 'basic-config';
const CONFIG_CONTAINER_ID = 'config-container';
const draggableStyle = {
    zIndex: 1000,
    width: 3,
    left: 0,
    top: 0,
    bottom: 50,
    position: 'absolute',
    cursor: 'col-resize'
};

function SLoading() {
    return <div className="execute-loading-container">
        <div className="execute-loading" />
        <span className="loading-word">执行中<span style={{ fontSize: '12', color: '#B5B5B5' }}>(ps:部分应用依赖较多，执行时间可能会比较长)</span></span>
    </div>
}
export default class ProjectConfig extends Component {

    constructor(props) {
        super(props);
        const workspace = getParams('workspace') || '';
        this.state = {
            fullActionArr: [],
            basicConfig: {},
            accessInfo: {},
            services: [],
            originFileContent: '',
            executeDialogVisible: false,
            globalDataMap: {},
            executeTitle: '',
            executeInfo: '',
            executeEnd: false,
            workspace
        };
        this.commentMap = { comment: {}, commentBefore: {}, range: [] };
        this.fullActionData = {};
        this.throttleFieldChange = throttle(100);
        this.field = new Field(this, {
            onChange: () => {
                this.throttleFieldChange(this.setOriginFileContent);
            }
        });

    }
    componentDidMount = async () => {

        await this.getData();
        this.domRight = document.getElementById('right-content');
        this.domLeft = document.getElementById('left-content');
        this.resizeHandler = () => {
            this.forceUpdate();
        }
        window.addEventListener('resize', this.resizeHandler);

    }

    componentWillUnmount = () => {
        this.updateOriginConfig = false;
        this.linkers && removeOpenLinks(this.linkers);
        window.removeEventListener('resize', this.resizeHandler);
    }

    checkPairInclouds = (items, key) => {
        const itemsKeys = items.map((item) => item.key.value);
        const itemIndex = itemsKeys.indexOf(key);
        return itemIndex;
    }

    iteratorNodeToGetComment = (item, preKey) => {
        this.commentMap['comment'][preKey] = _.get(item, 'value.comment');
        this.commentMap['commentBefore'][preKey] = _.get(item, 'value.commentBefore');
        this.commentMap['range'][preKey] = _.get(item, 'value.range');
        if (item.type === 'PAIR') {
            if (item.value && item.value.type === 'MAP') {
                preKey += '.';
                item.value.items.forEach((_item) => {
                    this.iteratorNodeToGetComment(_item, preKey + _item.key.value);
                });
            }
            if (item.value && item.value.type === 'SEQ') {
                item.value.items.forEach((_item, i) => {
                    this.iteratorNodeToGetComment(_item, preKey + `[${i}]`);
                });
            }
        }
        if (item.type === 'MAP') {
            preKey += '.';
            item.items.forEach((_item) => {
                this.iteratorNodeToGetComment(_item, preKey + _item.key.value);
            });
        }
    }

    iteratorNodeToSetComment = (item, preKey) => {
        const comment = this.commentMap['comment'][preKey];
        const commentBefore = this.commentMap['commentBefore'][preKey];
        const range = this.commentMap['range'][preKey];
        if (comment) item.value.comment = comment;
        if (commentBefore) item.value.commentBefore = commentBefore;
        if (commentBefore) {
            if (range) {
                item.value.range = range;
            }
        }


        if (item.type === 'PAIR') {
            if (item.value && item.value.type === 'MAP') {
                preKey += '.';
                item.value.items.forEach((_item) => {
                    this.iteratorNodeToSetComment(_item, preKey + _item.key.value);
                });
            }
            if (item.value && item.value.type === 'SEQ') {
                item.value.items.forEach((_item, i) => {
                    this.iteratorNodeToSetComment(_item, preKey + `[${i}]`);
                });
            }
        }
        if (item.type === 'MAP') {
            preKey += '.';
            item.items.forEach((_item) => {
                this.iteratorNodeToGetComment(_item, preKey + _item.key.value);
            });
        }
    }

    saveAndGetData = async (configText) => {
        const workspace = getParams('workspace') || '';
        this.field.remove();
        const result = await request('configCenter/saveAndGetConfig', { workspace, configText });
        if (result.code === 200) {
            const basicConfig = _.get(result, 'data.basicConfig', {});
            const services = _.get(result, 'data.services', []);
            const originFileContent = _.get(result, 'data.originFileContent', {});
            const accessInfo = _.get(result, 'data.accessInfo', {});
            this.setState({
                basicConfig,
                services,
                accessInfo,
                originFileContent,
                workspace
            });
        }
    }

    getData = async () => {
        const workspace = getParams('workspace') || '';
        if (workspace) {
            this.field.remove();
            const result = await request('configCenter/getConfig', { workspace });
            if (result.code === 200) {
                const basicConfig = _.get(result, 'data.basicConfig', {});
                const services = _.get(result, 'data.services', []);
                const originFileContent = _.get(result, 'data.originFileContent', {});
                const accessInfo = _.get(result, 'data.accessInfo', {});
                this.setState({
                    basicConfig,
                    services,
                    accessInfo,
                    originFileContent,
                    workspace
                });
            }

        }
    }


    refreshAccessData = async () => {
        const result = await request('accessCenter/getAccess');
        const accessInfo = result.data;
        this.setState({
            accessInfo
        })

    }

    setOriginFileContent = () => {
        const { originFileContent } = this.state;
        if (originFileContent) {
            let valueTemplate = { edition: '', name: '', access: '', vars: {}, services: {} }
            const values = this.field.getValues();
            valueTemplate = Object.assign({}, valueTemplate, values);
            if (valueTemplate.vars && Object.keys(valueTemplate.vars).length === 0) {
                delete valueTemplate.vars;
            }

            const globalDataMap = generateMagicVariables(valueTemplate);
            try {
                let oldDocument = parseDocument(originFileContent); // 获取原文件备注信息
                const oldDocumentComment = oldDocument.comment;
                const oldDocumentCommentBefroe = oldDocument.commentBefore;
                oldDocument.contents.items.forEach((item, i) => {
                    this.iteratorNodeToGetComment(item, item.key.value);
                });
                const newDocument = parseDocument(stringify(valueTemplate));
                newDocument.comment = oldDocumentComment;
                newDocument.commentBefore = oldDocumentCommentBefroe;
                newDocument.contents.items.forEach((item) => { // 遍历源文件并赋值
                    const key = item.key.value;
                    this.iteratorNodeToSetComment(item, key);
                });
                console.log(String(newDocument));
                this.setState({
                    globalDataMap,
                    originFileContent: String(newDocument)
                });
            } catch (e) {
                console.log(e);
            }

        }

    }

    executeCommand = async (method, customerCommand, actionParams) => {
        const { workspace, originFileContent } = this.state;
        await request('configCenter/executeCommand', { workspace, method, customerCommand, actionParams, configText: originFileContent }, this.renderExecuteInfo);
    }

    openExecuteDialog = () => {
        this.setState({
            executeDialogVisible: true,
            executeTitle: '开始执行',
            executeInfo: '',
            executeEnd: false
        })
    }

    setExecuteInfoContent = (executeInfo) => {
        this.setState({
            executeInfo,
            executeTitle: <SLoading />
        })
    }

    endExecute = () => {
        this.setState({
            executeEnd: true,
            executeTitle: '执行结束'
        }, () => {
            setTimeout(() => {
                this.linkers = addOpenLinks();
            }, 1000);
        })
    }

    closeExecuteDialog = () => {
        this.linkers && removeOpenLinks(this.linkers);
        this.setState({
            executeDialogVisible: false,
        })
    }


    renderExecuteInfo = (data) => {
        switch (data.status) {
            case -1:
                break;
            case 1:
                this.openExecuteDialog();
                break;
            case 2:
                this.setExecuteInfoContent(data.result);
                break;
            case 3:
                this.endExecute();
                break;
            case 4:
            default:
                break;
        }
    }

    chooseNewWrokspace = async () => {

        const dialog = Dialog.confirm({
            title: '确定更换工作空间吗？',
            content: '更换工作空间后配置项会随之改变，请确保之前的内容已经保存',
            footerActions: ['cancel', 'ok'],
            onOk: async () => {
                await this.getWorksapce(dialog);
            },
            onCancel: () => { },
        });


    }

    getWorksapce = async (dialog) => {
        const result = await request('configCenter/chooseNewWorkspace');
        const workspace = result.workspace;
        if (workspace) {
            setParams('workspace', workspace);
            await this.getData();
            dialog && dialog.hide();
        } else {
            Dialog.confirm({
                title: '错误',
                content: '请选择有s.yaml存在的目录',
                messageProps: {
                    type: 'error',
                },
                footerActions: ['ok'],
                onOk: () => { },
                onCancel: () => { }
            });
        }
    }

    saveConfig = async () => {
        const { workspace, originFileContent } = this.state;
        const result = await request('configCenter/saveConfig', { workspace, configText: originFileContent });
        if (result.code === 200) {
            Notification.open({
                title: '保存成功',
                content: '',
                type: 'success',
            });
        }
    }

    openWithVscode = async () => {
        const { workspace } = this.state;
        await request('commonAction/openWithVscode', { workspace });
    }

    choosedNav = (keys) => {
        const [navKey] = keys;
        const element = document.getElementById(navKey);
        if (element && element.offsetTop) {
            const containerElement = document.getElementById(CONFIG_CONTAINER_ID);
            let top = navKey === BASIC_CONFIG_ID ? element.offsetTop : element.offsetTop + 300;
            containerElement.scrollTo({
                top,
                behavior: "smooth"
            });
        }
    }

    setFullAction = (data) => {
        const { services } = this.state;
        const fullActionData = Object.assign({}, this.fullActionData, data);
        this.fullActionData = fullActionData;
        if (Object.keys(fullActionData).length === services.length) {
            let arr = []
            Object.keys(fullActionData).forEach((key) => {
                arr.push(fullActionData[key]);
            })
            const fullActionArr = _.intersection(...arr);
            this.setState({
                fullActionArr
            })
        }

    }

    actionCommand = (key) => {
        this.executeCommand(key)
    }

    onResize = (width) => {
        this.domRight.style.width = `${width}px`;
        this.domLeft.style.width = `${window.innerWidth - 60 - width}px`;
        this.forceUpdate();
    }
    render() {
        const { hideTitle } = this.props;
        const { basicConfig, services, originFileContent, globalDataMap, accessInfo, executeDialogVisible, executeInfo, executeTitle, executeEnd, workspace, fullActionArr } = this.state;
        const contentHeight = window.innerHeight - 220;
        const contentWidth = window.innerWidth - 60;
        const confusedAccessInfo = _.get(accessInfo, 'confusedAccessInfo', {}); //获取加密的秘钥信息
        const hasAccess = Object.keys(confusedAccessInfo).length > 0;
        const editorWidth = this.domRight ? this.domRight.offsetWidth : '100%';
        return <Provider value={{ globalDataMap }}>
            <div className="project-config-container">
                <If condition={!hideTitle}>
                    <div className="project-config-topcontainer">
                        <div className="project-config-title">
                            <span className="title-breadcrumb">
                                <Breadcrumb separator="/">
                                    <Breadcrumb.Item onClick={() => { this.props.history.push({ pathname: '/hubs' }) }}>Serverless Hub</Breadcrumb.Item>
                                    <Breadcrumb.Item >应用配置</Breadcrumb.Item>
                                </Breadcrumb>
                            </span>
                            <If condition={workspace}>
                                <sapn style={{ fontSize: '14px' }} className="workspace-content" onClick={this.chooseNewWrokspace}>当前工作空间：{workspace}</sapn>
                                <img
                                    className="open-workspace-icon"
                                    src={vscodeIcon}
                                    onClick={this.openWithVscode}
                                />
                            </If>
                        </div>
                    </div>
                </If>
                <div className="project-config-content" >
                    <If condition={workspace}>
                        <div className="left-content" id="left-content" >
                            <div className="nav-tips">
                                <Nav embeddable aria-label="local navigation" openMode='multiple' defaultOpenAll onSelect={this.choosedNav}>
                                    <Item key={BASIC_CONFIG_ID}>基本配置</Item>
                                    <SubNav label="服务配置" >
                                        {services.map((service) => <Item key={`${service.name}`}>{service.name}</Item>)}
                                    </SubNav>
                                </Nav>
                            </div>
                            <div className="config-container" id={CONFIG_CONTAINER_ID} style={{ height: contentHeight, overflow: 'auto' }} >
                                <BasicConfig data={basicConfig} accessInfo={accessInfo} field={this.field} refreshAccessData={this.refreshAccessData} />
                                <ServiceConfig data={services} accessInfo={accessInfo} field={this.field} executeCommand={this.executeCommand} setFullAction={this.setFullAction} />
                            </div>
                        </div>
                    </If>
                    <If condition={!workspace}>
                        <div className="left-content" style={{ height: contentHeight }}>
                            <div style={{ display: 'block', marginTop: -100, top: '50%', height: 200, position: 'absolute', left: 0, right: 0 }} >
                                <div style={{ textAlign: 'center', marginBottom: 8 }}> <Button type="primary" onClick={() => this.getWorksapce()}><Icon type="edit" />打开工作空间</Button></div>
                                <div style={{ textAlign: 'center' }}>您可以选择包含s.yaml/s.yml的目录进行配置</div>
                            </div>
                        </div>
                    </If>
                    <If condition={workspace}>
                        <div className="right-content" id="right-content" height={contentHeight}>
                            <div className="save-options-tips">
                                温馨提示： command/ctrl+s 可以对配置文件进行保存
                            </div>
                            <DragToChangeValue
                                className="dragbar"
                                style={draggableStyle}
                                min={contentWidth * 0.3}
                                max={contentWidth * 0.6}
                                value={contentWidth * 0.4}
                                axis={DragToChangeValue.AXIS.X}
                                onChange={this.onResize}
                                reverse={false}
                            />
                            <Editor
                                ref={(ref) => this.editor = ref}
                                height={contentHeight}
                                width={editorWidth}
                                code={originFileContent}
                                setConfigValue={(values) => {
                                    this.saveAndGetData(values);
                                }}
                            />
                        </div>
                    </If>
                </div>
                <ExecuteDialog visible={executeDialogVisible} data={{ executeInfo, executeTitle, executeEnd }}
                    closeExecuteDialog={this.closeExecuteDialog} />
                <If condition={workspace}>
                    <div className="config-footer">
                        <If condition={hasAccess}>
                            <SplitButton type="primary" label="全量操作" disabled={fullActionArr.length === 0} size='large' onItemClick={this.actionCommand}>{
                                fullActionArr.map(item => <SplitButton.Item key={item}>{item}</SplitButton.Item>)
                            }</SplitButton>
                        </If>
                        <If condition={!hasAccess}>
                            <SplitButton type="primary" label="全量操作" disabled size='large' />
                            <span className="info-tips">
                                <Icon type="prompt" />
                    您还没配置秘钥信息，请在基本配置中添加
                    </span>
                        </If>
                        <Button ghost="light" className="save-config" onClick={this.saveConfig} disabled={!workspace}><Icon type="set" /> 保存配置</Button>
                    </div>
                </If>
            </div>
        </Provider>
    }
}