import React from "react";
import { Form, Select, Icon, Field, Input, Button } from "@b-design/ui";

import { PUBLISH_FOTM_ITEM_LAYOUT } from '../../../../constants';
import ListForm from './list-form';
import EnumForm from './enum-form';
import PropertyList from './property-list';
import Translation from "../../../../components/Translation";
import "../index.scss";

const FormItem = Form.Item;

const PARAMS_TYPE_LIST = [
  {
    value: 'String',
    label: 'String'
  }, {
    value: 'Number',
    label: 'Number'
  }, {
    value: 'Boolean',
    label: 'Boolean'
  }, {
    value: 'List',
    label: 'List'
  }, {
    value: 'Struct',
    label: 'Struct'
  }, {
    value: 'Enum',
    label: 'Enum'
  }
];

const hiddenStyle = {
  border: '1px dotted #ccc',
  overflow: 'hidden',
  height: 0,
  padding: 0,
  margin: 0
}

const showStyle = {
  visibility: 'visible',
}
class ParamsType extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      closeStruct: false
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

  componentDidMount() {

  }

  toggleShowStruct = () => {
    const { closeStruct } = this.state;
    this.setState({
      closeStruct: !closeStruct
    })
  }

  getValues = () => {
    const paramsType = this.field.getValue('paramsType') || '';
    const paramseTypeDesc = this.field.getValue('paramsTypeDesc') || '';
    let desc = '';
    if (paramseTypeDesc) {
      desc = `[${paramseTypeDesc}]`
    }
    let typeObj = {};
    if (paramsType === 'List' && this.listForm) {
      const listFormValues = this.listForm.getValues();
      if (typeof listFormValues === 'string') {
        return listFormValues + desc;
      }
      let firstKey = Object.keys(listFormValues)[0] || '';
      typeObj[`${firstKey}${desc}`] = listFormValues[`${firstKey}`];
      return typeObj;
    }
    if (paramsType === 'Struct' && this.structForm) {
      typeObj[`Struct${desc}`] = this.structForm.getValues();
      return typeObj;
    }
    if (paramsType === 'Enum' && this.enumForm) {
      typeObj[`Enum${desc}`] = this.enumForm.getValues();
      return typeObj
    }

    return `${paramsType}${desc}`;
  }

  render() {
    const { data, removeParamsType, setConfigValue, needRemove } = this.props;
    const paramsType = data.type || this.field.getValue('paramsType');
    const init = this.field.init;
    const { closeStruct } = this.state;
    return (
      <div style={{ position: 'relative', borderBottom: '1px solid #eee', marginBottom: 10 }} className="params-type-container">
        {/* <span className="remove-icon"><Icon type="ashbin" style={{}} /></span> */}
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>参数类型</Translation>}
          labelTextAlign="left"
          required
        >
          <Select style={{ width: '100%' }} dataSource={PARAMS_TYPE_LIST}  {...init('paramsType', { rules: [{ required: true }], initValue: data.type })} />
        </FormItem>

        <If condition={paramsType === 'List'}>
          <ListForm id={`list-${data.id}`} ref={(ref) => this.listForm = ref} setConfigValue={setConfigValue} configValue={data.value} generic={data.generic} id={data.id} />
        </If>
        <If condition={paramsType === 'Struct'}>
          <div className="struct-container-panel">
            <div className="toggle-open" onClick={this.toggleShowStruct}>{!closeStruct ? <a>收起</a> : <a>打开</a>}</div>
            <div className="struct-container" style={closeStruct ? hiddenStyle : showStyle} ><PropertyList ref={(ref) => this.structForm = ref} setConfigValue={setConfigValue} configValue={data.value} id={data.id} /></div>
          </div>
        </If>
        <If condition={paramsType === 'Enum'}>
          <div className="enum-container" ><EnumForm ref={(ref) => this.enumForm = ref} setConfigValue={setConfigValue} configValue={data.value} configValue={data.value} id={data.id} /></div>
        </If>
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>参数类型描述</Translation>}
          labelTextAlign="left"
        >
          <Input  {...init('paramsTypeDesc', { initValue: data.desc })} />
        </FormItem>
        <If condition={needRemove}>
          <div style={{ textAlign: 'right' }}>
            <Button text onClick={() => removeParamsType(data.id)}  >-  <Translation>Remove Param Type</Translation></Button>
          </div>
        </If>
      </div>
    );
  }
}

export default ParamsType;
