import React from "react";
import { Form, Field } from "@b-design/ui";
import _ from "loadsh";
import { GENERIC_ARR_REG, PUBLISH_FOTM_ITEM_LAYOUT } from '../../../../constants';
import BasicInfoConfig from './basic-info-config';
import DetailInfoConfig from './detail-info-config';
import "../index.scss";



class ProjectPannel extends React.Component {
  constructor(props) {
    super(props);
    this.propertyIndex = 0;
    this.state = {
      configData: {},
      defaultBasicInfoValue: {},
      description: props.defaultDescription,
      propertyList: [{ id: Date.now() }],
      categoryList: []
    };
    this.fieldData = {};
    this.field = new Field(this, {
      onChange: (name, value) => {
        this.timmer && clearTimeout(this.timmer);
        this.timmer = setTimeout(() => {
          this.setConfigValue();
        }, 500);
      },
    });
  }

  createFieldData = (keyarr, value) => {
    let currentData = this.fieldData;
    let lastKey = keyarr[keyarr.length - 1];
    for (let i = 0; i <= keyarr.length - 2; i++) {
      currentData = this.createDataStruct(currentData, keyarr[i]);
    }

    const matchResult = lastKey.match(GENERIC_ARR_REG);

    if (matchResult) {
      const formatKey = matchResult[1];
      const number = matchResult[2];
      if (
        !currentData[formatKey] ||
        Object.prototype.toString.call(currentData[formatKey]) !== '[object Array]'
      ) {
        currentData[formatKey] = [];
      }
      currentData[formatKey][parseInt(number, 10)] = value;
      this.field = Object.assign({}, this.field, currentData);
    } else {
      currentData[lastKey] = value;
    }
  };

  createDataStruct = (data, key) => {
    const matchResult = key.match(GENERIC_ARR_REG);
    if (matchResult) {
      key = matchResult[1];
      const number = matchResult[2];
      if (!data[key] || Object.prototype.toString.call(data[key]) !== '[object Array]') {
        data[key] = [];
      }
      if (!data[key][number] || Object.prototype.toString.call(data[key][number]) !== '[object Object]') {
        data[key][number] = {};
      }
      this.field = Object.assign({}, this.field, data);
      return data[key][number];
    } else {
      if (!data[key] || Object.prototype.toString.call(data[key]) !== '[object Object]') {
        data[key] = {};
      }
      this.field = Object.assign({}, this.field, data);
      return data[key];
    }
  };

  transformData = (values) => {
    Object.keys(values).forEach((key) => {
      if (values[key]) {
        const keyarr = key.split('.');
        const value = values[key];
        if (keyarr.length === 1) {
          this.fieldData[key] = value; // 一级结构
        } else {
          // 复合结构
          this.createFieldData(keyarr, value);
        }
      }
    });
    this.props.setConfigValue(this.fieldData);
  };

  setConfigValue = () => {
    const values = this.getValues();
    this.fieldData = {};
    this.transformData(values);
  };

  addProperty = () => {
    const { propertyList } = this.state;
    propertyList.push({ id: Date.now() });
    this.setState({
      propertyList
    });
  }

  removeProperty = (id) => {
    const { propertyList } = this.state;
    propertyList.forEach((data, i) => {
      if (data.id === id) {
        propertyList.splice(i, 1);
      }
    });
    this.setState({
      propertyList
    })
  }

  validate = () => {
    let isValid = true;
    this.field.validate();
    const errors = this.field.getErrors();
    Object.keys(errors).forEach(key => {
      if (errors[key]) {
        isValid = false;
      }
    });
    return isValid;
  }

  setDescription = (description) => {
    this.setState({
      description
    })
  }

  getValues = () => {
    const basicFormValue = this.field.getValues();
    let result = Object.assign({}, basicFormValue);
    if (basicFormValue.Type === 'Component') {
      const detailFromValue = this.detailInfo.getValues();
      result = Object.assign({}, result, detailFromValue);
    }

    return result;
  }

  render() {
    const { configValue = {}, workspace, chooseNewWrokspace } = this.props;
    return (
      <div className="publish-detail">
        <Form
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          style={{
            backgroundColor: '#FFFFFF',
          }}
          labelTextAlign="left"
          field={this.field}
        >
          <BasicInfoConfig configValue={configValue} field={this.field} workspace={workspace} chooseNewWrokspace={chooseNewWrokspace} />
          <DetailInfoConfig setConfigValue={this.setConfigValue} ref={(ref) => this.detailInfo = ref} configValue={configValue} />
        </Form>
      </div>
    );
  }
}

export default ProjectPannel;
