import React, { Component } from "react";
import _ from "loadsh";
import { Timeline } from "@b-design/ui";
import request from '../../../../utils/request';
import CodeDialog from '../../../../components/CodeDialog';
import CommandActionItem from './command-action-item';

export default class CommandAction extends Component {

  constructor(props) {
    super(props);
    this.state = {
      codeVisible: false,
      acionCommands: []
    }
  }

  componentDidMount = () => {
    this.getCommandActions();
  }

  getCommandActions = async () => {
    const { projectId } = this.props;
    const result = await request('userAppCenter/getUserActionCommand', { projectId });

    if (result.code === 200) {
      this.setState({
        acionCommands: result.data
      })
    }
  }

  openResultDetail = (code) => {
    this.setState({
      code,
      codeVisible: true
    })
  }

  closeCodeDialog = () => {
    this.setState({
      code: '',
      codeVisible: false
    })
  }
  render() {
    const { acionCommands, codeVisible, code } = this.state;
    return (
      <React.Fragment>
        <If condition={acionCommands.length > 0}>
          <Timeline>
            {acionCommands.map((data) => <Timeline.Item key={data.id} title={data.method} content={<CommandActionItem data={data} openResultDetail={this.openResultDetail} />} state={data.isOk ? 'success' : 'error'} />)}
          </Timeline>
          <CodeDialog code={code} visible={codeVisible} closeDialog={this.closeCodeDialog} title="执行结果详情" />
        </If>
        <If condition={acionCommands.length === 0}>
          <div>暂无操作记录</div>
        </If>
      </React.Fragment>
    );
  }
}
