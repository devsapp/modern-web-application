import React, { Component } from "react";

import { Nav } from '@b-design/ui';

import { resizeWindow, close, max, min, confirmToUpdate, quiteApp } from '../../utils/window-option';
import slogo from "../../assets/s.png";
import updateInfo from "../../assets/update-info.png";
import './index.scss';
const MAC_PLATFORM = 'darwin';
const { Item, SubNav } = Nav;
export default class TopBar extends Component {

    constructor(props) {
        super(props);
        this.state = {
            newVersionData: {},
            showUpdate: false,
            visible: false,
            uncompress: false,
            finish: false
        }
        this.updateInfoKey = 'aa';

    }

    componentDidMount = async () => {
        // Electron.ipcRenderer.on('system/updateInfo', (event, data) => {
        //     this.setState({
        //         showUpdate: true,
        //         newVersionData: data
        //     });
        // });
        // Electron.ipcRenderer.on('system/updateProgress', (event, data) => {

        //     if (data.type === 'percent') {
        //         if (!this.progressDom) {
        //             this.progressDom = document.getElementById('progress');
        //         }
        //         this.progressDom.style.width = data.value + '%';
        //     }
        //     if (data.type === 'uncompress') {
        //         document.getElementById('uncompress').innerHTML = data.value;
        //     }
        //     if (data.type === 'finish') {
        //         this.setState({
        //             finish: true
        //         })
        //         document.getElementById('uncompress').innerHTML = '恭喜解压完毕';
        //     }

        // });
    }
    confirmToUpdate = () => {
        this.setState({
            uncompress: true
        });
        confirmToUpdate();
    }


    openVersionDialog = () => {
        this.setState({
            visible: true
        })
    }

    closeVersionDialog = () => {
        this.setState({
            visible: false
        })
    }

    render() {
     
        const { showUpdate } = this.state;
        return <div className="layout-topbar" id="layout-topbar" onDoubleClick={() => { resizeWindow() }}>
            <img src={slogo} className="s-logo" />
            <span className="word">Serverless Devs <If condition={showUpdate}><img src={updateInfo} style={{ marginLeft: 12, width: 17 }} onClick={this.openVersionDialog} /></If></span>
            <Nav direction="hoz" type="primary" className="nav-container">

                <Item key="home"><a href="https://serverlessdevs.resume.net.cn/zh-cn" target="_blank">主页</a></Item>
                <Item key="doc"><a href="https://serverlessdevs.resume.net.cn/zh-cn/docs/intro.html" target="_blank">查看文档</a></Item>
                <Item key="community"><a href="https://serverlessdevs.resume.net.cn/zh-cn/community/index.html" target="_blank">社区</a></Item>
                <Item key="blog"><a href="https://serverlessdevs.resume.net.cn/zh-cn/blog/index.html" target="_blank">博客</a></Item>
            </Nav>

        </div>

    }
}
