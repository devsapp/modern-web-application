import React, { Component } from "react";
import _ from "loadsh";
import request from '../../../utils/request';
import Terminal from '../../../components/terminal';
import ComponentParams from './component-params';
export default class ComponentUse extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [],
            componentName: ''
        }
    }
    componentDidMount = async () => {
        const { localData = {} } = this.props;
        const { fullPath, name } = localData;
        const accessResult = await request('accessCenter/getAccess');
        let data = [];
        if(fullPath) {
            const result = await request('componentCenter/getLocalComponentDoc', { localPath: fullPath });
            data = result.data || [];
        }
        const accessInfo = accessResult.data;
        this.setState({
            data,
            componentName: name,
            accessInfo
        })
    }

    executeCommand = (command) => {
        this.terminal.executeCommand(`${command} \n`);
    }

    refreshAccess = async () => {
        const accessResult = await request('accessCenter/getAccess');
        const accessInfo = accessResult.data;
        this.setState({
            accessInfo
        })
    }

    render() {
        const { data, componentName, accessInfo } = this.state;
        return <div className="component-use">
            <div className="terminal-container" >
                <Terminal ref={(ref) => this.terminal = ref} />
            </div>

            <div className="option-container">
                <If condition={data.length > 0}>
                    <ComponentParams data={data} accessInfo={accessInfo} componentName={componentName} executeCommand={this.executeCommand} refreshAccess={this.refreshAccess} />
                </If>
            </div>
        </div>
    }
}