import React, { Component } from "react";
import _ from "loadsh";
import { Input, Button } from "@b-design/ui";
import TerminalContainer from '../../../../components/terminal';
import { getParams } from '../../../../utils/common';


export default class CleanDebug extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount = () => {

    }

    action = () => {
        let sCommand = 's proxied clean';
        this.terminal.executeCommand(`${sCommand} \n`);
    }

   

    render() {
        const workspace = getParams('workspace');
        return (
            <React.Fragment>
                <div className="debug-showview-container">
                    <div style={{ marginBottom: 30 }}><Button type="primary" onClick={this.action}>清理环境</Button></div>
                    <TerminalContainer ref={(ref) => this.terminal = ref} workspace={workspace} domId="clean-terminal"/>
                </div>
            </React.Fragment>
        );
    }
}
