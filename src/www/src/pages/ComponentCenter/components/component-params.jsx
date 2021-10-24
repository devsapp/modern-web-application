import React, { Component } from "react";
import _ from "loadsh";

import { Input, Form, Select, Button, Field, Icon } from '@b-design/ui';
import AccessConfig from '../../ProjectConfig/components/access-config';

export default class ComponentParams extends Component {

    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            paramsList: [],
            params: {}
        };
        this.methodMap = {};
        this.field = new Field(this);

    }
    componentDidMount = async () => {

        const { data = [] } = this.props;
        const paramsList = data.map((_data) => {
            const paramsData = _data.params[0] || {};
            let params = {};
            try {
                params = JSON.parse(paramsData.paramDesc);
                this.methodMap[_data.name] = params;
            } catch (e) {

            }
            return {
                label: _data.desc,
                value: _data.name
            }
        });
        this.setState({
            paramsList
        })
    }

    setParam = (method) => {
        const params = this.methodMap[method] || {};
        this.setState({
            params
        })
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

    executeMethod = () => {
       
        this.field.validate((error, values) => {
            if (error) {
                return;
            }
            const result = values;
            const accessAliName = result.access || 'default';
            if (!accessAliName) {
                return;
            }
            const { componentName } = this.props;
            const method = result.method;
            const region = result.region;
            delete result.method;
            delete result.region;
            delete result.access;
            const params = JSON.stringify(result);
            let executeCommandText = `s cli ${componentName} ${method} -r ${region} -a ${accessAliName} `;
            if (Object.keys(result).length > 0) {
                executeCommandText += `-p '${params}'`;
            }
            const { executeCommand } = this.props;
            executeCommand(executeCommandText);

        })

    }

    refreshAccessData = () => {
        this.props.refreshAccess();
    }

    render() {
        const { paramsList, params, visible } = this.state;
        const { accessInfo } = this.props;
        const confusedAccessInfo = _.get(accessInfo, 'confusedAccessInfo', {});
        const hasAccess = Object.keys(confusedAccessInfo).length > 0;

        return <div className="" style={{ padding: 20 }}>
            <Form labelAlign="top" field={this.field}>
                <Form.Item label="选择region:" required>
                    <Select dataSource={[{ lable: '杭州', value: 'cn-hangzhou' }]} name="region" defaultValue="cn-hangzhou" style={{ width: '100%' }} />
                </Form.Item>
                <If condition={hasAccess}>
                    <Form.Item label="秘钥信息:" required>
                        <Select dataSource={Object.keys(confusedAccessInfo).map(key => ({ key, value: key }))} name="access" defaultValue={''} style={{ width: '50%', marginRight: 10 }} />
                        <Button type='secondary' onClick={this.openAccessDialog}>
                            <Icon type="add" /> 添加秘钥
                            </Button>
                    </Form.Item>
                </If>
                <If condition={!hasAccess}>
                    <Form.Item label="秘钥信息:" required>
                        <Button type="primary" style={{ width: '100%' }} onClick={this.openAccessDialog}>新建秘钥</Button>
                    </Form.Item>
                </If>
                <Form.Item label="执行方法:" required>
                    <Select dataSource={paramsList} name="method" onChange={(value) => this.setParam(value)} style={{ width: '100%' }} showSearch />
                </Form.Item>

                <If condition={Object.keys(params).length > 0}>
                    <div>执行参数:</div>
                    {
                        Object.keys(params).map((key) => <Form.Item label={key} required>
                            <Input name={key} style={{ width: '100%' }} />
                        </Form.Item>)
                    }
                </If>
            </Form>
            <AccessConfig visible={visible} onClose={this.closeAccessDialog} confusedAccessInfo={confusedAccessInfo} refreshAccessData={this.refreshAccessData} />
            <div>
                <Button type="primary" onClick={this.executeMethod}>执行</Button>
            </div>
        </div>
    }
}