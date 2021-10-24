import React, { Component } from 'react';
import { DatePicker, Select, Message, Icon, Button } from '@b-design/ui';
import moment from 'moment';
// import debounce from 'lodash/debounce'

import './index.css';

const { RangePicker } = DatePicker;
const defaultRecentList = [
  { label: '最近5分钟', value: '5minute' },
  { label: '最近15分钟', value: '15minute' },
  { label: '最近30分钟', value: '30minute' },
  { label: '最近1个小时', value: '60minute' },
  { label: '最近6个小时', value: 'hours' },
  { label: '最近1天', value: 'days' },
  { label: '最近1周', value: 'weeks' },
  { label: '最近1个', value: 'months' },
  { label: '自定义', value: 'customize' },
];

const pecentPeriod = {
  resource: {
    hours: 60,
    days: 300,
    weeks: 3600,
    getPeriod: (difference) => {
      if (difference <= 3) {
        return 60;
      }
      if (difference <= 24) {
        return 300;
      }
      return 3600;
    },
  },
  metrics: {
    hours: 60,
    days: 3600,
    weeks: 3600,
    getPeriod: (difference) => {
      if (difference <= 12) {
        return 60;
      }
      return 3600;
    },
  },
};
moment.locale('zh-cn');

class TimePickers extends Component {
  constructor(props) {
    super(props);
    const {
      recent = 'hours',
      EndTime = moment(),
      StartTime,
      Period = 60,
      pecentPeriodKey = 'metrics',
    } = props;
    this.pecentPeriodObject = pecentPeriod[pecentPeriodKey];
    this.state = {
      recent,
      endValue: EndTime || moment(),
      startValue: StartTime || moment().subtract(6, recent),
      period: Period,
    };
  }
  componentDidMount() {
    if (this.props.onRef) {
      this.props.onRef(this);
    }
  }
  getConfig = () => {
    const { endValue, startValue, period, recent } = this.state;
    const startTime = moment(startValue).valueOf();
    const endTime = moment(endValue).valueOf();

    return {
      startTime,
      endTime,
      Period: period,
      recent,
    }
  }
  onPickerChange = (dateValues) => this.setState({ startValue: dateValues[0], endValue: dateValues[1] })
  disabledDate = (date) => date.valueOf() > moment() || date.valueOf() < moment().subtract(2, 'months')
  onRangeOk = (dateValues) => {
    const startValue = moment(dateValues[0]);
    const endValue = moment(dateValues[1]);
    const difference = moment.duration(endValue - startValue, 'ms').asHours();
    if (difference === 0) {
      return Message.warning(intl('fc.time_picker.error'));
    }
    const period = this.pecentPeriodObject.getPeriod(difference);
    this.setState({
      recent: 'customize',
      startValue: dateValues[0],
      endValue: dateValues[1],
      period,
    }, () => {
      const { onRangeOk } = this.props;
      onRangeOk && onRangeOk();
    });
  }
  recentChange = (value) => {
    if (value === 'customize') {
      this.setState({ recent: value })
      return;
    }
    let Period = this.pecentPeriodObject[value];
    let startValue = moment().subtract(1, value);
    switch (value) {
      case '5minute':
        startValue = moment().subtract(5, 'minute');
        Period = this.pecentPeriodObject['hours']
        break;
      case '15minute':
        startValue = moment().subtract(15, 'minute');
        Period = this.pecentPeriodObject['hours']
        break;
      case '30minute':
        startValue = moment().subtract(30, 'minute');
        Period = this.pecentPeriodObject['hours']
        break;
      case '60minute':
        startValue = moment().subtract(60, 'minute');
        Period = this.pecentPeriodObject['hours']
        break;
      case 'hours':
        startValue = moment().subtract(6, value);
        Period = this.pecentPeriodObject['hours']
        break;
      case 'days':
        break;
      case 'weeks':
        break;
      case 'months':
        break;
    }

    const endValue = moment();
    this.setState({
      recent: value,
      period: Period,
      startValue: startValue,
      endValue: endValue
    }, () => {
      const { onRangeOk } = this.props;
      onRangeOk && onRangeOk();
    });
  }

  refreshTime = () => {
    const { recent } = this.state;
    const { onRangeOk } = this.props;
    if (recent === 'customize') {
      return onRangeOk && onRangeOk();
    }
    this.recentChange(recent);
  }

  render() {
    const { recent, endValue, startValue } = this.state;
    const { isFloatRight } = this.props;

    return (
      <div>
        <RangePicker
          value={[startValue, endValue]}
          onChange={this.onPickerChange}
          onOk={this.onRangeOk}
          disabledDate={this.disabledDate}
          className={`marginRight`}
          showTime
          format="YYYY-MM-DD"
          showTime={{ format: 'HH:mm' }}
        />
        <Select
          value={recent}
          style={{ marginLeft: 4 }}
          dataSource={defaultRecentList}
          className={`marginRight`}
          onChange={this.recentChange}
        />
      </div>
    );
  }
}

export default TimePickers;