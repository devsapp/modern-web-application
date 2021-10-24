import React, { Component, Fragment } from 'react';
import _ from 'lodash';
import LineChart from './index';
import { Card, Grid } from '@b-design/ui';
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
    isEnLanguage,
    isShowChart,
    ISFUNCMETRICSACTIVE,
    SIZEROW1,
    SIZEROW2,
    WIDTH164,
    WIDTH150,
    WIDTH144,
    WIDTH200,
    WIDTH210,
    WIDTH100,
    WIDTH110,
    WIDTH95,
} from '../../../utils/help';

export default function FunctionMetricsCharts(props) {
    const { Row, Col } = Grid;
    const {
        functionCallsMetrics = [],
        functionErrors = [],
        flowControlMetrics = [],
        timeDuationMetrics = [],
        n2nDuationMetrics = [],
        memoryMetrics = [],
        funcOndemandMetrics = [],
        funcProvisionedMetrics = [],
        functionCostMetrics = [],
        destinationMetrics = [],
        regionConcurrencMetrics = [],
        asyncMessageLatencyMetrics = [],
        caseConcurrentRequestMetrics = [],
        caseCPUMetrics = [],
        caseMemoryUseMetrics = [],
        caseMemoryUtilizationRateMetrics = [],
        caseNetFlowMetrics = [],
        asyncCallStitutionMetrics = [],
        functionPartOneMetricLoading,
        functionPartTwoMetricLoading,
    } = props.data;

    //拿到所有的图表的loading状态，只要有true的，就不展示图表
    const loadingList = [
        functionPartOneMetricLoading,
        functionPartTwoMetricLoading,
    ]
    const metricsVisible = loadingList.includes(true);

    return (
        <Fragment>

            <Row className="marginBottom20">
                <Col span={8} style={{ paddingRight: '15px' }}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'调用次数(次)'}
                            data={isShowChart(functionCallsMetrics, metricsVisible)}
                            legendList={functionCallsNameList}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW1}
                            maxWidth={isEnLanguage() ? WIDTH164 : WIDTH144}
                        />
                    </Card>
                </Col>

                <Col span={8} style={{ paddingRight: '15px' }}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'错误次数(次)'}
                            data={isShowChart(functionErrors, metricsVisible)}
                            legendList={functionErrorNameList}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW2}
                            maxWidth={WIDTH210}
                        />
                    </Card>
                </Col>

                <Col span={8} style={{ paddingRight: '15px' }}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'流控错误(次)'}
                            data={isShowChart(flowControlMetrics, metricsVisible)}
                            legendList={flowControlNameLIst}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW1}
                            maxWidth={isEnLanguage() ? WIDTH164 : WIDTH144}
                        />
                    </Card>
                </Col>
            </Row>

            <Row className="marginBottom20">
                <Col span={8} style={{ paddingRight: '15px' }}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'函数执行时间(ms)'}
                            data={isShowChart(timeDuationMetrics, metricsVisible)}
                            legendList={timeDuationNameLIst}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW1}
                            maxWidth={WIDTH95}
                        />
                    </Card>
                </Col>

                <Col span={8} style={{ paddingRight: '15px' }}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'端到端延时(ms)'}
                            data={isShowChart(n2nDuationMetrics, metricsVisible)}
                            legendList={n2nDuationNameLIst}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW1}
                            maxWidth={WIDTH95}
                        />
                    </Card>
                </Col>

                <Col span={8} style={{ paddingRight: '15px' }}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'内存消耗(MB)'}
                            data={isShowChart(memoryMetrics, metricsVisible)}
                            legendList={memoryUsageNameList}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW1}
                            maxWidth={WIDTH95}
                        />
                    </Card>
                </Col>
            </Row>



            <Row style={{ marginBottom: 20 }} gutter={20}>
                <Col span={8}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'函数按量实例数(个)'}
                            data={isShowChart(funcOndemandMetrics, metricsVisible)}
                            legendList={funcOndemandNameList}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW1}
                            maxWidth={isEnLanguage() ? WIDTH95 : WIDTH164}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'函数预留实例数(个)'}
                            data={isShowChart(funcProvisionedMetrics, metricsVisible)}
                            legendList={funcProvisionedNameList}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW1}
                            maxWidth={isEnLanguage() ? WIDTH95 : WIDTH144}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'区域按量实例数(个)'}
                            data={isShowChart(regionConcurrencMetrics, metricsVisible)}
                            legendList={reginConcurrencyNameList}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW1}
                            maxWidth={isEnLanguage() ? WIDTH95 : WIDTH164}
                        />
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginBottom: 20 }} gutter={20}>
                <Col span={8}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'资源使用量(MB*ms)'}
                            data={isShowChart(functionCostMetrics, metricsVisible)}
                            legendList={functionCostNameList}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW1}
                            maxWidth={WIDTH100}
                        />
                    </Card>
                </Col>

                <Col span={8}>
                    <Card contentHeight="auto">
                        <LineChart
                            visible={metricsVisible}
                            title={'异步调用触发事件(个)'}
                            data={isShowChart(destinationMetrics, metricsVisible)}
                            legendList={destinationNameList}
                            isActive={ISFUNCMETRICSACTIVE}
                            sizePerRow={SIZEROW2}
                            maxWidth={WIDTH200}
                        />
                    </Card>
                </Col>
            </Row>

        </Fragment>
    );

}

