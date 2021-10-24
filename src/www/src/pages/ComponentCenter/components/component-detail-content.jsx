import React, { Component } from "react";
import _ from "loadsh";
import { Tab } from '@b-design/ui';
import ComponentInfo from './component-info';
import ComponentUse from './component-use';
export default class ComponentDetailContent extends Component {

  constructor(props) {
    super(props);
    this.state = {
    }
  }
  componentDidMount = async () => {

  }

  render() {
    const { componentInfo, localData, refreshInstalledData } = this.props;
    return <div className="component-detail-container">
      <Tab shape={'wrapped'} className="next-tabs-blue">
        <Tab.Item title={'组件介绍'}>
          <ComponentInfo componentInfo={componentInfo} localData={localData} refreshInstalledData={refreshInstalledData} />
        </Tab.Item>
        <If condition={localData.fullPath}>
          <Tab.Item title={'组件使用'}>
            <ComponentUse localData={localData} />
          </Tab.Item>
        </If>
      </Tab>
    </div>
  }
}