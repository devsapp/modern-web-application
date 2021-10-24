import React from "react";
import { Form, Input, Field, Button, Radio } from "@b-design/ui";

import { PUBLISH_FOTM_ITEM_LAYOUT } from '../../../../constants';
import ParamsType from './params-type';
import Translation from "../../../../components/Translation";
import _ from 'loadsh';
import "../index.scss";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const COMMON_DESC_TYPE_REG = new RegExp(/\[(.*)\]/, "i");
const GENERIC_LIST_REG = new RegExp(/List<(.*)>/, "i");

class PropertyForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      configData: {},
      paramsList: []
    };

    this.field = new Field(this, {
      onChange: (name, value) => {
        this.timmer && clearTimeout(this.timmer);
        this.timmer = setTimeout(() => {
          this.props.setConfigValue();
        }, 500);
      },
    });

  }

  componentWillReceiveProps(nextProps) {
    this.transformParamsList(nextProps);
  }

  componentDidMount = () => {

    this.transformParamsList(this.props);
  }

  transformParamsList = (originData) => {
    const { configValue, id } = originData;
    let paramsList = [];
    if (configValue) {
      paramsList = configValue.Type || [];
      try {
        paramsList = paramsList.map((item, i) => {
          let generic = ''; // List<>
          let type = '';
          let desc = '';
          if (Object.prototype.toString.call(item) === '[object Object]') {
            const keyType = Object.keys(item)[0]; // Struct[anything] || List<String>[anything]
            type = keyType;
            if (keyType.match(COMMON_DESC_TYPE_REG)) {
              desc = _.get(keyType.match(COMMON_DESC_TYPE_REG), '[1]', '');
              let matchType = _.get(keyType.match(COMMON_DESC_TYPE_REG), '[0]', '');
              type = type.replace(matchType, '');
            }

            if (type.match(GENERIC_LIST_REG)) {
              type = 'List';
              generic = _.get(keyType.match(GENERIC_LIST_REG), '[1]', '');
            }

            return {
              type,
              desc,
              value: item[keyType],
              id: `params${id}${i}`,
              generic
            }
          }

          if (Object.prototype.toString.call(item) === '[object String]') {
            type = item;
            if (item.match(COMMON_DESC_TYPE_REG)) {
              desc = _.get(type.match(COMMON_DESC_TYPE_REG), '[1]', '');
              let matchType = _.get(type.match(COMMON_DESC_TYPE_REG), '[0]', '');
              type = type.replace(matchType, '');
            }
            if (type.match(GENERIC_LIST_REG)) {
              type = 'List';
              generic = _.get(item.match(GENERIC_LIST_REG), '[1]', '');
            }
            return {
              type,
              desc,
              id: `params${id}${i}`,
              generic
            }
          }
        })
      } catch (e) {
        console.log(e, 'sss')
      }
    }
    if (paramsList.length === 0) {
      paramsList = [{ id: Date.now(), type: 'String', desc: '' }];
    }
    this.setState({
      paramsList
    });
  }
  getValues = () => {
    const result = {};
    const basicFormValues = this.field.getValues();

    let propertiesValues = [];
    const { paramsList } = this.state;
    paramsList.forEach((data) => {
      const currentRef = this[`paramsList${data.id}`];
      if (currentRef) {
        const values = currentRef.getValues();
        if (values) {
          propertiesValues.push(values);
        }
      }
    });
    if (basicFormValues.Name) {
      result[basicFormValues.Name] = {};
      result[basicFormValues.Name].Description = basicFormValues.Description || '';
      result[basicFormValues.Name].Required = basicFormValues.Required;
      result[basicFormValues.Name].Example = basicFormValues.Example || '';
      result[basicFormValues.Name].Default = basicFormValues.Default || '';
      result[basicFormValues.Name].Type = propertiesValues || '';
    }

    return result;
  }

  addParamsType = () => {
    const id = Date.now();
    const { paramsList } = this.state;
    paramsList.push({ id, value: null });
    this.setState({
      paramsList
    })
  }

  removeParamsType = (id) => {
    const { paramsList } = this.state;
    paramsList.forEach((data, i) => {
      if (data.id === id) {
        paramsList.splice(i, 1);
      }
    });
    this.setState({
      paramsList
    }, () => {
      this.props.setConfigValue(); // 变更配置信息
    })
  }


  render() {
    const { paramsList } = this.state;
    const { setConfigValue, configValue } = this.props;
    const init = this.field.init;
    return (
      <div >
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>参数名</Translation>}
          labelTextAlign="left"
          required
        >
          <Input {...init('Name', { rules: [{ required: true }], initValue: configValue['Name'] })} />
        </FormItem>
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>是否必填</Translation>}
          labelTextAlign="left"
          hasFeedback
          required
        >
          <RadioGroup {...init('Required', { initValue: configValue['Required'] || true, rules: [{ required: true }] })} dataSource={[{ value: true, label: '必填' }, { value: false, label: '选填' }]} />
        </FormItem>
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>参数描述</Translation>}
          labelTextAlign="left"
          hasFeedback
        >
          <Input.TextArea style={{ width: '100%' }} {...init('Description', { rules: [{ required: true }], initValue: configValue['Description'] })} />
        </FormItem>
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>默认值</Translation>}
          labelTextAlign="left"
        >
          <Input {...init('Default', { initValue: configValue['Default'] })} />
        </FormItem>
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>例子</Translation>}
          labelTextAlign="left"
        >
          <Input {...init('Example', { initValue: configValue['Example'] })} />
        </FormItem>
        {paramsList.map((data, i) => <ParamsType key={`paramtype-${i}`} needRemove={paramsList.length > 1} setConfigValue={setConfigValue} id={data.id} removeParamsType={this.removeParamsType} ref={(ref) => this[`paramsList${data.id}`] = ref} data={data} />)}
        <div><Button text onClick={this.addParamsType} style={{ color: '#0000EF', marginTop: 5 }}>+ <Translation>添加参数类型</Translation></Button></div>
      </div>
    );
  }
}

export default PropertyForm;
