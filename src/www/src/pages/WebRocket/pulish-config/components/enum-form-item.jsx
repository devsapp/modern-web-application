import React from "react";
import { Form, Input, Field } from "@b-design/ui";

import { PUBLISH_FOTM_ITEM_LAYOUT } from '../../../../constants';

import Translation from "../../../../components/Translation";

import "../index.scss";

const FormItem = Form.Item;




class EnumItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      enumList: [{ id: Date.now() }]
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




  getValues = () => {
    return this.field.getValue('EnumValue');
  }



  render() {
    const init = this.field.init;
    const { data } = this.props;
    return (
      <div >
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>Enum Value</Translation>}
          labelTextAlign="left"
          required
        >
          <Input {...init('EnumValue', { rules: [{ required: true }], initValue: data.value || '' })} />
        </FormItem>
      </div>
    );
  }
}

export default EnumItem;
