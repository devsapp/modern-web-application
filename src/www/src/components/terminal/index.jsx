import React from "react";
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { FitAddon } from 'xterm-addon-fit';
import request from "../../utils/request";
import "./index.scss";
import "xterm/css/xterm.css"


export default class TerminalContainer extends React.Component {
    constructor(props) {
        super(props);
        this.terminalId = '';
        this.term = '';
        this.installedSTimmer = null;
        this.hasS = false
    }

    componentDidMount = async () => {
        const { workspace, domId = 'terminal-container' } = this.props;
        const term = new Terminal({
            rendererType: 'canvas',
            cursorBlink: true,
            convertEol: true,
            rows: 34,
            cols: 40,
            theme: {
                foreground: 'white',
                background: '#060101'
            }
        });
        this.term = term;
        const fitAddon = new FitAddon();
        const weblinkAddon = new WebLinksAddon();
        term.loadAddon(fitAddon);
        term.loadAddon(weblinkAddon);
        term.open(document.getElementById(domId));
        term.onData(this.executeCommand);
        await request('terminalCenter/init', { cwd: workspace }, (data) => {

            if (data.code === 200) {
                this.terminalId = data.terminalId;
                const hasS = data.hasS;
                this.hasS = hasS;
                if (hasS) {
                    term.writeln('\x1b[1;1;32mWelcome To Serverless Devs\x1b[0m');
                } else {
                    term.writeln('\x1b[1;1;32m检测到您还没有安装S工具，现在执行安装\x1b[0m');
                    this.installedSTimmer = setTimeout(async () => {
                        await request('terminalCenter/execute', { terminalId: this.terminalId, data: 'npm install -g @serverless-devs/s \n' });
                        this.hasS = true;
                    }, 2000)
                }
            }
            else {
                term.write(data);
            };
        });
        fitAddon.fit();
    }

    componentWillUnmount = async () => {
        if (this.terminalId && this.term) {
            this.term.clear();
            await request('terminalCenter/close', { terminalId: this.terminalId })
        }
    }

    executeCommand = async (data) => {
        if (!this.hasS) {
            if (this.installedSTimmer) {
                this.installedS && clearTimeout(this.installedS);
            }
            await request('terminalCenter/execute', { terminalId: this.terminalId, data: 'npm install -g @serverless-devs/s \n' });
        }
        await request('terminalCenter/execute', { terminalId: this.terminalId, data });

    }

    cleanTerminal = () => {
        if (this.terminalId && this.term) {
            this.term.clearSelection();
        }
    }


    render() {
        const { domId = 'terminal-container' } = this.props;
        return (
            <div id={domId} style={{ width: '100%', height: '100%' }} />
        );
    }
}

