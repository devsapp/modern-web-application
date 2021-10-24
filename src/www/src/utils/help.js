
import moment from 'moment';

export const ISPERSERT = true;
export const ISFUNCMETRICSACTIVE = true;
export const ISFLOATRIGHT = true;
export const ISFUNCTIONINSTANCEMETRICES = true;
export const SIZEROW1 = 1;
export const SIZEROW2 = 2;
export const WIDTH95 = 95;
export const WIDTH100 = 100;
export const WIDTH105 = 105;
export const WIDTH110 = 110;
export const WIDTH120 = 120;
export const WIDTH124 = 124;
export const WIDTH130 = 130;
export const WIDTH144 = 144;
export const WIDTH150 = 150;
export const WIDTH164 = 164;
export const WIDTH175 = 175;
export const WIDTH190 = 190;
export const WIDTH200 = 200;
export const WIDTH210 = 210;
export const WIDTH230 = 230;
export const WIDTH310 = 310;

export const COLORFFF = '#fff';
export const COLOR333 = '#333';
export const COLORTAG = '#d42a22';
export const BGCOLORTAG = 'rgb(255 206 206)';
export const BGCOLORF5F5F5 = '#F5F5F5';
export const BGCOLORABC0E6 = '#adc0e6';
export const BGCOLOR0BB27B = '#0BB27B';
export const BGCOLORD93026 = '#D93026';

const unitList = ['K', 'M', 'G', 'T', 'P', 'E'];
const unitData = {
  K: 1000,
  M: 1000000,
  G: 1000000000,
  T: 1000000000000,
  P: 1000000000000000,
  E: 1000000000000000000,
};

/**
 * @description 处理数字为K,M,G,T,P,E
 *  {K:千, M:百万,G:10亿,T:兆，P：千兆:E:百京}
 * @param {Number} val 要处理的数字
 * @param {Number} num 保留几位小数，1000表示3位, 1表是不保留小数
 */
export function publicComputeUnit(val, num = 1000, unit = -1, initUnit) {
  if (val) {
    // 固定单位
    const initNum = unitData[initUnit];
    if (initUnit && initNum) {
      return `${Math.round(((val - 0) / initNum) * num) / num}${initUnit}`;
    }

    // 自适应单位
    if (parseInt(val, 10) >= 1000 && unit < 5) {
      const currentVal = Math.round(val - 0) / 1000;
      const unitTmp = unit + 1;
      return publicComputeUnit(currentVal, num, unitTmp);
    }
    if (unit >= 0) {
      return `${Math.round((val - 0) * num) / num}${unitList[unit]}`;
    }
    return Math.round((val - 0) * num) / num;
  }
  return 0;
}

// 获取metrics入参数
export function getMetricsNames(...args) {
    const metricsList = [];
    args.forEach((item) => {
        if (item.metricName) {
            metricsList.push(item.metricName);
        }
    });
    return metricsList;
}

