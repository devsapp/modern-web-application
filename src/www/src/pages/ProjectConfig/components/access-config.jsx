import React, { Component } from 'react';
import { Field, Form, Input, Select, Dialog, Button, Notification } from '@b-design/ui';
import _ from 'loadsh';
import { PROVIDER_MAP } from '../../../constants';
import request from '../../../utils/request';
const PROVIDER_LIST = Object.keys(PROVIDER_MAP).map((key) => ({
    label: key,
    value: key
}));
const DEFAULT_PROVIDER = 'alibaba';

class AccessConfig extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formItemList: ['AccountID', 'AccessKeyID', 'AccessKeySecret']
        };
        this.field = new Field(this);
    }

    changeProvider = (value) => {
        const { formItemList } = this.state;
        formItemList.forEach((item) => {
            this.field.remove(item);
        })
        const newFormItemList = PROVIDER_MAP[value] || [];
        this.setState({
            formItemList: newFormItemList
        });
    }

    requestAddAccess = async (credentials) => {
        const result = await request('accessCenter/addAccess', { credentials });
        if (result.code === 200) {
            Notification.open({
                title: '秘钥添加成功',
                content: '',
                type: 'success',
            });
            const { refreshAccessData, onClose } = this.props;
            refreshAccessData();
            onClose();
        }
    }

    addAccess = () => {
        this.field.validate(async (error, values) => {
            if (error) {
                return;
            }
            const { aliasName } = values;
            const { confusedAccessInfo } = this.props;
            if (confusedAccessInfo[aliasName]) {
                const dialog = Dialog.confirm({
                    content: `检测到已经存在别名为${aliasName}的秘钥，是否覆盖?`,
                    onOk: async () => {
                        await this.requestAddAccess(values);
                        dialog.hide();
                    }
                })
            } else {
                await this.requestAddAccess(values);
            }
        });
    }

    showAccessInstallInfo = async () => {
        await request('userCenter/openAccessIntroPage');
    }
    render() {
        const { formItemList } = this.state;
        const { visible, onClose } = this.props;
        const providerValue = this.field.getValue('provider') || DEFAULT_PROVIDER
        return (
            <div>
                <Dialog
                    title={'秘钥配置'}
                    visible={visible}
                    autoFocus
                    shouldUpdatePosition
                    onClose={onClose}
                    style={{ width: 800 }}
                    footer={<div style={{ width: '100%' }}>
                        <Button type="primary" onClick={this.addAccess}>确定</Button>
                    </div>}
                >
                    <div style={{ width: 700, marginLeft: -12 }}>

                        <Form field={this.field} style={{ width: '100%' }}>
                            <Form.Item
                                label={<span>供应商名称{providerValue === DEFAULT_PROVIDER ? <a onClick={this.showAccessInstallInfo} style={{ marginLeft: 8 }} className="link">查看秘钥信息安装说明</a> : ''}</span>}
                                labelTextAlign='left'
                                hasFeedback
                                required>
                                <Select dataSource={PROVIDER_LIST} defaultValue={DEFAULT_PROVIDER} name="provider" style={{ width: '100%' }} onChange={this.changeProvider} />
                            </Form.Item>
                            {formItemList.map((key, i) => {
                                return <Form.Item
                                    id={`accesskey${i}`}
                                    label={key}
                                    labelTextAlign='left'
                                    hasFeedback
                                    required>
                                    <Input name={key} name={key} />
                                </Form.Item>
                            })}
                            <Form.Item
                                label='秘钥别名'
                                labelTextAlign='left'
                                hasFeedback
                                required
                                requiredMessage="秘钥别名必填">
                                <Input name='aliasName' />
                            </Form.Item>
                        </Form>
                    </div>
                </Dialog>
            </div>
        );
    }
}

export default AccessConfig;