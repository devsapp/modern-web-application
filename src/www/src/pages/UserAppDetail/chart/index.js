import React, { Component } from 'react';
import { Chart, LineAdvance, Axis, Legend, Tooltip } from 'bizcharts';
import _ from 'lodash';
import { Grid, Loading } from "@b-design/ui";
import moment from 'moment';
import { publicComputeUnit, metricLegendListAll, isEnLanguage } from '../../../utils/help';


const { Row, Col } = Grid;
class LineChart extends Component{
  constructor(props) {
    super(props);
    this.state = {
      filter: [],
      legendMap: {},
    };
  }

  componentDidMount() {
    const { legendList } = this.props;
    const legendMap = {};
    (legendList || []).forEach((item) => {
      legendMap[item.legendName] = true;
    });
    this.setState({
      legendMap,
    });
  }

  // 对案列置灰和选中的时候，进行相应折线图展示的处理
  handleChangeToolTip = (legendMap) => {
    const { filter } = this.state;
    const cloneFilter = _.cloneDeep(filter);
    for (const key in legendMap) {
      const idx = cloneFilter.indexOf((key));
      if (key && legendMap[key]) {
        idx != -1 && cloneFilter.splice(idx, 1);
      } else {
        cloneFilter.push(key);
      }
    }

    this.setState({
      filter: [...new Set(cloneFilter)],
    });
  };

  // 对图例进行控制选中还是置灰处理
  onLengendChange = (value, legendMap) => {
    legendMap[value] = !legendMap[value];
    // 通过filter控制元素显示隐藏
    this.chartIns.filter('names', (val) => {
      return legendMap[val] !== false;
    });
    this.handleChangeToolTip(legendMap);
    // 重新渲染，触发filter
    this.chartIns.render(true);
  };

  // 如果data是空数组或者data不存在,不需要展示图列
  getLengendDom = () => {
    const { data, legendList, sizePerRow = 2, maxWidth } = this.props;
    const { legendMap } = this.state;
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return null;
    }

    const rows = [];
    for (let i = 0; i < legendList.length; i++) {
      if (i % sizePerRow === 0) {
        rows.push([legendList[i]]);
      } else {
        rows[rows.length - 1].push(legendList[i]);
      }
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
        }}
      >
        <div style={{ width: maxWidth || sizePerRow * 100 }}>
          <div style={{ height: '40px' }}>
            {rows.map((row, index) => (
              <Row key={index}>
                {row.map((item) => (
                  <Col key={item.legendName} onClick={() => { this.onLengendChange(item.legendName, legendMap); }}>
                    <span
                      style={{
                        display: 'inline-block',
                        marginRight: 5,
                        width: 9,
                        height: 9,
                        background: legendMap[item.legendName] ? item.colorPrimary : '#ccc',
                      }}
                    />
                    <span className="marginLeft5">
                      {item.legendName}
                    </span>
                  </Col>
                ))}
              </Row>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // ToolTip联动，只对当前宽高一致的chart生效
  toolTipActive() {
    const { isActive } = this.props;
    const active = isActive ? 'someKey' : null;
    return (
      <Tooltip
        shared
        linkage={active}
      />
    );
  }

  render() {
    const { title, data, visible } = this.props;
    const { filter } = this.state;
    const scale = {
      timestamp: {
        type: 'time',
        mask: 'YYYY-MM-DD HH:mm:ss',
        ticks: data[0] && [data[0].timestamp, data[data.length - 1].timestamp] || '0',
        range: [ 0, 0.90],
      },
      value: {
        type: 'linear',
        min: 0,
        tickCount: 4,
      },
    };

    const axisLabel = {
      formatter(text) {
        return moment(text).format("MM-DD HH:mm");
      },
    };

    return (
      <Loading
        visible={visible}
        className={isEnLanguage() ? 'functionChartWraperEngLish' : 'functionChartWraperChinese'}
        style={{ width: '100%', height: visible ? 230 : 230 }}
      >
        <div style={{ fontSize: 14, fontWeight: 'bold' }}> {title} </div>
        { this.getLengendDom()}

        <Chart
          forceUpdate={false}
          onGetG2Instance={(chart) => { this.chartIns = chart; }}
          scale={scale}
          padding={[10, 20, 60, 40]}
          autoFit
          height={200}
          data={data || []}
          placeholder={<div style={{ position: 'relative', top: '48%', textAlign: 'center' }}>无数据</div>}
          filter={[
            ['names', (value) => {
              let findName = '';
              filter.some((item) => {
                if (item === value) {
                  findName = value;
                  return true;
                }
              });
              return value !== findName;
            }],
          ]}
        >
          <Legend visible={false} />
          {this.toolTipActive()}

          <Axis
            name="value"
            label={{
              formatter: (val) => {
                return publicComputeUnit(val, 100, undefined, undefined);
              },
            }}
          />

          <Axis
            name="timestamp"
            label={axisLabel}
          />

          <LineAdvance
            position="timestamp*value"
            color={['names', (key) => {
              const findItem = _.find(metricLegendListAll, (item) => {
                return item.legendName === key;
              });
              return findItem && findItem.colorPrimary;
            }]}
          />
        </Chart>

      </Loading>
    );
  }
}


export default LineChart;
