import React, { Component } from "react";
import _ from "loadsh";
import { Icon, SplitButton } from "@b-design/ui";
import BoxContaier from '../../../components/box-container';
import CommonBalloon from '../../../components/CommonBalloon';
import CommandAction from './command-action';
import { getParams } from '../../../utils/common';
import request from '../../../utils/request';
import { openLinks } from '../../../utils/url';
import FcItem from './resource-item/fc';
import vscodeIcon from "../../../assets/vscode.png";
import "../index.scss";

const { Item } = SplitButton;


export default class BasicInfoView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appList: [],
      domain: '',
      resources: []
    }
  }

  componentDidMount = async () => {
    this.getDomain();
    this.getResources();

  }


  getDomain = async () => {
    const workspace = getParams('workspace');
    const result = await request('userAppCenter/getAppDomain', { workspace });

    if (result.code === 200) {
      let data = result.data;
      let domain = '';
      try {
        domain = JSON.parse(data.content).domain;
        if (domain.indexOf('http') === -1) {
          domain = 'http://' + domain;
        }
        this.setState({
          domain
        })
      } catch (e) { }
    }
  }

  getResources = async () => {
    const workspace = getParams('workspace');
    const result = await request('userAppCenter/getResources', { workspace });
    let resources = [];
    if (result.code === 200) {
      try {
        resources = result.data.map((item) => {
          return {
            name: item.name,
            content: JSON.parse(item.content)
          }
        }).filter(item => item.name !== 'domain');
        this.setState({
          resources
        })

      } catch (e) {

      }

    }

  }

  openWithVscode = async (workspace) => {
    await request('commonAction/openWithVscode', { workspace });
  }

  openDomain = (domain) => {
    if (domain.indexOf('http') === -1) {
      domain = 'http://' + domain;
    }
    openLinks(domain);
  }

  transformResourceContext = (item, i) => {
    if (item.name === 'fc') {
      return <FcItem item={item} />;
    }
    if (Array.isArray(item.content)) {
      return <div key={i}>
        <div style={{ fontWeight: 'bold' }}>????????????{item.name} </div>
        {item.content.map((contentItem) => <div style={{ fontWeight: 'bold' }}>??????????????? {Object.keys(contentItem).map(key => <div style={{ paddingLeft: 54 }}><span >{key}</span><span style={{ marginLeft: 8 }}>{JSON.stringify(contentItem[key])}</span></div>)}</div>)}
      </div>
    }
    return <div key={i}>
      <div style={{ fontWeight: 'bold' }}>????????????{item.name} </div>
      <div style={{ fontWeight: 'bold' }}>??????????????? {Object.keys(item.content).map(key => <div style={{ paddingLeft: 54 }}><span >{key}</span><span style={{ marginLeft: 8 }}>{item.content[key]}</span></div>)}</div>
    </div>

  }
  render() {
    const workspace = getParams('workspace');
    const appName = getParams('appName');
    const { domain, resources } = this.state;
    return (
      <React.Fragment>
        <div style={{ marginTop: 24 }} className="basicinfo-container">
          <BoxContaier title="????????????" desc="????????????????????????????????????????????????????????????">
            <div>
              ???????????????{appName || ''}
            </div>
            <div className="info-item">
              ???????????????{workspace} <img
                className="open-workspace-icon"
                style={{ width: 16, cursor: 'pointer', marginLeft: 16 }}
                src={vscodeIcon}
                onClick={() => this.openWithVscode(workspace)}
              />
            </div>
            <If condition={domain}>
              <div className="domain-container">
                ???????????????<span className="external-link link" onClick={() => this.openDomain(domain)}>{domain} <Icon type="external-link" /></span>
                <SplitButton label={<span>????????????
                  <CommonBalloon content={'?????????????????????????????????????????????????????????'}>
                    <Icon type="help" />
                  </CommonBalloon></span>} type="primary" size="small" style={{ marginLeft: 12, width: 120 }}>
                  <Item key="retcode" onClick={() => openLinks('https://www.aliyun.com/product/arms?spm=5176.10695662.784055.1.241e4e46j6wRvD')}>
                    <span  >??????????????????</span>
                  </Item>
                  <Item key="test" onClick={() => openLinks('https://zijian.aliyun.com/')}>
                    <span >??????????????????</span>
                  </Item>
                </SplitButton>
              </div>
            </If>
            {/* <div>
              ???????????????
              </div> */}
          </BoxContaier>
          <BoxContaier title="????????????" desc="?????????????????????????????????">
            <If condition={resources.length === 0}>
              <span>??????</span>
            </If>
            <If condition={resources.length > 0}>
              {resources.map((item, i) => this.transformResourceContext(item, i))}
            </If>
          </BoxContaier>
          <BoxContaier title="????????????" desc="????????????10??????????????????????????????????????????">
            <CommandAction projectId={workspace} />
          </BoxContaier>
        </div>
      </React.Fragment>
    );
  }
}