// 映射qulifer是ALL的指标名称字段
export const mapTargetTOALL = {
    ServiceQualifierTotalInvocations: 'ServiceTotalInvocations',
  
    ServiceQualifierServerErrors: 'ServiceServerErrors',
    ServiceQualifierClientErrors: 'ServiceClientErrors',
    ServiceQualifierFunctionErrors: 'ServiceFunctionErrors',
  
    ServiceQualifierThrottles: 'ServiceThrottles',
    ServiceQualifierResourceThrottles: 'ServiceResourceThrottles',
  
    FunctionQualifierTotalInvocations: 'FunctionTotalInvocations',
    FunctionQualifierProvisionInvocations: 'FunctionProvisionInvocations',
  
    FunctionQualifierServerErrors: 'FunctionServerErrors',
    FunctionQualifierClientErrors: 'FunctionClientErrors',
    FunctionQualifierFunctionErrors: 'FunctionFunctionErrors',
  
    FunctionQualifierConcurrencyThrottles: 'FunctionConcurrencyThrottles',
    FunctionQualifierResourceThrottles: 'FunctionResourceThrottles',
  
    FunctionQualifierAvgDuration: 'FunctionAvgDuration',
    FunctionQualifierMaxDuration: 'FunctionMaxDuration',
  
    FunctionQualifierLatencyAvg: 'FunctionLatencyAvg',
    FunctionQualifierLatencyMax: 'FunctionLatencyMax',
  
    FunctionQualifierMaxMemoryUsage: 'FunctionMaxMemoryUsage',
  
    FunctionQualifierOndemandInstanceQuota: 'FunctionOndemandInstanceQuota',
    FunctionQualifierOndemandActiveInstance: 'FunctionOndemandActiveInstance',
  
    FunctionQualifierProvisionedCurrentInstance: 'FunctionProvisionedCurrentInstance',
  
    RegionConcurrencyLimit: 'RegionConcurrencyLimit',
    RegionConcurrentCount: 'RegionConcurrentCount',
  
    FunctionQualifierCost: 'FunctionCost',
  
    FunctionQualifierAsyncEventExpiredDropped: 'FunctionAsyncEventExpiredDropped',
    FunctionQualifierDestinationErrors: 'FunctionDestinationErrors',
    FunctionQualifierDestinationSucceeded: 'FunctionDestinationSucceeded',
  
    InstanceConcurrentRequests: 'InstanceConcurrentRequests',
    InstanceCPUQuotaPercent: 'InstanceCPUQuotaPercent',
  
    InstanceCPUPercent: 'InstanceCPUPercent',
  
    InstanceMemoryLimitMB: 'InstanceMemoryLimitMB',
    InstanceMemoryUsageMB: 'InstanceMemoryUsageMB',
  
    InstanceMemoryUsagePercent: 'InstanceMemoryUsagePercent',
  
    InstanceRxBytesPerSecond: 'InstanceRxBytesPerSecond',
    InstanceTxBytesPerSecond: 'InstanceTxBytesPerSecond',
  
    FunctionQualifierEnqueueCount: 'FunctionEnqueueCount',
    FunctionQualifierDequeueCount: 'FunctionDequeueCount',
  
    FunctionQualifierAsyncMessageLatencyAvg: 'FunctionAsyncMessageLatencyAvg',
    FunctionQualifierAsyncMessageLatencyMax: 'FunctionAsyncMessageLatencyMax',
  };

// 获取不同qulifer时候，接口的入参指标
export function getApiMetricsTaget(qualifier, metricsNameList) {
    if (!qualifier || qualifier === 'ALL') {
        try {
            return metricsNameList.map(item => mapTargetTOALL[item]);
        } catch (e) {
            throw `指标不存在,请检查:${metricName}`;
        }
    } else {
        return metricsNameList;
    }
}

/**
 * 函数级别文案--
 * 函数执行(次)
 */

// 调用次数
export const functionCallsNameList = [
    { metricName: 'FunctionQualifierTotalInvocations', legendName: ('函数总调用'), colorPrimary: '#0881FE' },
    { metricName: 'FunctionQualifierProvisionInvocations', legendName: ('基于预留实例的调用'), colorPrimary: '#5ad8a6' },
];
// 错误次数(次)
export const functionErrorNameList = [
    { metricName: 'FunctionQualifierServerErrors', legendName: ('服务端错误'), colorPrimary: '#751616' },
    { metricName: 'FunctionQualifierClientErrors', legendName: ('客户端错误'), colorPrimary: '#E44F2F' },
    { metricName: 'FunctionQualifierFunctionErrors', legendName: ('函数错误'), colorPrimary: '#E44390' },
];
// 流控错误(次)
export const flowControlNameLIst = [
    { metricName: 'FunctionQualifierConcurrencyThrottles', legendName: ('并发实例超上限'), colorPrimary: '#826AF9' },
    { metricName: 'FunctionQualifierResourceThrottles', legendName: ('实例总数超上限'), colorPrimary: '#0881FE' },
];
// 函数执行时间(ms)
export const timeDuationNameLIst = [
    { metricName: 'FunctionQualifierAvgDuration', legendName: ('平均时间'), colorPrimary: '#0881FE' },
    { metricName: 'FunctionQualifierMaxDuration', legendName: ('最大时间'), colorPrimary: '#FF7E4F' },
];
// 端到端延时(ms)
export const n2nDuationNameLIst = [
    { metricName: 'FunctionQualifierLatencyAvg', legendName: ('平均延时'), colorPrimary: '#0881FE' },
    { metricName: 'FunctionQualifierLatencyMax', legendName: ('最大延时'), colorPrimary: '#FF7E4F' },
];
// 内存消耗(MB)
export const memoryUsageNameList = [
    { metricName: 'FunctionQualifierMaxMemoryUsage', legendName: ('最大消耗内存'), colorPrimary: '#FF7E4F' },
];
// 函数按量实例数(个)
export const funcOndemandNameList = [
    { metricName: 'FunctionQualifierOndemandInstanceQuota', legendName: ('函数按量实例上限'), colorPrimary: '#FF7E4F' },
    { metricName: 'FunctionQualifierOndemandActiveInstance', legendName: ('函数已使用按量实例数'), colorPrimary: '#2BABA8' },
];
// 函数预留实例数(个)
export const funcProvisionedNameList = [
    { metricName: 'FunctionQualifierProvisionedCurrentInstance', legendName: ('函数预留实例数'), colorPrimary: '#2BABA8' },
];

