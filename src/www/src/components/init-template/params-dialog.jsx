import React, { Component } from "react";
import { Dialog, Button, Form, Input, Field, Select, Notification, Icon } from "@b-design/ui";
import AccessConfig from '../../pages/ProjectConfig/components/access-config';
import request from '../../utils/request';
import _ from "loadsh";
const SYSTEM_DOMAINS = [{
    label: '.resume.net.cn',
    value: '.resume.net.cn'
}]
const DEFAULT_PRIMARY_DOMAIN = '.resume.net.cn';
export default class ParamsDialog extends Component {
    constructor(props) {
        super(props);
        this.field = new Field(this);
        this.state = {
            access: 'default',
            accessVisible: false,
            accessInfo: {},
            primaryDomain: DEFAULT_PRIMARY_DOMAIN
        }
    }

    componentDidMount() {
        this.getAccessData();
    }


    checkDomains = async () => {
        const secondDomainName = this.field.getValue('domain');
        const { primaryDomain } = this.state;
        if (secondDomainName) {
            const fullDomain = `${secondDomainName}${primaryDomain}`;
            const { access } = this.state;
            const result = await request('jamstackAction/checkDomainExists', { domain: fullDomain, access });
            if (result.code === 200 && result.data && result.data.success) {
                Notification.open({
                    title: `${fullDomain} 域名可用`,
                    content: '',
                    type: 'success',
                });
            } else {
                Notification.open({
                    title: `${fullDomain} 不可用，请重新更换`,
                    content: '',
                    type: 'error',
                });
            }

        } else {
            this.field.setError('domain', '请输入二级域名');
        }
    }

    setPrimaryDomain = (values) => {
        this.setState({
            primaryDomain
        })
    }

    setAccess = (access) => {
        this.setState({
            access
        });
    }

    openAccessDialog = () => {
        this.setState({
            accessVisible: true
        })
    }
    closeAccessDialog = () => {
        this.setState({
            accessVisible: false
        })
    }

    getAccessData = async () => {
        const result = await request('accessCenter/getAccess');
        const accessInfo = result.data;
        this.setState({
            accessInfo
        })

    }


    render() {
        const { visible, params, closeParamsDialog, submitParams, originData } = this.props;
        const { primaryDomain, accessInfo, accessVisible } = this.state;
        const isJamstack = originData && originData.tags && originData.tags.includes('jamstack');
        const confusedAccessInfo = _.get(accessInfo, 'confusedAccessInfo', {}); //获取加密的秘钥信息
        const hasAccess = Object.keys(confusedAccessInfo).length > 0;
        return (
            <Dialog
                title={'填写预置参数'}
                visible={visible}
                onClose={closeParamsDialog}
                autoFocus
                shouldUpdatePosition
                style={{ width: 800 }}
                footer={<div style={{ width: '100%' }}>
                    <Button type="primary" onClick={() => {
                        this.field.validate((errors, values) => {
                            if (errors) {
                                return;
                            }
                            submitParams(values);
                        })
                    }}>确定并进入配置详情</Button>
                </div>}
            >
                <div style={{ width: 700, marginLeft: -12 }}>
                    <Form field={this.field}>
                        {
                            params.map((param) => {
                                return <Form.Item
                                    key={param.name}
                                    label={param.name}
                                    labelTextAlign="left"
                                    help={param.desc}
                                    required>
                                    <Input name={param.name} style={isJamstack && param.name === 'domain' ? { width: 120 } : { width: '100%' }} />
                                    <If condition={isJamstack && param.name === 'domain'}>
                                        <Select dataSource={SYSTEM_DOMAINS} value={primaryDomain} onChange={this.setPrimaryDomain} style={{ marginLeft: 12, width: 200 }} />
                                        <If condition={hasAccess}>
                                            <span style={{ marginLeft: 5, marginRight: 5 }}>选择秘钥</span>
                                            <Select onChange={this.setAccess} dataSource={Object.keys(confusedAccessInfo).map(key => ({ key, value: key }))} name="access" defaultValue={'default'} style={{ width: 120, marginRight: 10, marginLeft: 10 }} />
                                        </If>
                                        <If condition={!hasAccess}>
                                            <Button type='secondary' onClick={this.openAccessDialog}>
                                                <Icon type="add" /> 添加秘钥
                                            </Button>
                                        </If>
                                        <Button type="primary" style={{ marginLeft: 12 }} onClick={this.checkDomains}>域名检测</Button>
                                    </If>
                                </Form.Item>
                            })
                        }
                    </Form>
                    <AccessConfig visible={accessVisible} onClose={this.closeAccessDialog} confusedAccessInfo={confusedAccessInfo} refreshAccessData={this.getAccessData} />
                </div>
            </Dialog>
        );
    }
}
