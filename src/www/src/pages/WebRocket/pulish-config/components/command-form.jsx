import React from "react";
import { Form, Input, Field, } from "@b-design/ui";
import Translation from "../../../../components/Translation";
import { PUBLISH_FOTM_ITEM_LAYOUT } from '../../../../constants';

import "../index.scss";

const FormItem = Form.Item;

class CommandForm extends React.Component {
  constructor(props) {
    super(props);
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
    return this.field.getValues();
  }

  render() {
    const init = this.field.init;
    const { defaultValue = {} } = this.props;
    return (
      <div>
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>指令名</Translation>}
          labelTextAlign="left"
          hasFeedback
          required
        >
          <Input {...init('name', { rules: [{ required: true }], initValue: defaultValue['name'] })} style={{ width: '100%' }} />
        </FormItem>
        <FormItem
          {...PUBLISH_FOTM_ITEM_LAYOUT}
          label={<Translation>指令描述</Translation>}
          labelTextAlign="left"
          hasFeedback
        >
          <Input.TextArea  {...init('description', { rules: [{ required: true }], initValue: defaultValue['desc'] })} style={{ width: '100%' }} />
        </FormItem>
      </div>
    );
  }
}

export default CommandForm;
