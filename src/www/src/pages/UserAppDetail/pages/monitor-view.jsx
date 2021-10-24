import React, { Component } from "react";
import _ from "loadsh";
import { Button, Icon, Input, Form, Select, Field, Loading } from "@b-design/ui";
import moment from 'moment';
import AccessConfig from '../../ProjectConfig/components/access-config';
import TimePicker from "../chart/TimeRangePicker";
import FunctionMetricsCharts from '../chart/FunctionMetricsCharts';
import {
  functionCallsNameList,
  functionErrorNameList,
  flowControlNameLIst,
  timeDuationNameLIst,
  n2nDuationNameLIst,
  memoryUsageNameList,
  funcOndemandNameList,
  funcProvisionedNameList,
  reginConcurrencyNameList,
  functionCostNameList,
  destinationNameList,
  asyncCallSitatuNameList,
  asyncMessageLatencyNameList,
  getMetricsNames,
  getApiMetricsTaget,
  getFunctionMetricsPartOne,
  getFunctionMetricsPartTwo,
} from '../../../utils/help';
import request from '../../../utils/request';
import { REGION_LIST } from '../../../constants';
import { getAPImonitor, getApiMonitorTwo } from '../chart/mock';
import { getParams } from '../../../utils/common';
import "../index.scss";





