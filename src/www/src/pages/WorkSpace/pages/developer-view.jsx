import React, { Component } from "react";
import _ from "loadsh";
import { Radio, Button, Icon, Dialog, Notification } from '@b-design/ui';
import PublishCard from "./components/publish-card";
import InitTemplate from '../../../components/init-template';
import request from '../../../utils/request';
import "../index.scss";


const RadioGroup = Radio.Group;

const list = [
  {
    value: 'component',
    label: '组件'
  }, {
    value: 'application',
    label: '应用'
  }
];
export default class DeveloperView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appList: [],
      type: 'component'
    }
    this.tempCachedAppList = [];
  }

  componentDidMount = async () => {
    await this.getApps();
  }

  getApps = async () => {
    const result = await request('userAppCenter/getUserApp', { role: 'developer' });

    if (result.code === 200) {
      const { type } = this.state;
      let appList = result.data;
      appList = appList.filter(item => item.type == type);
      this.tempCachedAppList = appList;
      this.setState({
        appList
      })

    }


  }


  goToConfig = (workspace) => {
    const path = {
      pathname: "/publish-center",
      search: `workspace=${workspace}`,
    };
    this.props.history.push(path);
  }

  changeType = (type) => {
    let newApp = _.cloneDeepWith(this.tempCachedAppList);
    newApp = newApp.filter(item => item.type == type);
    this.setState({
      type,
      appList: newApp
    });
  }

  initAppTemplate = async (type) => {
    let data = { name: `devsapp/start-${type}`, desc: '', role: 'developer', type };
    this.initTemplateInstance && this.initTemplateInstance.initAppTemplate(data);
  }

  removeUserApp = async (localPath) => {
    const dialog = Dialog.confirm({
      title: '确定删除该应用吗？',
      content: '删除后不可恢复',
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


  openWithVscode = async (workspace) => {
    await request('commonAction/openWithVscode', { workspace });
  }

  render() {
    const { type, appList } = this.state;
    const creatBtnName = type === 'component' ? '组件' : '应用';
    return <React.Fragment>
      <div className="developer-view">
        <div className="app-header">
          <div className="header-search">
            <div className="app-title-container">
              <div className="app-text">我的开发 <RadioGroup dataSource={list} value={type} onChange={this.changeType} className="type-list" /></div>
              <If condition={appList.length}>
                <Button className="developer-create-btn" type="primary" onClick={() => this.initAppTemplate(type)}><Icon type="edit" />新建{creatBtnName}</Button>
              </If>
            </div>
            {/* <Input
            size="large"
            hasClear
            type="noborder"
            placeholder="快速查找"
            onChange={this.filterApps}
            innerBefore={<Icon type="search" size="xs" style={{ margin: 4 }} />}
          /> */}
          </div>
          <div className="header-filter">

          </div>
        </div>
        <div className="app-card-content">
          <If condition={appList.length === 0}>
            <div style={{ display: 'block', marginTop: -100, top: '50%', height: 200, position: 'absolute', left: 0, right: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: 8 }}>  <Button type="primary" onClick={() => this.initAppTemplate(type)}><Icon type="edit" />新建{creatBtnName}</Button></div>
              <div style={{ textAlign: 'center' }}>您可以选择开发组件或者应用</div>
            </div>
          </If>
          <If condition={appList.length > 0}>
            {_.map(appList, (app) => (
              <PublishCard data={app}
                goToConfig={this.goToConfig}
                openWithVscode={this.openWithVscode}
                removeUserApp={this.removeUserApp} />
            ))}
          </If>
        </div>
        <InitTemplate ref={(ref) => this.initTemplateInstance = ref}
          redirect={'publish-center'}
          history={this.props.history}
          callback={() => this.getApps()} />
      </div>
    </React.Fragment>
  }
}
