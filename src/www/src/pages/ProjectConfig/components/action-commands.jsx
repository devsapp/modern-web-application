import React, { Component } from 'react';
import { Grid, Button, Icon, Form, Input, Select } from '@b-design/ui';
import _ from "loadsh";

const { Row, Col } = Grid;
function getEmptyItem() {
    return {
        id: Date.now(),
        run: '',
        path: '',
    };
}
class Actions extends Component {
    constructor(props) {
        super(props);
        this.actionCommands = {};
        const { actionCommands = [] } = props;
        actionCommands.forEach((item) => {
            const { id, run, path } = item;
            this.actionCommands[id] = { run, path }
        });
        if (actionCommands.length === 0) {
            actionCommands.push({ id: Date.now(), run: '', path: '' });
        }
        this.state = {
            actionCommands
        };

    }


    componentWillReceiveProps = (nextProps) => {
        if (JSON.stringify(nextProps.actionCommands) !== JSON.stringify(this.props.actionCommands)) {

            actionCommands.forEach((item) => {
                const { id, run, path } = item;
                this.actionCommands[id] = { run, path }
            });

            this.setState({
                actionCommands
            })
        }
    }
    addActionCommand = () => {
        const { actionCommands } = this.state;
        actionCommands.push(getEmptyItem());
        this.setState({ actionCommands });
    }

    setCommands = () => {
        let finalResult = [];
        Object.keys(this.actionCommands).map((key) => {
            const command = this.actionCommands[key];
            finalResult.push(command);

        });
        this.props.onChange(finalResult);

    }

    changeCommands = (id, type, value) => {
        if (!this.actionCommands[id]) {
            this.actionCommands[id] = {};
        }
        this.actionCommands[id][type] = value;
        this.setCommands();

    }

    removeActionCommands = (id) => {
        const { actionCommands } = this.state;
        actionCommands.forEach((item, i) => {
            if (item.id === id) {
                actionCommands.splice(i, 1);
                delete this.actionCommands[id];
            }
        });
        this.setCommands();
    }

    render() {
        const { actionCommands } = this.state;
        return (
            <div className="action-command">
                {actionCommands.map((item, index) => {
                    return <div key={index} style={{ position: 'relative' }} className={actionCommands.length > 1 ? 'command-detail' : ''}>
                        <If condition={actionCommands.length > 1}>
                            <Button onClick={() => this.removeActionCommands(item.id)} className="delete" text>删除</Button>
                        </If>
                        <Row >
                            <Col offset="4">
                                <Form.Item
                                    required
                                    requiredMessage={
                                        ''
                                    }
                                >
                                    <Input
                                        label="执行指令"
                                        defaultValue={item.run}
                                        onChange={(value) => this.changeCommands(item.id, 'run', value)}
                                    />

                                </Form.Item>
                            </Col>
                        </Row>
                        <Row >
                            <Col offset="4">
                                <Form.Item
                                    required
                                    requiredMessage={
                                        ''
                                    }
                                >
                                    <Input
                                        label="执行路径"
                                        defaultValue={item.path}
                                        onChange={(value) => this.changeCommands(item.id, 'path', value)}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </div>
                })}
                <div className="mb-20" style={{ textAlign: 'right' }}>
                    <Button type="secondary" text onClick={this.addActionCommand}><Icon type="add" />添加指令</Button>
                </div>
            </div>
        );
    }
}

export default Actions;