import React from "react";
import { Button, Icon } from "@b-design/ui";

import Translation from "../../../../components/Translation";
import PropertyForm from './property-form';
import { getParams } from '../../../../utils/common';
import "../index.scss";


class PropertyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyList: [{ id: Date.now() }]
    };
  }

  // async componentDidMount() {
  //   const { getPublishConfig } = window;
  //   const path = getParams('path');
  //   const configValue = await getPublishConfig({ data: { path } });
  //   const properties = configValue.Properties;
  //   let propertyList = [];
  //   try {
  //     propertyList = Object.keys(properties).map((key) => (Object.assign({}, properties[key], { id: key, name: key })));
  //   } catch (e) {
  //   }
  //   this.setState({
  //     propertyList
  //   });
  // }

  componentWillReceiveProps = (nextProps) => {
    const { configValue, id } = nextProps;
    if (configValue && Object.keys(configValue).length > 0) {
      let propertyList = [];
      try {
        propertyList = Object.keys(configValue).map((key, i) => (Object.assign({}, configValue[key], { id: `${id}${i}`, Name: key })));
      } catch (e) {
      }
      this.setState({
        propertyList
      });
    }
  }

  addProperty = () => {
    const { propertyList } = this.state;
    const { id } = this.props;
    propertyList.push({ id: `${id}${Date.now()}` });
    this.setState({
      propertyList
    });
  }

  removeProperty = (id) => {
    const { propertyList } = this.state;
    const { setConfigValue } = this.props;
    propertyList.forEach((data, i) => {
      if (data.id === id) {
        propertyList.splice(i, 1);
      }
    });
    this.setState({
      propertyList
    }, setConfigValue);
  }


  getValues = () => {
    const { propertyList } = this.state;
    let propertyValue = {};
    propertyList.forEach((data) => {
      if (this[`propertyList${data.id}`]) {
        const values = this[`propertyList${data.id}`].getValues();
        propertyValue = Object.assign({}, propertyValue, values);
      }
    });
    return propertyValue;
  }

  render() {
    const { propertyList } = this.state;
    return (
      <span>
        {propertyList.map((data) => <div className="form-pannel" style={{ padding: '20px 20px 10px 30px', marginBottom: 30, border: '1px dotted #000', position: 'relative'}} key={data.id}>
          <If condition={propertyList.length > 1}><span className="remove-icon" style={{ right: 8, top: 8 }}><Icon type="ashbin" onClick={() => this.removeProperty(data.id)} /></span></If>
          <PropertyForm ref={(ref) => this[`propertyList${data.id}`] = ref} setConfigValue={this.props.setConfigValue} configValue={data} key={`propform-${data.id}`} id={data.id} />
        </div>)}
        <If condition={propertyList.length > 0}>
          <div style={{ textAlign: 'center' }}>
            <Button type="primary"  onClick={this.addProperty}>+ <Translation>添加配置项</Translation></Button>
          </div>
        </If>
      </span>
    );
  }
}

export default PropertyList;
