import React, { Component } from "react";
import _ from "loadsh";
import request from '../../utils/request';
import ComponetList from './components/component-list';
import ComponentDetailContent from './components/component-detail-content';
import ComponentWelcome from './components/component-welcome';
import InitTemplate from '../../components/init-template';
import "./index.scss";
export default class ComponentCenter extends Component {

  constructor(props) {
    super(props);
    this.state = {
      componentInfo: {},
      localData: {}
    }
  }
  componentDidMount = async () => {

  }

  getComponentInfo = async (data) => {
    const { name } = data;
    const result = await request('appCenter/getAppDetail', { name });
    if (result.code === 200) {
      const componentInfo = result.data;
      
      this.setState({
        componentInfo,
        localData: data
      });
    }
  }

  initAppTemplate = async (type = 'component') => {
    let data = { name: `devsapp/start-${type}`, desc: '', role: 'developer', type };
    this.initTemplateInstance && this.initTemplateInstance.initAppTemplate(data);
  }

  refreshInstalledData = (name) => {
    this.componentList.getData();
    this.getComponentInfo({ name })
  }

  render() {
    const { componentInfo, localData } = this.state;
    return <div className="component-container" style={{ height: window.innerHeight - 80 }} >
      <div className="component-list">
        <ComponetList getComponentInfo={this.getComponentInfo} ref={(ref) => this.componentList = ref} />
      </div>
      <div className="component-detail-content">
        <If condition={Object.keys(componentInfo).length > 0}>
          <ComponentDetailContent componentInfo={componentInfo} localData={localData} key={componentInfo.name} refreshInstalledData={this.refreshInstalledData} />
        </If>
        <If condition={Object.keys(componentInfo).length === 0}>
          <ComponentWelcome initAppTemplate={this.initAppTemplate} />
        </If>
        <InitTemplate ref={(ref) => this.initTemplateInstance = ref}
          redirect={'publish-center'}
          history={this.props.history}
        />
      </div>
    </div>
  }
}