// 资源使用量(MB*ms)
export const functionCostNameList = [
    { metricName: 'FunctionQualifierCost', legendName: ('使用量'), colorPrimary: '#0881FE' },
];
// 异步调用触发事件(个)
export const destinationNameList = [
    { metricName: 'FunctionQualifierAsyncEventExpiredDropped', legendName: ('超时丢弃'), colorPrimary: '#E44390' },
    { metricName: 'FunctionQualifierDestinationErrors', legendName: ('目标触发失败'), colorPrimary: '#E44F2F' },
    { metricName: 'FunctionQualifierDestinationSucceeded', legendName: ('目标触发成功'), colorPrimary: '#5ad8a6' },
];
// 异步调用处理情况(个)
export const asyncCallSitatuNameList = [
    { metricName: 'FunctionQualifierEnqueueCount', legendName: ('请求入队'), colorPrimary: '#FF7E4F' },
    { metricName: 'FunctionQualifierDequeueCount', legendName: ('请求处理完成'), colorPrimary: '#2BABA8' },
];

// 异步异步消息处理时间(ms)
export const asyncMessageLatencyNameList = [
    { metricName: 'FunctionQualifierAsyncMessageLatencyAvg', legendName: ('平均时间'), colorPrimary: '#0881FE' },
    { metricName: 'FunctionQualifierAsyncMessageLatencyMax', legendName: ('最大时间'), colorPrimary: '#FF7E4F' },
];

/**
 * 指标图表开始
 */

// 并发请求数(个）
export const caseConcurrencyRequestNameList = [
    { metricName: 'InstanceConcurrentRequests', legendName: ('并发请求数'), colorPrimary: '#2BABA8' },
];
// CPU使用情况(%)
export const caseCPUNameList = [
    { metricName: 'InstanceCPUQuotaPercent', legendName: ('CPU配额'), colorPrimary: '#FF7E4F' },
    { metricName: 'InstanceCPUPercent', legendName: ('CPU使用情况'), colorPrimary: '#2BABA8' },
];
// 内存受用情况(MB)
export const caseMemoryUseNameList = [
    { metricName: 'InstanceMemoryLimitMB', legendName: ('内存配额'), colorPrimary: '#FF7E4F' },
    { metricName: 'InstanceMemoryUsageMB', legendName: ('已使用内存'), colorPrimary: '#2BABA8' },
];
// 内存使用率(%)
export const caseMemoryUtilizationNameList = [
    { metricName: 'InstanceMemoryUsagePercent', legendName: ('内存使用率'), colorPrimary: '#FF7E4F' },
];
// 网络流量(Bytes)
export const caseNetFlowByteNameList = [
    { metricName: 'InstanceRxBytesPerSecond', legendName: ('入网流量'), colorPrimary: '#0881FE' },
    { metricName: 'InstanceTxBytesPerSecond', legendName: ('出网流量'), colorPrimary: '#2BABA8' },
];

