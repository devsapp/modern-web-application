import React, { Component } from "react";
import _ from "loadsh";
import { Link } from "react-router-dom";
import { Icon, Input, Dialog, Notification, Field, Tab } from "@b-design/ui";
import AppCard from "./components/app-card";
import CollectedAppCard from '../../ServerlessHub/components/app-card';
import ActionDialog from './components/action-dialog';
import request from '../../../utils/request';
import InitTemplate from '../../../components/init-template';
import ExecuteDialog from '../../ProjectConfig/components/execute-dialog';
import "../index.scss";

function SLoading() {
  return <div className="execute-loading-container">
    <div className="execute-loading" />
    <span className="loading-word">执行中</span>
  </div>
}
const DEFAULT_SERVICE = 'All';
export default class UserApps extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isCollect: false,
      appList: [],
      workspace: '',
      services: [],
      serviceCommandMap: {},
      commands: [],
      currentAppData: {},
      actionVisible: false,
      executeDialogVisible: false,
      executeInfo: '',
      executeTitle: '',
      executeEnd: ''
    }
    this.tempCachedAppList = [];
    this.field = new Field(this, {
      onChange: (name, value) => {
        if (name === 'service' && value !== DEFAULT_SERVICE) {
          const component = this.state.serviceCommandMap[value];
          this.getComponentCommands(component)
        }
      }
    });
  }

  componentDidMount = async () => {
    await this.getApps();
  }

  getApps = async () => {
    const result = await request('userAppCenter/getUserApp', { role: 'user' });
    if (result.code === 200) {
      const appList = result.data;
      this.setState({
        appList,
        isCollect: false
      })
      this.tempCachedAppList = appList;
    }


  }

  goToConfig = (workspace) => {
    const path = {
      pathname: "/project-config",
      search: `workspace=${workspace}`,
    };
    this.props.history.push(path);
  }

  goToAppDetail = (workspace, appName) => {
    const path = {
      pathname: "/userapp",
      search: `workspace=${workspace}&appName=${appName}`,
    };
    this.props.history.push(path);
  }

  openWithVscode = async (workspace) => {
    await request('commonAction/openWithVscode', { workspace });
  }

  removeUserApp = async (localPath) => {
    const dialog = Dialog.confirm({
      title: '确定删除该应用吗？',
      content: <span>当前路径<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{localPath}</span>下所有的数据都会被删除,删除后<span style={{ color: 'red' }}>不可恢复</span></span>,
      footerActions: ['cancel', 'ok'],
      onOk: async () => {
        const result = await request('userAppCenter/remvoeUserApp', { localPath });
        if (result.code === 200) {
          dialog.hide();
          Notification.open({
            title: '删除成功',
            content: '',
            type: 'success',
          });
          this.getApps();
        }
      },
      onCancel: () => { },
    });

  }

  filterApps = (values) => {
    this.filterTimmer && clearTimeout(this.filterTimmer);
    this.filterTimmer = setTimeout(() => {

      const tmpApp = _.cloneDeepWith(this.tempCachedAppList);
      const appList = tmpApp.filter((item) => {
        if (item.name.indexOf(values) !== -1) {
          return true
        } else {
          return false;
        }
      })
      this.setState({
        appList
      })
    }, 500)
  }

  openAction = async (data) => {
    const workspace = data.localPath
    const result = await request('configCenter/getServiceAndComponent', { workspace });
    let services = [];
    let serviceCommandMap = {};
    if (result.code === 200) {
      services = result.data.services;
      serviceCommandMap = result.data.serviceCommandMap;
    }
    this.field.setValue('service', DEFAULT_SERVICE);
    this.setState({
      services,
      serviceCommandMap,
      currentAppData: data,
      actionVisible: true,
      workspace: data.localPath
    })
  }

  getComponentCommands = async (component) => {
    const result = await request('configCenter/getComponentCommands', { component });
    if (result.code === 200) {
      const data = result.data;
      let commands = [];
      try {
        if (data !== '{}') {
          commands = Object.keys(data).map(key => ({ label: data[key] || key, value: key }));
        }
      } catch (e) {
      }
      this.setState({
        commands
      });
    }
  }

  closeAction = () => {
    this.setState({
      actionVisible: false
    })
    this.field.reset();
  }

  executeCommand = () => {
    this.field.validate(async (errors, values) => {
      if (errors) {
        return;
      }
      const { service, method, params } = values;
      const { workspace } = this.state;
      let customerCommand = service === DEFAULT_SERVICE ? '' : service;
      await request('configCenter/executeCommand', { workspace, method, customerCommand, actionParams: params }, this.renderExecuteInfo);
    })

  }

  openExecuteDialog = () => {
    this.setState({
      executeDialogVisible: true,
      executeInfo: '',
      executeEnd: false
    })
  }

  setExecuteInfoContent = (executeInfo) => {
    this.setState({
      executeInfo,
      executeTitle: <SLoading />,
    })
  }

  endExecute = () => {
    this.setState({
      executeTitle: '执行结束',
      executeEnd: true
    })
  }

  closeExecuteDialog = () => {
    this.setState({
      executeDialogVisible: false,
    });

  }

  getCollectApps = async () => {
    const result = await request('userAppCenter/getCollectApp');
    if (result.code === 200) {
      const appList = result.data
      this.setState({
        appList,
        isCollect: true
      })
    }
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


  initAppTemplate = async (data) => {
    this.initTemplateInstance && this.initTemplateInstance.initAppTemplate(data);
  }

  render() {
    const { appList, isCollect, currentAppData, actionVisible, executeDialogVisible, executeInfo, executeTitle, executeEnd, services, commands } = this.state;
    return (
      <React.Fragment>
        <div className="user-view">
          <div className="app-header">
            <div className="header-search">
              <React.Fragment>
                <div className="app-text" style={{ width: 120 }}>应用管理</div>
                <Tab size="small">
                  <Tab.Item key={'create'} title={'我的创建'} onClick={this.getApps}></Tab.Item>
                  <Tab.Item key={'collect'} title={'我的收藏'} onClick={this.getCollectApps}></Tab.Item>
                </Tab>
              </React.Fragment>
              <Input
                size="large"
                hasClear
                type="noborder"
                placeholder="快速查找"
                onChange={this.filterApps}
                innerBefore={<Icon type="search" size="xs" style={{ margin: 4 }} />}
              />
            </div>
            <div className="header-filter">
              {/* <div className="filter">
              {_.map(appStatus, ({ color }) => (
                <span style={{ background: color }} className="status"></span>
              ))}
            </div> */}
              {/* <Button size="large" component="span">
              <Icon type="cloudupload" />
              <span>云同步</span>
            </Button> */}
            </div>
          </div>
          <div className="app-card-content" style={{ height: window.innerHeight - 150, overflowY: 'auto' }} >
            <If condition={appList.length > 0 && !isCollect}>
              {_.map(appList, (app, i) => (
                <AppCard
                  key={`app${i}`}
                  data={app}
                  openAction={this.openAction}
                  goToConfig={this.goToConfig}
                  openWithVscode={this.openWithVscode}
                  goToAppDetail={this.goToAppDetail}
                  removeUserApp={this.removeUserApp} />
              ))}
            </If>
            <If condition={appList.length > 0 && isCollect}>
              {_.map(appList, (app, i) => (
                <CollectedAppCard
                  key={`app${i}`}
                  data={app}
                  isCollect
                  initAppTemplate={this.initAppTemplate}
                />
              ))}
            </If>
            <If condition={appList.length === 0 && !isCollect}>
              <div className="empty-view">您还没有创建应用， <Link to="/hubs">前往创建</Link></div>
            </If>
          </div>
        </div>
        <InitTemplate ref={(ref) => this.initTemplateInstance = ref} history={this.props.history} />
        <ActionDialog visible={actionVisible}
          data={currentAppData}
          field={this.field}
          services={services}
          commands={commands}
          closeAction={this.closeAction}
          executeCommand={this.executeCommand} />
        <ExecuteDialog visible={executeDialogVisible} data={{ executeInfo, executeTitle, executeEnd }}
          closeExecuteDialog={this.closeExecuteDialog} />
      </React.Fragment>
    );
  }
}
