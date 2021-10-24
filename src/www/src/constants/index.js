export const GENERIC_ARR_REG = new RegExp(/(.*)\[(\d{1,})\]/, "i");
export const PROVIDER_LIST = [
  {
    label: "Alibaba Cloud",
    value: "alibaba",
  },
  {
    label: "AWS",
    value: "aws",
  },
  {
    label: "Azure",
    value: "azure",
  },
  {
    label: "Baidu Cloud",
    value: "baidu",
  },
  {
    label: "Google Cloud",
    value: "google",
  },
  {
    label: "Huawei Cloud",
    value: "huawei",
  },
  {
    label: "Tencent Cloud",
    value: "tencent",
  },
];



export const FOTM_ITEM_LAYOUT = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: { span: 18 },
};

export const PUBLISH_FOTM_ITEM_LAYOUT = {
  labelCol: {
    fixedSpan: 6,
  },
  wrapperCol: { span: 18 },
};

export const PROVIDER_MAP = {
  alibaba: ["AccountID", "AccessKeyID", "AccessKeySecret"],
  aws: ["AccessKeyID", "SecretAccessKey"],
  baidu: ["AccessKeyID", "SecretAccessKey"],
  huawei: ["AccessKeyID", "SecretAccessKey"],
  azure: ["KeyVaultName", "TenantId", "ClientId", "ClientSecret"],
  tencent: ["AccountID", "SecretID", "SecretKey"],
  google: ["PrivateKeyData"],
};



export const PUBLISH_COMPONENT_TEMPLATE = {

}


export const APP_CATEGORY = [
  {
    value: '其它',
    label: '其它'
  }, {
    value: '云应用',
    label: '云应用'
  }, {
    value: 'Web框架',
    label: 'Web框架'
  }, {
    value: '全栈应用',
    label: '全栈应用'
  }, {
    value: '人工智能',
    label: '人工智能'
  }, {
    value: '音视频处理',
    label: '音视频处理'
  }, {
    value: '图文处理',
    label: '图文处理'
  }, {
    value: '监控告警',
    label: '监控告警'
  }, {
    value: '大数据',
    label: '大数据'
  }, {
    value: 'IoT',
    label: 'IoT'
  }, {
    value: '新手入门',
    label: '新手入门'
  }, {
    value: '基础云产品',
    label: '基础云产品'
  }
];


export const REGION_LIST = [{
  value: 'cn-hangzhou',
  label: '杭州'
},{
  value: 'cn-shenzhen',
  label: '深圳'
},{
  value: 'cn-beijing',
  label: '北京'
},{
  value: 'cn-shanghai',
  label: '上海'
}]

export const RESOURCE_MAP = {
  fc: {
    label: '函数计算',
    icon: 'fc',
    productLink: 'https://www.aliyun.com/product/fc?spm=5176.10695662.1112509.1.703843573wugX2', //产品链接
    consoleLink:'https://fcnext.console.aliyun.com/', //控制台链接
    content: {
      service: {
        label: '服务',
      },
      function: {
        label: '函数'
      },
      region: {
        label: '地域'
      }
    }
  }
}