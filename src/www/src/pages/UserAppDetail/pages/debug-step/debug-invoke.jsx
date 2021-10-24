import React, { Component } from "react";
import _ from "loadsh";
import ReactMarkdown from "react-markdown";
import { Button } from "@b-design/ui";
import CodeBlock from "../../../../components/CodeBlock";
import HeaderBlock from "../../../../components/HeaderBlock";
import TerminalContainer from '../../../../components/terminal';
import { getParams } from '../../../../utils/common';
import SimpleFoldContainer from '../../../../components/SimpleFoldContainer';
const DEBUG_DOC_MARKDOWN = ['<a name="shnlR"></a>',
    '### 1.准备脚本',
    '前面的指令会自动帮忙生成 vscode 调试脚本，存放到工作空间.vscode目录下，你可以自定义修改',
    '```bash',
    '{',
    ' "version": "0.2.0",',
    '  "configurations": [',
    '       {',
    '         "name": "<your fc function name>",',
    '         "type": "node",',
    '          "request": "attach",',
    '          "address": "localhost",',
    '          "port": 3001,',
    '          "localRoot": "<your workspace dir>",',
    '          "remoteRoot": "/code",',
    '          "protocol": "inspector",',
    '          "stopOnEntry": false',
    '      }',
    '  ]',
    '}',
    '```',
    '<a name="P3ERF"></a>',
    '### 2.启动vscode debug 模式，并打上断点 ',
    '![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2021/png/13970/1626923781326-4bdcb9c6-2f43-4f74-8a7c-59e8bcd36881.png#clientId=ufc799ed1-8151-4&from=paste&height=1097&id=u7e538e86&margin=%5Bobject%20Object%5D&name=image.png&originHeight=2194&originWidth=3584&originalType=binary&ratio=1&size=847184&status=done&style=none&taskId=uab449e15-c839-46f9-8804-654dea00d45&width=1792)',
    '<a name="G7l62"></a>',
    '### 3.点击"发起调用"按钮查看断点情况',
    '![image.png](https://intranetproxy.alipay.com/skylark/lark/0/2021/png/13970/1626923879355-6a8df93d-eb48-4903-b78b-559bdf3a2f21.png#clientId=ufc799ed1-8151-4&from=paste&height=480&id=uc24eaa76&margin=%5Bobject%20Object%5D&name=image.png&originHeight=960&originWidth=2562&originalType=binary&ratio=1&size=150511&status=done&style=none&taskId=ua5e934d1-a7c3-4670-97ea-2c086e54a1a&width=1281)',
].join('\n');
export default class CommandAction extends Component {

    constructor(props) {
        super(props);
        this.state = {
            port: ""
        }
    }

    componentDidMount = () => {

    }


    action = () => {
        let sCommand = 's proxied invoke';
        this.terminal.executeCommand(`${sCommand} \n`);
    }


    setCleanStep = () => {
        this.props.setCurrentStep(2);
    }

    render() {
        const workspace = getParams('workspace');
        return (
            <React.Fragment>
                <div className="debug-showview-container" style={{ marginTop: 10 }}>
                    <div style={{ marginBottom: 30 }}>
                        <SimpleFoldContainer title={'展开查看vscode debug示例'} isClose height={800}>
                            <ReactMarkdown
                                source={DEBUG_DOC_MARKDOWN}
                                escapeHtml={false}

                                renderers={{
                                    code: CodeBlock,
                                    heading: HeaderBlock,
                                }}
                            />
                        </SimpleFoldContainer>

                    </div>
                    <div style={{ marginBottom: 30 }}><Button type="primary" onClick={this.action}>发起调用</Button></div>
                    <TerminalContainer ref={(ref) => this.terminal = ref} workspace={workspace} domId="action-terminal" />
                    <div className="clean-tips" onClick={this.setCleanStep}>调试结束后请及时进行资源清理</div>
                </div>
            </React.Fragment>
        );
    }
}