/**
 * 指标图表结束
 */

// 区域按量实例数(个)
export const reginConcurrencyNameList = [
    { metricName: 'RegionConcurrencyLimit', legendName: ('区域按量实例上限'), colorPrimary: '#FF7E4F' },
    { metricName: 'RegionConcurrentCount', legendName: ('区域已使用按量实例数'), colorPrimary: '#2BABA8' },
  ];
  

export const metricLegendListAll = [

    { metricName: 'RegionTotalInvocations', legendName: ('调用次数'), colorPrimary: '#0881FE' },
    { metricName: 'RegionServerErrors', legendName: ('服务端错误'), colorPrimary: '#751616' },
    { metricName: 'RegionClientErrors', legendName: ('客户端错误'), colorPrimary: '#E44F2F' },
    { metricName: 'RegionFunctionErrors', legendName: ('函数错误'), colorPrimary: '#E44390' },

    { metricName: 'ServiceConcurrencyLimit', legendName: ('fc.dashboard.concurrent.max.label'), colorPrimary: '#FF7E4F' },
    { metricName: 'ServiceConcurrentCount', legendName: ('fc.dashboard.functionConcurrentCount.lable'), colorPrimary: '#0881FE' },

    { metricName: 'ServiceConcurrentCount', legendName: ('fc.dashboard.function.serviceConcurrentTol'), colorPrimary: '#2BABA8' },

    { metricName: 'FunctionTotalInvocations', legendName: ('函数总调用'), colorPrimary: '#0881FE' },
    { metricName: 'FunctionProvisionInvocations', legendName: ('基于预留实例的调用'), colorPrimary: '#5ad8a6' },

    { metricName: 'FunctionServerErrors', legendName: ('服务端错误'), colorPrimary: '#751616' },
    { metricName: 'FunctionClientErrors', legendName: ('客户端错误'), colorPrimary: '#E44F2F' },
    { metricName: 'FunctionFunctionErrors', legendName: ('函数错误'), colorPrimary: '#E44390' },

    { metricName: 'FunctionConcurrencyThrottles', legendName: ('并发实例超上限'), colorPrimary: '#826AF9' },
    { metricName: 'FunctionResourceThrottles', legendName: ('实例总数超上限'), colorPrimary: '#0881FE' },

    { metricName: 'FunctionAvgDuration', legendName: ('平均时间'), colorPrimary: '#0881FE' },
    { metricName: 'FunctionMaxDuration', legendName: ('最大时间'), colorPrimary: '#FF7E4F' },

    { metricName: 'FunctionLatencyAvg', legendName: ('平均延时'), colorPrimary: '#0881FE' },
    { metricName: 'FunctionLatencyMax', legendName: ('最大延时'), colorPrimary: '#FF7E4F' },

    { metricName: 'FunctionMaxMemoryUsage', legendName: ('最大消耗内存'), colorPrimary: '#FF7E4F' },

    { metricName: 'FunctionOndemandInstanceQuota', legendName: ('函数按量实例上限'), colorPrimary: '#FF7E4F' },
    { metricName: 'FunctionOndemandActiveInstance', legendName: ('函数已使用按量实例数'), colorPrimary: '#2BABA8' },

    { metricName: 'FunctionProvisionedCurrentInstance', legendName: ('函数预留实例数'), colorPrimary: '#2BABA8' },
    { metricName: 'FunctionTotalActiveInstance', legendName: ('fc.dashboard.function.functionProvisionedAlreadyCurrentInstance'), colorPrimary: '#0881FE' },

    { metricName: 'RegionConcurrencyLimit', legendName: ('区域按量实例上限'), colorPrimary: '#FF7E4F' },
    { metricName: 'RegionConcurrentCount', legendName: ('区域已使用按量实例数'), colorPrimary: '#2BABA8' },

    { metricName: 'FunctionCost', legendName: ('使用量'), colorPrimary: '#0881FE' },

    { metricName: 'FunctionAsyncEventExpiredDropped', legendName: ('超时丢弃'), colorPrimary: '#E44390' },
    { metricName: 'FunctionDestinationErrors', legendName: ('目标触发失败'), colorPrimary: '#E44F2F' },
    { metricName: 'FunctionDestinationSucceeded', legendName: ('目标触发成功'), colorPrimary: '#5ad8a6' },

    { metricName: 'FunctionQualifierEnqueueCount', legendName: ('请求入队'), colorPrimary: '#FF7E4F' },
    { metricName: 'FunctionQualifierDequeueCount', legendName: ('请求处理完成'), colorPrimary: '#2BABA8' },

    { metricName: 'FunctionQualifierAsyncMessageLatencyAvg', legendName: ('平均时间'), colorPrimary: '#0881FE' },
    { metricName: 'FunctionQualifierAsyncMessageLatencyMax', legendName: ('最大时间'), colorPrimary: '#FF7E4F' },

    { metricName: '', legendName: ('fc.dashboard.case.concurrentLimit'), colorPrimary: '#FF7E4F' },
    { metricName: '', legendName: ('并发请求数'), colorPrimary: '#2BABA8' },
    // CPU使用情况(%)
    { metricName: '', legendName: ('CPU配额'), colorPrimary: '#FF7E4F' },
    { metricName: '', legendName: ('CPU使用情况'), colorPrimary: '#2BABA8' },
    // 内存受用情况(MB)
    { metricName: '', legendName: ('内存配额'), colorPrimary: '#FF7E4F' },
    { metricName: '', legendName: ('已使用内存'), colorPrimary: '#2BABA8' },
    // 内存使用率(%)
    { metricName: '', legendName: ('内存使用率'), colorPrimary: '#FF7E4F' },
    // 网络流量(Bytes)
    { metricName: '', legendName: ('入网流量'), colorPrimary: '#0881FE' },
    { metricName: '', legendName: ('出网流量'), colorPrimary: '#2BABA8' },
];


