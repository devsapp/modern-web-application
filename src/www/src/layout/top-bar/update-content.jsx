import React, { Component } from "react";
import Electron from '@sdesktop/core/shared/electron';
import { Notification, Button } from '@b-design/ui';
import { confirmToUpdate } from '../../utils/window-option';
export default class UpdateContent extends Component {

    constructor(props) {
        super(props);
        this.state = {
            progress: 0,
        }


    }

    componentDidMount = async () => {
        Electron.ipcRenderer.on('system/updateProgress', (event, data) => {
            
        });
    }



    render() {
        const {data} = this.props;
        return <div >
           <div>{data}</div>
            <div style={{width: 600}}></div>
            <div><Button type="primary" onClick={confirmToUpdate}>确定更新</Button></div>
        </div>

    }
}
