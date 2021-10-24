import React, { Component } from "react";
import _ from "loadsh";
import { Input, Button } from "@b-design/ui";
import TerminalContainer from '../../../../components/terminal';
import { getParams } from '../../../../utils/common';


export default class CommandAction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            port: 3001
        }
    }

    componentDidMount = () => {

    }


    action = () => {
        const { port } = this.state;
        let sCommand = 's proxied setup';
        if (port) {
            sCommand = `s proxied setup --config vscode --debug-port ${port}`
        }
        this.terminal.executeCommand(`${sCommand} \n`);
    }

    render() {
        const { port } = this.state;
        const workspace = getParams('workspace');
        return (
            <React.Fragment>
                <div className="prepare-tips">
                    <div className="title">端云调试前置条件：</div>
                    <div className="content">1. 安装并启动docker</div>
                    <div className="content">2. 需要构建函数计算的服务及函数</div>
                    <div className="content">3. 需要开通 acr 阿里云镜像服务</div>
                   
                </div>
                <div className="debug-showview-container">
                    <div style={{ marginBottom: 30 }}><span style={{ fontSize: '14px', fontWeight: 'bold', marginRight: 15 }}>输入指定调试端口: </span><Input value={port} onChange={(port) => this.setState({ port })} placeholder="默认启动端口3000" /></div>
                    <div style={{ marginBottom: 30 }}><Button style={{ marginRight: 12 }} type="primary" onClick={this.action}>启动资源准备</Button>(请在启动指令执行完毕后【出现"End of method: proxied"】切入下个步骤)</div>
                    <TerminalContainer ref={(ref) => this.terminal = ref} workspace={workspace} domId="prepare-terminal" />
                </div>
            </React.Fragment>
        );
    }
}
