import React from "react";
import yaml from "js-yaml";
import { Nav, Button, Icon, Field, Dialog, Notification, Breadcrumb } from '@b-design/ui';
import Editor from "../../../components/Editor";
import ProjectPannel from "./components/project-panel";
import Translation from "../../../components/Translation";
import request from '../../../utils/request';
import { getParams, setParams } from '../../../utils/common';
import "./index.scss";
const DEFAULT_DESCRIPTION = ['### 主标题', '标题内容', '#### 标题1', '内容1', '#### 标题2', '内容2', '#### 标题3', '内容3'].join('\t\n');


class Publish extends React.Component {
  constructor(props) {
    super(props);
    this.childNode = {};
    this.singleStructArray = [];
    const workspace = getParams('workspace') || '';
    this.state = {
      title: "",
      visible: false,
      workspace,
      moreInfo: "",
      content: "",
      configValue: "",
      templateObj: {},
      fullScreen: false
    };
  }

  async componentDidMount() {
    await this.getData();
  }

  getData = async () => {
    const workspace = getParams('workspace') || '';
    if (workspace) {
      const result = await request('publishCenter/getPublishConfig', { workspace }); // eg '/Users/hanxie/opensource/devsapp/static-site'
      const configValue = result.data;
      if (configValue) {
        this.setState({
          configValue: yaml.dump(configValue),
          workspace
        });
      }
    }
  }
  setConfigValue = (configValue) => {
    this.setState({
      configValue,
    });
  };

  closeDialog = () => {
    this.setState({ visible: false })
  }

  toggleView = () => {
    const { fullScreen } = this.state;
    this.setState({
      fullScreen: !fullScreen
    })
  }

  chooseNewWrokspace = async () => {

    const dialog = Dialog.confirm({
      title: '确定更换工作空间吗？',
      content: '更换工作空间后配置项会随之改变，请确保之前的内容已经保存',
      footerActions: ['cancel', 'ok'],
      onOk: async () => {
        await this.getWorksapce(dialog);
      },
      onCancel: () => { },
    });


  }

  getWorksapce = async (dialog) => {
    const result = await request('publishCenter/choosePublishWorkspace');
    const workspace = result.workspace;
    if (workspace) {
      setParams('workspace', workspace);
      await this.getData();
      dialog && dialog.hide();
    } else {
      Dialog.confirm({
        title: '错误',
        content: '请选择有publish.yaml存在的目录',
        messageProps: {
          type: 'error',
        },
        footerActions: ['ok'],
        onOk: () => { },
        onCancel: () => { }
      });
    }
  }

  publishProject = () => {

  }

  savePublishConfig = async () => {
    const { workspace, configValue } = this.state;
    const result = await request('publishCenter/savePublishConfig', { workspace, configText: configValue });
    if (result.code === 200) {
      Notification.open({
        title: '保存成功',
        content: '',
        type: 'success',
      });
    }
  }

  render() {
    const contentHeight = window.innerHeight - 169;
    const {
      configValue,
      fullScreen,
      workspace
    } = this.state;
    let formatCode = {};
    try {
      formatCode = yaml.load(configValue);
    } catch (e) { }
    return (
      <div className="publish-container">
        <div
          className={fullScreen ? 'publish-data-part full-screen-view' : 'publish-data-part'}
          style={{ height: contentHeight, overflow: "hidden" }}
        >
          <div
            className="left-part"
            style={{ height: contentHeight, overflow: "hidden" }}
          >
            <If condition={workspace}>
              <div style={{ height: contentHeight, overflow: "auto" }} className="edit-form-container">
                <ProjectPannel
                  ref={(ref) => (this.projectPannel = ref)}
                  configValue={formatCode}
                  workspace={workspace}
                  chooseNewWrokspace={this.chooseNewWrokspace}
                  setConfigValue={(values) => { const configValue = yaml.dump(values); this.setConfigValue(configValue) }}
                  defaultDescription={DEFAULT_DESCRIPTION}
                />
              </div>
            </If>
            <If condition={!workspace}>
              <div style={{ display: 'block', marginTop: -100, top: '50%', height: 200, position: 'absolute', left: 0, right: 0 }}>
                <div style={{ textAlign: 'center', marginBottom: 8 }}>  <Button type="primary" onClick={() => this.getWorksapce()}><Icon type="edit" />打开工作空间</Button></div>
                <div style={{ textAlign: 'center' }}>您可以选择包含publish.yaml的目录进行配置</div>
              </div>
            </If>
          </div>
          <If condition={workspace}>
            <div className="right-part">
              <Editor
                height={contentHeight}
                code={configValue}
                setConfigValue={this.setConfigValue}
              />
            </div>
          </If>
        </div>
        <If condition={workspace}>
          <div className="publish-footer">
            {/* <Button
            type="primary"
            className="publish-btn active"
            onClick={() => this.publishProject()}
            style={{ marginRight: 10 }}
          >
            <Translation>发布</Translation>
          </Button> */}
            <Button
              className="publish-btn"
              type='secondary'
              onClick={() => this.savePublishConfig()}
              style={{ marginRight: 10 }}
            >
              <Translation>保存配置</Translation>
            </Button>
          </div>
        </If>
        {/* <Dialog
          title={title}
          shouldUpdatePosition
          onClose={this.closeDialog}
          footer={<div style={{ width: "100%", textAlign: "right" }} />}
          visible={visible}
        >
          <div style={{ width: 600 }}>
            <If condition={moreInfo}>
              <div>{moreInfo}</div>
            </If>
            <If condition={content}>
              <div dangerouslySetInnerHTML={{ __html: content }} className="code-block-container" />
            </If>
          </div>
        </Dialog> */}
      </div>
    );
  }
}

export default Publish;
