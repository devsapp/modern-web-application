import React from "react";
import _ from "loadsh";
import { Dialog } from "@b-design/ui";
import TerminalContainer from '../terminal';
export default class TerminalDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
        }
    }


    openAndExecuteCommand = (command) => {
        this.setState({
            visible: true
        }, () => {
            this.terminal.executeCommand(command);
        })
    }

    close = () => {
        this.setState({
            visible: false
        });
        const { closeTerminalCallback } = this.props;
        closeTerminalCallback && closeTerminalCallback();
        this.terminal.cleanTerminal();
    }

    render() {
        const { visible } = this.state;
        const { workspace } = this.props;
        return (
            <Dialog
                title={'执行'}
                visible={visible}
                onClose={this.close}
                autoFocus
                style={{ width: 1360, height: 600 }}
                footer={<div />}
            >
                <div style={{ width: 1260, marginLeft: -12, height: 400 }}>
                    <TerminalContainer ref={(ref) => this.terminal = ref} workspace={workspace} />
                </div>
            </Dialog>
        );
    }

}