import React, { Component } from 'react';
import { Grid, Button, Icon, Form, Input, Select } from '@b-design/ui';
import _ from "loadsh";
import ActionCommands from './action-commands';
const { Row, Col } = Grid;
function getEmptyItem() {
    return {
        id: Date.now(),
        order: '',
        method: '',
        commands: []
    };
}
class Actions extends Component {
    constructor(props) {
        super(props);
        const { defaultValue = {} } = props;
        this.actionValue = {};
        let actions = Object.keys(defaultValue).map((key) => {
            const commands = defaultValue[key];
            const [order, method] = key.split('-');
            const id = Date.now();
            this.actionValue[id] = { order, method, commands };
            return {
                id,
                order,
                method,
                commands
            }
        });

        this.state = {
            actions,
        };

    }


    componentWillReceiveProps = (nextProps) => {
        if (nextProps.defaultValue && JSON.stringify(nextProps.defaultValue) !== JSON.stringify(this.props.defaultValue)) {
            const defaultValue = nextProps.defaultValue;
            let actions = Object.keys(defaultValue).map((key) => {
                const commands = defaultValue[key];
                const [order, method] = key.split('-');
                const id = Date.now();
                this.actionValue[id] = { order, method, commands };
                return {
                    order,
                    method,
                    commands
                }
            })
            this.actionValue = nextProps.defaultValue;
            this.state = {
                actions,
            };
        }
    }

    addAction = () => {
        const { actions } = this.state;
        actions.push(getEmptyItem());
        this.setState({ actions: [...actions] });
    }

    removeAction = (id) => {
        const { actions } = this.state;
        actions.forEach((item, i) => {
            if (item.id === id) {
                actions.splice(i, 1);
                delete this.actionValue[id];
            }
        });
        this.setState({
            actions
        }, this.setAction);
    }
    changeAction = (id, type, value) => {
        if (!this.actionValue[id]) {
            this.actionValue[id] = {};
        }
        this.actionValue[id][type] = value;
        this.setAction();
    }

    setAction = () => {
        let finalResult = {};
        Object.keys(this.actionValue).forEach((key) => {
            const trueAction = this.actionValue[key];
            const { order, method, commands } = trueAction;
            if (order && method && commands && commands.length > 0) {
                finalResult[`${order}-${method}`] = commands;
            }

        });
        this.props.onChange(finalResult);
    }

    render() {
        const { actions } = this.state;
        return (
            <div className="action-detail">
                {actions.map((item, index) => {
                    return <div key={item.id} style={{ position: 'relative' }}>
                        <span style={{ right: -24, top: -2, position: 'absolute' }}><Icon type="ashbin" onClick={() => this.removeAction(item.id)} className='remove-icon' /></span>
                        <Row >
                            <Col span={10}>
                                <Form.Item
                                    required
                                    requiredMessage={
                                        ''
                                    }
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        label="执行次序:"
                                        dataSource={[{ label: '前置', value: 'pre' }, { label: '后置', value: 'post' }]}
                                        defaultValue={item.order}
                                        onChange={(value) => this.changeAction(item.id, 'order', value)}
                                    />

                                </Form.Item>
                            </Col>
                            <Col style={{ display: 'flex', alignItems: 'center' }}></Col>
                            <Col span={10}>
                                <Form.Item
                                    required
                                    requiredMessage={
                                        ''
                                    }
                                >
                                    <Select
                                        style={{ width: '100%' }}
                                        label="执行方法:"
                                        dataSource={[{ label: 'deploy', value: 'deploy' }, { label: 'remove', value: 'remove' }]}
                                        defaultValue={item.method}
                                        onChange={(value) => this.changeAction(item.id, 'method', value)}

                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <If condition={actions.length > 0}>
                            <ActionCommands actionCommands={item.commands} onChange={(value) => this.changeAction(item.id, 'commands', value)} />
                        </If>
                    </div>
                })}

                <div className="mb-20">
                    <Button type="secondary" style={{ width: '100%' }} onClick={this.addAction}><Icon type="add" />添加Action</Button>
                </div>

            </div>
        );
    }
}

export default Actions;