export default class MonitorView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      accessInfo: {},
      services: [],
      functions: [],
      visible: false,
      functionCallsMetrics: [],
      functionErrors: [],
      flowControlMetrics: [],
      timeDuationMetrics: [],
      n2nDuationMetrics: [],
      memoryMetrics: [],
      funcOndemandMetrics: [],
      funcProvisionedMetrics: [],
      functionCostMetrics: [],
      destinationMetrics: [],
      regionConcurrencMetrics: [],
      asyncMessageLatencyMetrics: [],
      caseConcurrentRequestMetrics: [],
      caseCPUMetrics: [],
      caseMemoryUseMetrics: [],
      caseMemoryUtilizationRateMetrics: [],
      caseNetFlowMetrics: [],
      asyncCallStitutionMetrics: [],
    }
    this.field = new Field(this, {
      onChange: (name) => {
        if (name === 'region' || name === 'access') {
          this.field.remove('serviceName');
          this.field.remove('functionName');
          const data = this.field.getValues();
          const { region, access } = data;
          this.getServices(region, access);
        }
        if (name === 'serviceName') {
          this.field.remove('functionName');
          const data = this.field.getValues();
          const { region, access, serviceName } = data;
          this.getFunctions(region, access, serviceName)
        }
      }
    });
  }

  componentDidMount = async () => {
    await this.getAccess(() => {
      this.getFcDetail();
    });

  }

  getAccess = async (callback) => {
    const accessResult = await request('accessCenter/getAccess');
    const accessInfo = accessResult.data;
    this.setState({
      accessInfo
    }, () => {
      callback && callback();
    })
  }

  getFcDetail = async () => {
    const workspace = getParams('workspace');
    const result = await request('userAppCenter/getResources', { workspace });

    let fc;
    if (result.code === 200) {
      try {
        fc = result.data.filter(item => item.name === 'fc')[0];
        if (fc) {
          const { access, content } = fc;
          let parsedContent = JSON.parse(content);
          const { service: serviceName, function: functionName, region } = parsedContent;
          if (access) {
            this.getServices(region, access);
          }
          if (serviceName) {
            this.getFunctions(region, access, serviceName)
          }
          if (parsedContent) {
            setTimeout(() => {
              this.field.setValue('access', access);
              this.field.setValue('region', region);
              this.field.setValue('serviceName', serviceName);
              this.field.setValue('functionName', functionName);
            }, 500);
            this.getMetricsData({ access, region, serviceName, functionName });
          }
        }

      } catch (e) {

      }

    }

  }

  getServices = async (region, access) => {
    const result = await request('userCenter/getUserServices', { region, access });
    if (result.code === 200) {
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

  openLoading = () => {
    this.setState({
      loading: true
    })
  }

  closeLoading = () => {
    this.setState({
      loading: false
    })
  }

  getMetricsData(data) {
    try {
      this.openLoading();
      const config = this.timePicker ? this.timePicker.getConfig() : {};
      const { startTime, endTime } = config;
      const { qualifier = 'LATEST' } = this.state;
      const params = Object.assign({}, { startTime, endTime, qualifier }, data);
      if (qualifier === 'ALL') {
        delete params.qualifier;
      }

      const nameListPartOne = {
        functionCallsNameList,
        functionErrorNameList,
        flowControlNameLIst,
        timeDuationNameLIst,
        n2nDuationNameLIst,
        memoryUsageNameList,
      };
      const nameListPartTwo = {
        funcOndemandNameList,
        funcProvisionedNameList,
        functionCostNameList,
        destinationNameList,
        reginConcurrencyNameList,
        asyncCallSitatuNameList,
        asyncMessageLatencyNameList,
      };

      const partOne = getMetricsNames(...functionCallsNameList, ...functionErrorNameList, ...flowControlNameLIst, ...timeDuationNameLIst, ...n2nDuationNameLIst, ...memoryUsageNameList);
      const metricsInfoOne = getApiMetricsTaget(params.qulifier, partOne);
      const partTwo = getMetricsNames(...funcOndemandNameList, ...funcProvisionedNameList, ...functionCostNameList, ...destinationNameList, ...reginConcurrencyNameList, ...asyncCallSitatuNameList, ...asyncMessageLatencyNameList);
      const metricsInfoTwo = getApiMetricsTaget(params.qulifier, partTwo);
      const metricsParamsOne = {
        params: {
          ...params,
          metrics: metricsInfoOne,
        },
      };

      const metricsParamsTwo = {
        params: {
          ...params,
          metrics: metricsInfoTwo,
        },
      };
      this.getFunctionMetricsPartOne(metricsParamsOne, nameListPartOne);
      this.getFunctionMetricsPartTwo(metricsParamsTwo, nameListPartTwo);
    } catch (e) {
      this.closeLoading();
    }

  }


  getFunctionMetricsPartOne = async (metricsParamsOne, nameListPartOne) => {
    const result = await request('userAppCenter/getMonitorData', metricsParamsOne.params);
    // const result  = getAPImonitor;
    if (result.code === 200 || result.success === true) {
      const data = getFunctionMetricsPartOne(metricsParamsOne.params, nameListPartOne, result.data);
      const { getFunctionCallsMetrics = [], getFunctionErrorsMetrics = [], getFlowControlMetrics = [], getMemoryMetrics = [], getN2NDuationMetrics = [], getTimeDuationMetrics = [] } = data;
      this.setState({
        functionCallsMetrics: getFunctionCallsMetrics,
        functionErrors: getFunctionErrorsMetrics,
        flowControlMetrics: getFlowControlMetrics,
        timeDuationMetrics: getTimeDuationMetrics,
        n2nDuationMetrics: getN2NDuationMetrics,
        memoryMetrics: getMemoryMetrics,
        functionPartOneMetricLoading: false,
        loading: false
      })
    }
  }

  getFunctionMetricsPartTwo = async (metricsParamsTwo, nameListPartTwo) => {
    const result = await request('userAppCenter/getMonitorData', metricsParamsTwo.params);
    if (result.code === 200 || result.success === true) {
      const data = getFunctionMetricsPartTwo(metricsParamsTwo.params, nameListPartTwo, result.data);
      const { getFuncOndemandMetrics = [], getFuncProvisionedMetrics = [], getFunctionCostMetrics = [], getDestinationList = [], getRegionConcurrencMetrics = [], getAsyncCallStitutionMetrics = [], getAsyncMessageLatencyMetrics = [] } = data;
      this.setState({
        funcOndemandMetrics: getFuncOndemandMetrics,
        funcProvisionedMetrics: getFuncProvisionedMetrics,
        functionCostMetrics: getFunctionCostMetrics,
        destinationMetrics: getDestinationList,
        regionConcurrencMetrics: getRegionConcurrencMetrics,
        asyncCallStitutionMetrics: getAsyncCallStitutionMetrics,
        asyncMessageLatencyMetrics: getAsyncMessageLatencyMetrics,
        functionPartTwoMetricLoading: false,
        loading: false
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

  //更新日期
  // choseMetrics = () => {
  //   this.getMetricsData();
  // }

  renderMetrics() {
    return <FunctionMetricsCharts data={{ ...this.state }} />
  }

  search = () => {
    this.field.validate((errors, values) => {
      if (errors) {
        return;
      }
      this.getMetricsData(values);

    })
  }

  render() {
    const config = this.timePicker ? this.timePicker.getConfig() : {};
    const { startTime, endTime, Period = 3600, recent } = config;
    const { accessInfo, visible, functions, services, loading } = this.state;
    const confusedAccessInfo = _.get(accessInfo, 'confusedAccessInfo', {});
    const hasAccess = Object.keys(confusedAccessInfo).length > 0;
    return (
      <React.Fragment>
        <div className="monitor-container" style={{ marginTop: 24, overflow: 'hidden', paddingBottom: 89 }}>
          <Form field={this.field} inline >
            <If condition={hasAccess}>
              <Form.Item label="秘钥信息:" required requiredMessage="秘钥信息必填" className="access-container">
                <Select
                  name="access"
                  dataSource={Object.keys(confusedAccessInfo).map(key => ({ key, value: key }))}
                  style={{ width: 120, marginRight: 10 }} />
                <span onClick={this.openAccessDialog} className="access-add-btn">
                  <Icon type="add" /> 添加秘钥
                            </span>
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
              <Select name="region" dataSource={REGION_LIST} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={'服务'}
              labelTextAlign="left"
              requiredMessage="服务必填"
              required>
              <Select.AutoComplete name="serviceName" dataSource={services} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={'函数'}
              requiredMessage="函数必填"
              labelTextAlign="left"
              required>

              <Select.AutoComplete name="functionName" dataSource={functions} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
              label={'时间'}
              requiredMessage="选择时间"
              labelTextAlign="left"
              required>
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <TimePicker
                  style={{ margin: '10px' }}
                  recent={recent}
                  StartTime={startTime && moment(Number(startTime))}
                  EndTime={endTime && moment(Number(endTime))}
                  onRef={ref => this.timePicker = ref} />
                <Button type="primary" style={{ marginLeft: 4 }} onClick={this.search}>查询</Button>
              </div>
            </Form.Item>
            <AccessConfig visible={visible} onClose={this.closeAccessDialog} confusedAccessInfo={confusedAccessInfo} refreshAccessData={this.getAccess} />
          </Form>
          < Loading tip="应用查询"
            visible={loading}
            style={{ position: 'relative', width: '100%', height: 420 }}
            indicator={<div className="load-container load8" >
              <div className="loader"></div>
            </div>}>
            {this.renderMetrics()}
          </ Loading>
        </div>
      </React.Fragment>
    );
  }
}
