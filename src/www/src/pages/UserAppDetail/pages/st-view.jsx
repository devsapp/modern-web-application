import React, { Component } from "react";
import _ from "loadsh";
import { Button, Input, Form, Select, Field, Icon, NumberPicker } from "@b-design/ui";
import BoxContaier from '../../../components/box-container';
import StDialog from './st-action/st-dialog';
import AccessConfig from '../../ProjectConfig/components/access-config';
import TerminalDialog from '../../../components/terminal-dialog';
import { REGION_LIST } from '../../../constants';
import { openLinks } from '../../../utils/url';
import request from '../../../utils/request';
import "../index.scss";



const FUNCTION_LIST = [{
  label: 'http函数',
  value: 'http'
}, {
  label: '事件函数',
  value: 'event'
}]
function SLoading() {
  return <div className="execute-loading-container">
    <div className="execute-loading" />
    <span className="loading-word">压测中请稍后</span>
  </div>
}
export default class STView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appList: [],
      reportList: [],
      currentContent: '',
      currentReportValue: '',
      visible: false,
      services: [],
      functions: [],
      domains: [],
      executeDialogVisible: false,
      executeTitle: '',
      executeInfo: '',
      executeEnd: false,
    }
    this.field = new Field(this, {
      onChange: (name) => {
        if (name === 'region' || name === 'access' || name === 'functionType') {
          const data = this.field.getValues();
          if (data['functionType'] !== 'http') {
            const { region, access } = data;
            this.getServices(region, access);
          }

          if (data['functionType'] === 'http') {
            this.field.remove('serviceName');
            this.field.remove('functionName');
            const { region, access } = data;
            this.getDomains(region, access)
          }
          if(data['functionType'] === 'event') {
            this.field.remove('url');
            this.field.remove('method');
          }
        }
        if (name === 'serviceName') {
          const data = this.field.getValues();
          const { region, access, serviceName } = data;
          this.getFunctions(region, access, serviceName)
        }
      }
    });
    this.field.setValue('functionType', 'http');
  }

  componentDidMount = async () => {
    this.getAccess();
    this.getReports();
    this.getDomains();
  }


  getAccess = async () => {
    const accessResult = await request('accessCenter/getAccess');
    const accessInfo = accessResult.data;
    this.setState({
      accessInfo
    })
  }

  getServices = async (region, access) => {
    const result = await request('userCenter/getUserServices', { region, access });
    if (result.code === 200) {
      this.field.setValue('functioName', '')
      this.setState({
        services: result.data
      })
    }
  }

  getFunctions = async (region, access, serviceName) => {
    const result = await request('userCenter/getUserFunctions', { region, access, serviceName });
    if (result.code === 200) {
      this.setState({
        functions: result.data
      })
    }
  }

  getReports = async () => {
    const result = await request('stressCenter/getLocalReport');
    const { code, data = {} } = result;
    if (code === 200) {
      const { reportList, currentContent, currentReportValue } = data;
      this.setState({
        reportList,
        currentContent,
        currentReportValue
      })
    }
  }

  getDomains = async (region, access) => {
    if (region && access) {
      const result = await request('userCenter/getUserDomains', { access, region });
      if (result.code === 200) {
        this.setState({
          domains: result.data
        })
      }
    }

  }

  choosedReport = async (currentReportValue) => {
    this.setState({
      currentReportValue
    })
    const result = await request('stressCenter/getCurrentReportContent', { reportName: currentReportValue });
    if (result.code === 200) {
      this.setState({
        currentContent: result.data
      })
    }
  }


  openAccessDialog = () => {
    this.setState({
      visible: true
    })
  }

  closeAccessDialog = () => {
    this.setState({
      visible: false
    })
  }

  refreshData = () => {
    this.getReports();
  }

  executeCommand = async (data) => {

    await request('stressCenter/stressApp', data, this.renderExecuteInfo);
  }

  openExecuteDialog = () => {
    this.setState({
      executeDialogVisible: true,
      executeTitle: '开始执行',
      executeInfo: '',
      executeEnd: false
    })
  }

  setExecuteInfoContent = (executeInfo) => {
    this.setState({
      executeInfo,
      executeTitle: <SLoading />
    })
  }

  endExecute = () => {
    this.setState({
      executeEnd: true,
      executeTitle: '压测结束'
    });
    this.getReports();
  }

  closeExecuteDialog = () => {
    this.setState({
      executeDialogVisible: false,
    })
  }


  renderExecuteInfo = (data) => {
    switch (data.status) {
      case -1:
        break;
      case 1:
        this.openExecuteDialog();
        break;
      case 2:
        this.setExecuteInfoContent(data.result);
        break;
      case 3:
        this.endExecute();
        break;
      case 4:
      default:
        break;
    }
  }

  action = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        return;
      };
      this.executeCommand(values);
      // let sCommand = ''
      // const functionType = values['functionType'];
      // if (functionType === 'http') {
      //   sCommand = `s cli /Users/hanxie/opensource/devsapp/fc-stress start --region ${values.region} --access ${values.access} --num-user ${values['numUser']} --spawn-rate ${values['spawnRate'] || ''} --run-time ${values['runningTime']} --function-type ${functionType} --url ${values.url} --method ${values.method}  --payload ${values.payload || ''}`
      // }
      // if (functionType === 'event') {
      //   sCommand = `s cli fc-stress start --num-user ${values['numUser']} --spawn-rate ${values['spawnRate'] || ''} --run-time ${values['runningTime']}
      //   --function-type ${functionType} --service-name ${values['serviceName']} --function-name ${values['functionName']}
      //   --payload  ${values.payload || ''} --region ${values.region} --access ${values.access}`
      // }
      // this.terminal.openAndExecuteCommand(`${sCommand} \n`);
    })
  }

  render() {
    const { reportList, currentContent, currentReportValue, accessInfo, visible, domains, functions, services, executeDialogVisible, executeInfo, executeTitle, executeEnd } = this.state;
    const confusedAccessInfo = _.get(accessInfo, 'confusedAccessInfo', {});
    const hasAccess = Object.keys(confusedAccessInfo).length > 0;

    return (
      <React.Fragment>
        <div className="st-container">
          <div className="st-left">
            <div className="test-config-title">
              <span className="word">压测项 <strong style={{ marginLeft: 20, fontSize: '12px', color: 'red' }}> 压测可能会产生云上资费，请注意</strong></span>
              <Button type="primary" className="test-btn" onClick={this.action}>启动压测</Button>
            </div>
            <div className="test-config" style={{ height: window.innerHeight - 200, overflowY: 'auto' }}>
              <Form field={this.field}>
                <BoxContaier title="基本配置" desc="配置发起压测需要的基本信息，如秘钥，服务，函数">
                  <div>
                    <Form.Item
                      label={'选择函数类型'}
                      labelTextAlign="left"
                      required>
                      <Select dataSource={FUNCTION_LIST} style={{ width: '100%' }} name="functionType" defaultValue="http" />
                    </Form.Item>
                    <If condition={hasAccess}>
                      <Form.Item label="秘钥信息:" required requiredMessage="秘钥信息必填">
                        <Select
                          name="access"
                          dataSource={Object.keys(confusedAccessInfo).map(key => ({ key, value: key }))}
                          style={{ width: '50%', marginRight: 10 }} />
                        <Button type='secondary' onClick={this.openAccessDialog}>
                          <Icon type="add" /> 添加秘钥
                            </Button>
                      </Form.Item>
                    </If>
                    <If condition={!hasAccess}>
                      <Form.Item label="秘钥信息:" required requiredMessage="秘钥信息必填">
                        <Input name="access" htmlType="hidden" />
                        <Button type="primary" style={{ width: '100%' }} onClick={this.openAccessDialog}>新建秘钥</Button>
                      </Form.Item>
                    </If>
                    <Form.Item
                      label={'选择地域'}
                      labelTextAlign="left"
                      requiredMessage="请选择地域"
                      required>
                      <Select dataSource={REGION_LIST} style={{ width: '100%' }} name="region" defaultValue="cn-hangzhou" />
                    </Form.Item>

                    <If condition={this.field.getValue('functionType') === 'http'}>
                      <Form.Item
                        label={'压测URL'}
                        labelTextAlign="left"
                        requiredMessage="请输入所要压测的URL"
                        required>

                        <Select.AutoComplete dataSource={domains} style={{ width: '100%' }} name="url" />
                      </Form.Item>
                      <Form.Item
                        label={'请求类型'}
                        labelTextAlign="left"
                        required>
                        <Select dataSource={[{ label: 'GET', value: 'GET' }, { label: 'POST', value: 'POST' }]} style={{ width: '100%' }} name="method" defaultValue="GET" />
                      </Form.Item>
                    </If>
                    <If condition={this.field.getValue('functionType') === 'event'}>
                      <Form.Item
                        label={'服务'}
                        labelTextAlign="left"
                        requiredMessage="服务必填"
                        required>
                        <Select.AutoComplete dataSource={services} style={{ width: '100%' }} name="serviceName" />
                      </Form.Item>
                      <Form.Item
                        label={'函数'}
                        requiredMessage="函数必填"
                        labelTextAlign="left"
                        required>

                        <Select.AutoComplete dataSource={functions} style={{ width: '100%' }} name="functionName" />
                      </Form.Item>

                    </If>
                    <Form.Item
                      label={'请求内容'}
                      labelTextAlign="left"
                    >
                      <Input.TextArea name="payload" style={{ width: '100%' }} defaultValue="" />
                    </Form.Item>
                    <AccessConfig visible={visible} onClose={this.closeAccessDialog} confusedAccessInfo={confusedAccessInfo} refreshAccessData={this.getAccess} />
                  </div>
                </BoxContaier>
                <BoxContaier title="施压配置" desc="配置施压信息">
                  <div>
                    <Form.Item
                      label={'模拟压测的用户数'}
                      labelTextAlign="left"
                      requiredMessage="请填写压测用户数"
                      required>
                      <NumberPicker name="numUser" type="inline" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      label={'每秒产生的用户数'}
                      labelTextAlign="left"
                    >
                      <NumberPicker name="spawnRate" type="inline" style={{ width: '100%' }} />
                    </Form.Item>
                    <Form.Item
                      label={'压测时间（s）'}
                      labelTextAlign="left"
                      requiredMessage="请填写压测时间"
                      required>
                      <NumberPicker name="runningTime" type="inline" style={{ width: '100%' }} />
                    </Form.Item>
                  </div>
                </BoxContaier>

              </Form>
              <StDialog visible={executeDialogVisible} data={{ executeInfo, executeTitle, executeEnd }}
                closeExecuteDialog={this.closeExecuteDialog} />
              <TerminalDialog ref={(ref) => this.terminal = ref} closeTerminalCallback={this.refreshData} />
            </div>
          </div>
          <div className="st-right">

            <div className="test-config-title">
              <span className="word">压测结果</span>
              <span style={{ marginLeft: 24 }}>压测报告选择：</span><Select dataSource={reportList} value={currentReportValue} onChange={(value) => this.choosedReport(value)} style={{ marginLeft: 8, width: 200 }} />
              <span onClick={() => openLinks('https://www.aliyun.com/product/pts?spm=5176.10695662.8115314850.1.459b5ba5hpnegi')} style={{ marginLeft: 12, textDecoration: 'underline', cursor: 'pointer' }}>需要全链路压测能力？【点击查看PTS】</span>
            </div>
            <div className="test-result" style={{ height: window.innerHeight - 200, overflowY: 'auto' }}>
              <If condition={currentContent}>
                <iframe srcDoc={currentContent} style={{ height: '100%', width: '100%', border: 'none' }} width='100%' frameBorder={0} allowFullScreen />
              </If>
              <If condition={!currentContent}>

                <div className="empty-view">暂无压测报告</div>
              </If>

            </div>

          </div>
        </div>

      </React.Fragment>
    );
  }
}