// 函数级别的Metrics
export function getFunctionMetricsPartOne(params, nameListPartOne, response) {
    const {
        FunctionQualifierTotalInvocations,
        FunctionQualifierProvisionInvocations,
        FunctionQualifierServerErrors,
        FunctionQualifierClientErrors,
        FunctionQualifierFunctionErrors,
        FunctionQualifierConcurrencyThrottles,
        FunctionQualifierResourceThrottles,
        FunctionQualifierAvgDuration,
        FunctionQualifierMaxDuration,
        FunctionQualifierLatencyAvg,
        FunctionQualifierLatencyMax,
        FunctionQualifierMaxMemoryUsage,

        FunctionTotalInvocations,
        FunctionProvisionInvocations,
        FunctionServerErrors,
        FunctionClientErrors,
        FunctionFunctionErrors,
        FunctionConcurrencyThrottles,
        FunctionResourceThrottles,
        FunctionAvgDuration,
        FunctionMaxDuration,
        FunctionLatencyAvg,
        FunctionLatencyMax,
        FunctionMaxMemoryUsage,
    } = response || {};

    const TotleInvocations = FunctionQualifierTotalInvocations || FunctionTotalInvocations || [];
    const ProvisionInvocations = FunctionQualifierProvisionInvocations || FunctionProvisionInvocations || [];
    const ServerErrors = FunctionQualifierServerErrors || FunctionServerErrors || [];
    const ClientErrors = FunctionQualifierClientErrors || FunctionClientErrors || [];
    const FunctionErrors = FunctionQualifierFunctionErrors || FunctionFunctionErrors || [];
    const ConcurrencyThrottles = FunctionQualifierConcurrencyThrottles || FunctionConcurrencyThrottles || [];
    const ResourceThrottles = FunctionQualifierResourceThrottles || FunctionResourceThrottles || [];
    const AvgDuration = FunctionQualifierAvgDuration || FunctionAvgDuration || [];
    const MaxDuration = FunctionQualifierMaxDuration || FunctionMaxDuration || [];
    const LatencyAvg = FunctionQualifierLatencyAvg || FunctionLatencyAvg || [];
    const LatencyMax = FunctionQualifierLatencyMax || FunctionLatencyMax || [];
    const MaxMemoryUsage = FunctionQualifierMaxMemoryUsage || FunctionMaxMemoryUsage || [];

    const {
        functionCallsNameList,
        functionErrorNameList,
        flowControlNameLIst,
        timeDuationNameLIst,
        n2nDuationNameLIst,
        memoryUsageNameList,
    } = nameListPartOne;
    const functionCallsMetricsData = [TotleInvocations, ProvisionInvocations];
    const functionErrorsData = [ServerErrors, ClientErrors, FunctionErrors];
    const flowControlMetricsData = [ConcurrencyThrottles, ResourceThrottles];
    const timeDuationMetricsData = [AvgDuration, MaxDuration];
    const n2nDuationMetricsData = [LatencyAvg, LatencyMax];
    const memoryMetricsData = [MaxMemoryUsage];
    return {
        getFunctionCallsMetrics: handlerNewCmsMetricsData(functionCallsMetricsData, functionCallsNameList, params),
        getFunctionErrorsMetrics: handlerNewCmsMetricsData(functionErrorsData, functionErrorNameList, params),
        getFlowControlMetrics: handlerNewCmsMetricsData(flowControlMetricsData, flowControlNameLIst, params),
        getTimeDuationMetrics: handlerNewCmsMetricsData(timeDuationMetricsData, timeDuationNameLIst, params),
        getN2NDuationMetrics: handlerNewCmsMetricsData(n2nDuationMetricsData, n2nDuationNameLIst, params),
        getMemoryMetrics: handlerNewCmsMetricsData(memoryMetricsData, memoryUsageNameList, params),
    };
}


