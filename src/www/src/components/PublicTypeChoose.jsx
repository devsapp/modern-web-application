import React from "react";
import { Dialog, Radio, Button } from "@b-design/ui";
import Translation from "./Translation";
import { addPublishData } from '../models/user-published';
import { addHistory } from '../models/user-history';

const RadioGroup = Radio.Group;

export default class PublicTypeChoose extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      value: 'application',
      title: <Translation>Choose Type</Translation>,
      content: '',
      status: -1 // -1 init status 0 error 1 normal 2 close
    };

  }

  componentDidMount = () => {
    const { onInitPublishTemplate } = window;
    onInitPublishTemplate && onInitPublishTemplate(this.executeInitTemplate);
  }

  componentWillUnmount = () => {
    const { offInitPublishTemplate } = window;
    offInitPublishTemplate && offInitPublishTemplate();
  }

  executeInitTemplate = (event, data) => {

    const { status, result, error_message, content, type } = data; // status 0 error ,1 normal data, 2 close
    switch (status) {
      case 0:
        this.setError(status, error_message)
        break;
      case 1:
        this.setExecuteData(status, content);
        break;
      case 2:
        this.closeAndJump(result, type);
        break;
      default:
        break;
    }
  }

  setError = (status, message) => {
    this.setState({
      title: <Translation>An error occurred</Translation>,
      status,
      errorMessage: message
    })
  }

  setExecuteData = (status, content) => {
    this.setState({
      status,
      title: <Translation>Template initialization</Translation>,
      content
    })
  }

  open = () => {
    this.setState({
      visible: true
    });
  }

  close = () => {
    this.setState({
      visible: false
    });
  }

  confirmCreate = () => {
    const { value: type } = this.state;
    const { initPublishTemplate } = window;
    initPublishTemplate && initPublishTemplate({ data: { type } });
  }

  closeAndJump = (result, type) => {
    this.setState({
      visible: false,
      status: -1
    }, () => {
      addPublishData({ path: result, type, role: 1, state: 0, id: result, createTime: Date.now() });
      addHistory({ id: Date.now(), action: 'init', type, role: 1 });
      this.props.history.push(`/publish?type=${type}&path=${result}`);
    });
  }

  onChange = (value) => {
    this.setState({
      value
    });
  }

  initTemplate = () => {
    const { value } = this.state;
    const { initPublishTemplate } = window;
    initPublishTemplate && initPublishTemplate({ data: { type: value } })
  }


  render() {

    const { visible, value, title, errorMessage, status, content } = this.state;
    return (
      <Dialog title={title} visible={visible} footer={<div><If condition={visible}><Button disabled={status !== -1} type="primary" onClick={this.confirmCreate}>确定</Button></If></div>} onClose={this.close}>
        <div className="public-dialog">
          <If condition={status === -1}>
            <RadioGroup value={value} onChange={this.onChange} itemDirection={'ver'}>
              <Radio id="application" value="application">application</Radio>
              <Radio id="component" value="component">component</Radio>
              <Radio id="plugin" value="plugin">plugin</Radio>
            </RadioGroup>
          </If>
          <If condition={status === 1}>
            <div dangerouslySetInnerHTML={{ __html: content }} className="code-block-container" />
          </If>
          <If condition={status === 0}>
            <div>{errorMessage}</div>
          </If>
        </div>
      </Dialog >
    );
  }
}
