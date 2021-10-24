
import React, { Component } from "react";
import _ from "loadsh";
import { Form, Input, Button, Select, Icon } from '@b-design/ui';
import GlobalVars from './global-vars';
import AccessConfig from './access-config';
import BoxContaier from '../../../components/box-container';
import EnvArray from './env-array';
import { FOTM_ITEM_LAYOUT } from '../../../constants';
import "../index.scss";
const ENVS = 'vars';
export default class BasicConifg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false
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
    render() {
        const { data, accessInfo, field, refreshAccessData } = this.props;
        const { visible } = this.state;
        const vars = data.vars || {};
        const varsValue = Object.keys(vars).map((key) => {
            let value = vars[key];
            return { key, value }
        })
        const confusedAccessInfo = _.get(accessInfo, 'confusedAccessInfo', {});
        const hasAccess = Object.keys(confusedAccessInfo).length > 0;
        return <div id='basic-config'>
            <BoxContaier title="基本配置" desc="配置基本信息">
                <Form
                    {...FOTM_ITEM_LAYOUT}
                    field={field}
                    labelTextAlign='left'
                >
                    <Form.Item
                        label='版本号'
                        labelTextAlign='left'
                        hasFeedback
                        required
                    >
                        <Input
                            disabled
                            type="line"
                            size="medium"
                            theme="dark"
                            name="edition"
                            defaultValue={data.edition}
                        />
                    </Form.Item>
                    <Form.Item
                        label='项目名'
                        labelTextAlign='left'
                        hasFeedback
                        required
                    >
                        <Input
                            type="line"
                            size="medium"
                            theme="dark"
                            name="name"
                            defaultValue={data.name}
                        />
                    </Form.Item>
                    <If condition={Object.keys(vars).length > 0}>
                        <Form.Item
                            label="全局变量"
                            labelTextAlign='left'
                            hasFeedback
                            required
                        >
                            <GlobalVars initValue={varsValue} name={ENVS} field={field} originVars={vars}  defaultValue={vars} />
                        </Form.Item>
                    </If>
                    <If condition={Object.keys(vars).length === 0}>
                        <Form.Item
                            label='全局变量'
                            labelTextAlign='left'
                            hasFeedback
                            required
                        >
                            <EnvArray initValue={varsValue} name={ENVS} field={field} defaultValue={vars} />
                        </Form.Item>
                    </If>
                    <Form.Item
                        label='秘钥配置'
                        labelTextAlign='left'
                        hasFeedback
                    >
                        <If condition={hasAccess}>
                            <Select dataSource={Object.keys(confusedAccessInfo).map(key => ({ key, value: key }))} name="access" defaultValue={data.access || 'default'} style={{ width: '50%', marginRight: 10 }} />
                            <Button type='secondary' onClick={this.openAccessDialog}>
                                <Icon type="add" /> 添加秘钥
                            </Button>
                        </If>
                        <If condition={!hasAccess}>
                            <Button type="primary" style={{ width: '100%' }} onClick={this.openAccessDialog}>新建秘钥</Button>
                        </If>
                    </Form.Item>
                    <AccessConfig visible={visible} onClose={this.closeAccessDialog} confusedAccessInfo={confusedAccessInfo} refreshAccessData={refreshAccessData} />
                </Form>
            </BoxContaier>
        </div>

    }
}