export function getFunctionMetricsPartTwo(params, nameListPartTwo, response) {
    const {
        FunctionQualifierOndemandInstanceQuota,
        FunctionQualifierOndemandActiveInstance,
        FunctionQualifierProvisionedCurrentInstance,
        FunctionQualifierCost,
        FunctionQualifierAsyncEventExpiredDropped,
        FunctionQualifierDestinationErrors,
        FunctionQualifierDestinationSucceeded,
        RegionConcurrencyLimit,
        RegionConcurrentCount,
        FunctionQualifierEnqueueCount,
        FunctionQualifierDequeueCount,
        FunctionQualifierAsyncMessageLatencyAvg,
        FunctionQualifierAsyncMessageLatencyMax,

        FunctionOndemandInstanceQuota,
        FunctionOndemandActiveInstance,
        FunctionProvisionedCurrentInstance,
        FunctionCost,
        FunctionAsyncEventExpiredDropped,
        FunctionDestinationErrors,
        FunctionDestinationSucceeded,
        FunctionEnqueueCount,
        FunctionDequeueCount,
        FunctionAsyncMessageLatencyAvg,
        FunctionAsyncMessageLatencyMax,

    } = response || {};

    const demandInstanceQuota = FunctionQualifierOndemandInstanceQuota || FunctionOndemandInstanceQuota || [];
    const demandActiveInstance = FunctionQualifierOndemandActiveInstance || FunctionOndemandActiveInstance || [];
    const ProvisionedCurrentInstance = FunctionQualifierProvisionedCurrentInstance || FunctionProvisionedCurrentInstance || [];
    const Cost = FunctionQualifierCost || FunctionCost || [];
    const AsyncEventExpiredDropped = FunctionQualifierAsyncEventExpiredDropped || FunctionAsyncEventExpiredDropped || [];
    const DestinationErrors = FunctionQualifierDestinationErrors || FunctionDestinationErrors || [];
    const DestinationSucceeded = FunctionQualifierDestinationSucceeded || FunctionDestinationSucceeded || [];
    const ConcurrencyLimit = RegionConcurrencyLimit || [];
    const ConcurrentCount = RegionConcurrentCount || [];
    const EnqueueCount = FunctionQualifierEnqueueCount || FunctionEnqueueCount || [];
    const DequeueCount = FunctionQualifierDequeueCount || FunctionDequeueCount || [];
    const AsyncMessageLatencyAvg = FunctionQualifierAsyncMessageLatencyAvg || FunctionAsyncMessageLatencyAvg || [];
    const AsyncMessageLatencyMax = FunctionQualifierAsyncMessageLatencyMax || FunctionAsyncMessageLatencyMax || [];

    const {
        funcOndemandNameList,
        funcProvisionedNameList,
        functionCostNameList,
        destinationNameList,
        reginConcurrencyNameList,
        asyncCallSitatuNameList,
        asyncMessageLatencyNameList,
    } = nameListPartTwo;

    const funcOndemandMetricsData = [demandInstanceQuota, demandActiveInstance];
    const funcProvisionedMetricsData = [ProvisionedCurrentInstance];
    const functionCostMetricsData = [Cost];
    const destinationMetricsData = [AsyncEventExpiredDropped, DestinationErrors, DestinationSucceeded];
    const regionConcurrencMetricsData = [ConcurrencyLimit, ConcurrentCount];
    const asyncCallStitutionMetricsData = [EnqueueCount, DequeueCount];
    const asyncMessageLatencyMetricsData = [AsyncMessageLatencyAvg, AsyncMessageLatencyMax];

    return {
        getFuncOndemandMetrics: handlerNewCmsMetricsData(funcOndemandMetricsData, funcOndemandNameList, params),
        getFuncProvisionedMetrics: handlerNewCmsMetricsData(funcProvisionedMetricsData, funcProvisionedNameList, params),
        getFunctionCostMetrics: handlerNewCmsMetricsData(functionCostMetricsData, functionCostNameList, params),
        getDestinationList: handlerNewCmsMetricsData(destinationMetricsData, destinationNameList, params),
        getRegionConcurrencMetrics: handlerNewCmsMetricsData(regionConcurrencMetricsData, reginConcurrencyNameList, params),
        getAsyncCallStitutionMetrics: handlerNewCmsMetricsData(asyncCallStitutionMetricsData, asyncCallSitatuNameList, params),
        getAsyncMessageLatencyMetrics: handlerNewCmsMetricsData(asyncMessageLatencyMetricsData, asyncMessageLatencyNameList, params),
    };
}

