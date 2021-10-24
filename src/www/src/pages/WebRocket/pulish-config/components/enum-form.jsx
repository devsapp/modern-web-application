import React from "react";
import { Button, Icon } from "@b-design/ui";
import Translation from "../../../../components/Translation";
import EnumFormItem from './enum-form-item';
import "../index.scss";

class EnumForm extends React.Component {
  constructor(props) {
    super(props);
    const { configValue } = props;
    this.state = {
      enumList: configValue.map((item) => ({ value: item, id: Date.now() }))
    };
  }

  componentWillReceiveProps(nextProps) {
    const { configValue } = nextProps;
    if (configValue && Object.keys(configValue).length > 0) {
      const enumList = configValue.map((_enum, i) => ({ id: `enum_${i}`, value: _enum }));
      this.setState({
        enumList
      });
    }
  }

  addEnum = () => {
    const { enumList } = this.state;
    enumList.push({ id: Date.now() });
    this.setState({
      enumList
    });
  }

  removeEnum = (id) => {
    const { enumList } = this.state;
    const { setConfigValue } = this.props;
    enumList.forEach((data, i) => {
      if (data.id === id) {
        enumList.splice(i, 1);
      }
    });
    this.setState({
      enumList
    }, setConfigValue)
  }


  getValues = () => {
    const { enumList } = this.state;
    let enumValue = [];
    enumList.forEach((data) => {
      if (this[`enumList${data.id}`]) {
        const value = this[`enumList${data.id}`].getValues();
        if (value) {
          enumValue.push(value);
        }
      }
    });
    return enumValue;
  }

  render() {
    const { enumList } = this.state;
    return (
      <div>
        {enumList.map((data) => <div style={{ position: "relative" }} key={data.id}><span className="remove-icon" style={{ right: -30, top: -3 }}><Icon type="ashbin" onClick={() => this.removeEnum(data.id)} /></span><EnumFormItem ref={(ref) => this[`enumList${data.id}`] = ref} setConfigValue={this.props.setConfigValue} data={data} /></div>)}
        <Button type="primary" style={{ width: '100%' }} onClick={this.addEnum}>+ <Translation>添加枚举列表</Translation></Button>

      </div>

    );
  }
}

export default EnumForm;
