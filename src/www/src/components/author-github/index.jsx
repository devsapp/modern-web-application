import React from "react";
import _ from "loadsh";
import { Notification, Button, Balloon, Dialog } from "@alifd/next";
import request from '../../utils/request';
import giticon from '../../assets/github.png';
import './index.scss';
export default class AuthorGithub extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userInfo: {}
        }

    }

    componentDidMount = async () => {
        await this.getUserInfo();
    }

    getUserInfo = async () => {
        const result = await request('userCenter/getUserInfo');
        if (result.code === 200) {
            this.setState({
                userInfo: result.data
            })
        }
    }

    logOut = async () => {
        const dialog = Dialog.confirm({
            title: '确定登出吗？',
            content: '',
            footerActions: ['cancel', 'ok'],
            onOk: async () => {
                await request('userCenter/logOut');
                await this.getUserInfo();
            },
            onCancel: () => { },
        });

    }

    authorLoginGitHub = async () => {
        await request('userCenter/openGitLink', {}, (result) => {
            if (result.code === 200) {
                const userInfo = _.get(result, 'data.Response', {});
                if (!userInfo.Error) {
                    Notification.open({
                        title: '登录成功',
                        content: '',
                        type: 'success',
                    });
                    this.setState({
                        userInfo
                    })
                } else {
                    Notification.open({
                        title: '登录失败',
                        content: '',
                        type: 'error',
                    });
                }

            }
        })
    }

    render() {
        const { userInfo } = this.state;
        const avatar_url = _.get(userInfo, 'avatar_url')
        return (
            <div className="git-author">
                <If condition={!avatar_url}>
                    <div className="git-login" onClick={this.authorLoginGitHub} >
                        <img
                            className="menu-item-icon"
                            src={giticon}
                        />
                        <span className="login-word">登录</span>
                    </div>
                </If>
                <If condition={avatar_url}>

                    <Balloon
                        trigger={<img
                            className="menu-item-icon"
                            src={avatar_url}
                        />}
                        align="rb"
                        alignEdge
                        triggerType="hover"

                    >
                        <div className="login-tips">
                            <div className="login-tip login-name">你好：{userInfo.name}</div>
                            <div className="login-tip login-account">登录账号：{userInfo.login}</div>
                            <div className="login-tip login-email">邮箱：{userInfo.email}</div>
                            <div className="login-tip login-blog">博客：{userInfo.blog}</div>
                            <div className="logout" style={{ width: '100%', marginTop: 12 }}>
                                <Button ghost="light" className="logout-btn" onClick={this.logOut} style={{ backgroundColor: 'white', width: '100%' }}>退出登录</Button>
                            </div>
                        </div>
                    </Balloon>

                </If>

            </div >
        );
    }
}