export const keepDecimal = value => Math.floor(value * 100) / 100;

// 当数组里首位不是开始时间的话，需要将开始时间补全进去
export function aheadFrontForward(data = [{}], startTime, endTime) {
    if (!data[0] || data[0].timestamp != startTime) {
        const item = {
            Value: null,
            value: null,
            timestamp: startTime,
        };
        data.unshift(item);
    }

    if (!data[0] || data[data.length - 1].timestamp != endTime) {
        const item = {
            Value: null,
            value: null,
            timestamp: endTime,

        };
        data.push(item);
    }
    return data;
}

// 云监控返回的指标数据处理-bizchart4.0
export function handlerNewCmsMetricsData(resultPromissList = [], metricNameList = [], params) {
    const { startTime, endTime } = params;
    // 如果结果集异常则返回空
    for (const item of resultPromissList) {
        if (!item) {
            return [];
        }
    }
    const chartData = [];
    const data = resultPromissList;
    data.forEach((itemValues, index) => {
        const legendName = metricNameList[index].legendName;
        const getData = aheadFrontForward(itemValues, Number(startTime), Number(endTime));
        getData.forEach((item) => {
            item.names = legendName;
            item.value = item.Value && keepDecimal(item.Value);
            item.timestamp = moment(Number(item.timestamp)).format('YYYY-MM-DD HH:mm');
            chartData.push(item);
        });
    });
    return chartData;
}

export function isEnLanguage() {
    const config = window.ALIYUN_FC_CONSOLE_CONFIG || {};
    if (config.lang === 'en_US') {
        return true;
    }
    return false;
};

// 只有所有图表的loading是false的情况下，在展示图表数据，其他情况下，不进行图表的渲染来提高性能
export function isShowChart(chartData, loadingFlag) {
    return (!loadingFlag && chartData) || [];
}