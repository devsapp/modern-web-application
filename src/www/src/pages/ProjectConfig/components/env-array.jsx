import React, { Component } from 'react';
import { Grid, Button, Icon, Form, Input } from '@b-design/ui';
import _ from "loadsh";
import { throttle } from '../../../utils/common';
const { Row, Col } = Grid;

// type Props = {
//   field: any;
//   initValue?: any[];
//   onChange?: Function;
//   name?: string;
// };

// type State = {
//   items: any[];
// };

function getEmptyItem() {
  return {
    key: '',
    value: '',
  };
}

class EnvArray extends Component {
  constructor(props) {
    super(props);
    const { initValue } = props;
    this.state = {
      items: [...initValue],
    };
    this.throttleValueChange = throttle();
    this.props.onChange(this.transformVars(initValue));

  }

  transformVars = (varsArray) => {
    const vars = {};
    varsArray.forEach((item) => {
      ((innerItem) => {  // 需要用IIFE按照顺序执行
        let _innerItem = innerItem;
        vars[_innerItem.key] = _innerItem.value;
      })(item)
    })
    return vars;
  }

  addItem() {
    const { items } = this.state;
    items.push(getEmptyItem());
    this.setState({ items: [...items] });
  }

  onItemChanged(index, field, value) {
    this.throttleValueChange(() => {
      const { items } = this.state;
      items[index][field] = value;
      this.setState({
        items: [...items],
      });
      this.submit(items);
    });
  }

  submit(items) {
    const { onChange } = this.props;
    if (onChange) {
      onChange(this.transformVars(items));
    }
  }

  remove(index) {
    const { items } = this.state;
    items.splice(index, 1);
    this.setState({ items: [...items] });
    this.submit([...items]);
  }

  render() {
    const { items } = this.state;
    return (
      <div>
        {items.map((item, index) => {
          return (
            <Row key={index} gutter="20">
              <Col span={10}>
                <Form.Item
                  required
                  requiredMessage={
                    ''
                  }
                >
                  <Input
                    label={'key'}
                    className="full-width"
                    defaultValue={item.key}
                    onChange={value => this.onItemChanged(index, 'key', value)}
                    placeholder={''}
                  />
                </Form.Item>
              </Col>
              <Col span={10}>
                <Form.Item
                  required
                  requiredMessage={
                    ''
                  }
                >
                  <Input
                    label={'value'}
                    className="full-width"
                    defaultValue={item.value}
                    onChange={value => this.onItemChanged(index, 'value', value)}
                    placeholder={''}
                  />
                </Form.Item>
              </Col>
              <Col span={1}>
                <div className="mt-5">
                  <Icon type="ashbin" onClick={() => this.remove(index)} className="remove-icon" />
                </div>
              </Col>
            </Row>
          );
        })}
        <div className="mb-20">
          <Button type="secondary" onClick={this.addItem.bind(this)}>
            <Icon type="add" /> 添加
          </Button>
        </div>

      </div>
    );
  }
}

export default EnvArray;