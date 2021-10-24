


import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from 'moment';
import _ from "loadsh";
import { Button, Tag, Icon, Grid, Balloon, Message } from "@b-design/ui";
import Translation from "../../../components/Translation";
import collectIcon from "../../../assets/collect_unactive.png";
import collectIconActive from "../../../assets/collect_active.png";
import downloadIcon from "../../../assets/download.png";
import cardTitleIcon from '../../../assets/cardTitle.png';
import nodeIcon from "../../../assets/node.png";

import "./index.scss";
const SDESKTOP_URL = 'sdesktop://';
const DOWNLOAD_SDESKTOP_URL = 'https://serverlessdevs.resume.net.cn/zh-cn/desktop/index.html';
const HOT_SPACE = 'hot-space'; //热区 ，点击父容器的时候忽略

export default class AppCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      activeHover: false
    }
    this.handleOver = this.handleOver.bind(this);
    this.handleOut = this.handleOut.bind(this);
  }


  handleOver(e) {
    this.setState({
      activeHover: true
    })
  }
  handleOut(e) {
    this.setState({
      activeHover: false
    })
  }

  renderTransEle() {
    const { activeHover } = this.state;
    const { data, initAppTemplate } = this.props;

    if (activeHover) {
      return (
        <div className='trans-useWraper' onMouseLeave={this.handleOut} >
          <div className='user-icon'>
            <img src={nodeIcon} />
          </div>
          <div className={`user-text ${HOT_SPACE}`}>
            <Translation className={HOT_SPACE} >使用</Translation>
          </div>
        </div>
      )
    } else {
      return <div className='sInon' onMouseEnter={this.handleOver}>s\</div>
    }
  }

  //获取tags数据
  getTagsInfo() {
    const { data } = this.props;
    const renderText = data.tags.slice(0, 2).join(' # ')

    return <Balloon trigger={`# ${renderText}`} closable={false}>
      {`#${data.tags.join('# ')}`}
    </Balloon>


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

  goAppDetail = (e, data) => {
    e.stopPropagation();
    if (e.target && e.target.className && e.target.className.indexOf(HOT_SPACE) !== -1) {
      return;
    }
    const path = {
      pathname: "/app-detail",
      search: `name=${data.package}`,
      state: data,
    };
    this.props.history.push(path);
  }

  render() {
    const { data, collectApp, collectApps = [], isCollect, searchApp } = this.props;
    return (
      <div className="card-cmp" style={{ backgroundColor: "#FFFFFF" }} onClick={(e) => {
        this.goAppDetail(e, data);
      }}>
        <div className='content-wraper'>
          {/* <div className="collect-container" onClick={async () => { await collectApp(data.package, collectApps.includes(data.package) || isCollect); searchApp() }}><img src={collectApps.includes(data.package) || isCollect ? collectIconActive : collectIcon} className="collect-icon" />{data.collection}</div> */}
          <div className='left-wraper'>
            <img src={data.logo ? data.logo : cardTitleIcon} />
          </div>
          <div className='right-wraper'>
            <div className="content-detail">
              {/* <div className="first-auth">
          <If condition={iconData}>
              <If condition={iconData.icon}>
                <img src={iconData.icon} alt="authIcon" className="auth-icon" />
                <span className="auth-name">xx</span>
              </If>
            </If>
            <If condition={!iconData}>
              <span className="auth-name">寒斜</span>
            </If> 
        </div>*/}
              <div className="card-title">
                <Link
                  to={{
                    pathname: "/app-detail",
                    search: `name=${data.package}`,
                    state: data,
                  }}
                >
                  {data.package}
                </Link>
                {/* <div className="publish-time"><span>发布时间:</span><span>{moment(_.get(data, 'version.published_at')).fromNow()}</span></div> */}

              </div>
              <div className="card-content-container">
                <div className="card-desc">
                  <If condition={data.description.length > 45}>
                    <Balloon trigger={data.description} closable={false}>
                      {data.description}
                    </Balloon>
                  </If>
                  <If condition={data.description.length < 45}>
                    {data.description}
                  </If>
                </div>
              </div>

              <div className="card-footer">
                <div className="tip-container">
                  <div className="collect-container tip-item" >
                    <img src={collectApps.includes(data.package) || isCollect ? collectIconActive : collectIcon} className="collect-icon" />{data.collection}
                  </div>
                  <div className="download-container tip-item"><img src={downloadIcon} className="img" />
                    <span className={'fontTableStyelSpec marginTop-2'}>  {data.download}</span>
                  </div>
                  <div className="tag-container tip-item">
                    {this.getTagsInfo()}
                  </div>
                </div>
              </div>

            </div>
            <div className='content-footer'>

              <Balloon
                className="code-option-wrapper"
                trigger={<div className='conter-trans-wraper'>
                  {this.renderTransEle()}
                </div>}
                align="rb"
                alignEdge
                triggerType="click"

              >
                <div className={`codeuse-wrapper ${HOT_SPACE}`}>
                  <div className={`codeuse-item-first ${HOT_SPACE}`} >
                    < Icon type={'terminal'} size="medium" className={HOT_SPACE} />
                    <div className={`input-wrapper ${HOT_SPACE}`}>
                      <input value={`s init ${data.package}`} className={`input-content ${HOT_SPACE}`} readOnly />
                      <div className={`copy ${HOT_SPACE}`} onClick={() => this.copyToClip(`s init ${data.package}`)}>
                        复制
                      </div>
                    </div>
                    <div className={`tip ${HOT_SPACE}`}>
                      通过s 命令 获取组件
                    </div>

                  </div>
                  <div className={`codeuse-item ${HOT_SPACE}`} onClick={this.getSdesktop}>
                    < Icon type={'screen'} size="medium" style={{ marginRight: 4 }} className={HOT_SPACE} />
                    使用Serverless Desktop打开
                  </div>
                  {/* <div className="codeuse-item">源码下载 </div> */}
                </div>
              </Balloon>

            </div>
          </div>
        </div>
      </div>
    );
  }
}