import React from "react";

import _ from 'loadsh';
import { Button, Icon, Message, Input } from "@b-design/ui";
import ReactMarkdown from "react-markdown";
import { subscribe, unsubscribe } from "tiny-pubsub";

import Translation from "../../../components/Translation";
import CodeBlock from "../../../components/CodeBlock";
import HeaderBlock from "../../../components/HeaderBlock";
import MarkdownOutline from "../../../components/MarkdownOutline";
import { getParams } from '../../../utils/common';
import * as request from '../../../utils/request';

import "./app-content.scss";
const SDESKTOP_URL = 'sdesktop://';
const DOWNLOAD_SDESKTOP_URL = 'https://serverlessdevs.resume.net.cn/zh-cn/desktop/index.html';
class AppContent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
        this.linkListener = [];
    }

    async componentDidMount() {
        this.initData();

    }




    initData = async () => {
        const name = getParams('name') || {};
        console.log(name)
        const result = await request.post('appCenter/getAppDetail', { name });
        if (result.code === 200) {
            const data = result.data;
            this.setState({
                data,
            });
        }

    }


    downloadAppTemplate = () => {

        const { data } = this.state;
        const { name, description, tags } = data;
        if (name) {
            this.initTemplate && this.initTemplate.initAppTemplate({ name, desc: description, tags });
        }
    }

    copyToClip = (content) => {
        const input = document.createElement("input");
        input.value = content
        document.body.appendChild(input);
        input.select();
        document.execCommand("Copy");
        document.body.removeChild(input);
        Message.success('复制成功')
    }


    launchIE = () => {

        let url = SDESKTOP_URL;
        let aLink = $('#hiddenLink')[0];

        isSupported = false;
        aLink.href = url;

        //Case 1: protcolLong
        if (navigator.appName == "Microsoft Internet Explorer"
            && aLink.protocolLong == "Unknown Protocol") {
            isSupported = false;
            window.open(DOWNLOAD_SDESKTOP_URL);
            return;
        }

        //IE10+
        if (navigator.msLaunchUri) {
            navigator.msLaunchUri(url,
                function () { isSupported = true; result(); }, //success
                function () { isSupported = false; result(); }  //failure 
            );
            return;
        }

        //Case2: Open New Window, set iframe src, and access the location.href

        var myWindow = window.open('', '', 'width=0,height=0');
        myWindow.document.write("<iframe src='" + url + "></iframe>");
        setTimeout(function () {
            try {
                myWindow.location.href = SDESKTOP_URL;
                isSupported = true;
            } catch (e) {
                //Handle Exception
            }
            if (isSupported) {
                myWindow.setTimeout('window.close()', 100);
            } else {
                myWindow.close();
            }

        }, 100)
    };

    launchMozilla = () => {
        let url = SDESKTOP_URL;
        let iFrame = $('#hiddenIframe')[0];
        let isSupported = false;
        //Set iframe.src and handle exception
        try {
            iFrame.contentWindow.location.href = url;
            isSupported = true;
        } catch (e) {
            //FireFox
            if (e.name == "NS_ERROR_UNKNOWN_PROTOCOL") {
                isSupported = false;

                window.open(DOWNLOAD_SDESKTOP_URL);
            }
        }
    }

    launchChrome = () => {
        let protcolEl = $('#search-input')[0];

        let isSupported = false;


        protcolEl.focus();
        protcolEl.onblur = function () {
            isSupported = true;

        };

        //will trigger onblur
        window.location.href = SDESKTOP_URL;

        //Note: timeout could vary as per the browser version, have a higher value
        setTimeout(function () {
            protcolEl.onblur = null;
            if (!isSupported) {
                window.open(DOWNLOAD_SDESKTOP_URL);
            }
        }, 500);

    }

    getSdesktop = () => {
        if ($.browser.mozilla) {
            this.launchMozilla();
        } else if ($.browser.chrome) {
            this.launchChrome();
        } else if ($.browser.msie) {
            this.launchIE();
        }
    }

    render() {
        const { data = {} } = this.state;
        const { history } = this.props;
        const {
            name,
            description,
            runtime,
            publish_time,
            download_count,
            type,
            user,
            tags = [],
            homepage = "",
            readme,
            version
        } = data;
        return (
            <div className="cmp-main-part">
                <div className="mid-component-content">
                    <div name="1" id="intro">
                        <div className="cmp-title">{name}</div>
                        <div className="cmp-title-desc">
                            {description}
                        </div>
                        <div className="download-tag">
                            <span
                                className="update-time-download"
                                style={{ marginRight: "21px" }}
                            >
                                <Translation>update</Translation>  {publish_time}
                            </span>
                            <img
                                src={`data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAB5klEQVRYR+2WsU7DMBCGYzdS1eQBiuAlgJkJFiYCDJHdpSwICVhZK1GJRwCJDZbEigQoGxMbK+IBmIH2ATo1NjoUIxMcu01VdSBZMti+//N/vrORs+APLVjfqQFmdoAxFgghrvNUvsFfCDHEGH9gjO/CMHwypXkiABAhhKS6QEmSbGZZFuXCbXUOxviKEHIyEwBjrMc5P0cI3VJKD0zBkiRZzbLsUYF56HQ6+5UBpLgMYNpRmqbLo9HoRQjRBlghRBch9Ewp3agEoOx8gBA6gjxDcB1EURyciqJIVAZQxRuNxnYYhq+qiAqhE4cd5wADSunSVA7oxGUAmWPpRKvVulBtV89IHMefsG4qAJO4DgIhNJA5Lx5QqBxYU1Y9Mt5PGU4iXgJhrQ5rCkzistF4nrceBMG7CsE5P7TVue2uQbadM8YuOefHrutu2bqaTUw3juRhkae9OGnuAHCym83mULVXhZg7gM02EwDAc853CCF9W5yycetlZAKI4/gGWq7rumvQrIoi0KTKnP1ThmWEVQHkOt/3V0wQ3w6AlePxuOf7/mlxclWAKIruHcfZK3PnlwNSBGO8W+xcNUDtwP9wIH/Z9j3PCzVlCM/us7IxznlX9/CEW7RsTO051k5YtcVOuq4GWLgDXxkOQj+/THUZAAAAAElFTkSuQmCC`}
                                alt="isTag"
                                className="download-icon"
                                style={{ marginRight: 4 }}
                            />
                            <span
                                className="update-time-download"
                                style={{ marginRight: "16px" }}
                            >
                                {download_count || "0"}
                            </span>
                            <If condition={tags !== ''}>
                                <ul className="tag-display">
                                    {tags.map((item, index) => (
                                        <li key={index} className="tag-background">
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </If>
                        </div>
                        <div className="deploy-button">
                            <div className="get-template">获取模板</div>
                            <div className="codeuse-wrapper">
                                <div className="codeuse-item-first" >
                                    <div className="codeuse-container">
                                        < Icon type={'terminal'} size="medium" style={{ marginRight: 12 }} />
                                        <div className="input-wrapper">

                                            <input value={`npx s init ${name}`} className="input-content" readOnly id="search-input"  />
                                            <div className="copy" onClick={() => this.copyToClip(`npx s init ${name}`)}>
                                                复制
                                        </div>
                                        </div>
                                    </div>
                                    <div className="tip">
                                        通过s 命令 获取组件
                                </div>

                                </div>
                                <div className="codeuse-item" onClick={this.getSdesktop}>< Icon type={'screen'} size="medium" style={{ marginRight: 4 }} />
                      使用Serverless Desktop打开
                  </div>

                            </div>
                            {/* <Button className="local-deploy">Local Deploy </Button> */}
                        </div>
                    </div>
                    <div className="mid-hr"></div>
                    <div className="markdown-container" style={{ height: window.innerHeight - 400}}>
                        <ReactMarkdown
                            source={readme}
                            escapeHtml={false}
                            renderers={{
                                code: CodeBlock,
                                heading: HeaderBlock,
                            }}
                        />
                    </div>
                </div>
                <div className="component-tips-container">
                    <div className="side-cmp">
                        <div className="single-line">
                            <div className="label-name">
                                <div className="label-width">
                                    <Translation className="label-width">Type</Translation>:{" "}
                                </div>
                                <span className="label-desc">{type}</span>
                            </div>
                        </div>
                        <div className="single-line">
                            <div className="label-name">
                                <div className="label-width">
                                    <Translation>Runtime</Translation>
                                </div>
                                <span className="label-desc">{runtime || '-'}</span>
                            </div>
                        </div>
                        <div className="single-line">
                            <div className="label-name">
                                <div className="label-width">
                                    <Translation>Author</Translation>
                                </div>
                                <span className="label-desc">{user}</span>
                            </div>
                        </div>
                        <div className="single-line">
                            <div className="label-name">
                                <div className="label-width">
                                    <Translation>Homepage</Translation>
                                </div>
                                <span className="label-desc a-tag" >{homepage}</span>
                            </div>
                        </div>
                        <div className="mid-hr"></div>
                    </div>
                    <div
                        className="cmp-name"
                        id="scrollable"
                        style={{ borderLeft: "1px solid #eee", paddingLeft: 10 }}
                    >
                        {/* <div className="cmp-name-anchor">{name}</div> */}
                        <MarkdownOutline context={readme} />
                    </div>
                </div>
            </div>
        );
    }
}

export default AppContent;
