import React from "react";
import _ from "loadsh";
import { Dialog, Button, Form, Select, Input } from "@b-design/ui";

import "./index.scss";
const DEFAULT_SERVICE = 'All';
export default function ActionDialog({ visible = false, data, field, closeAction, executeCommand, services, commands }) {
    return (
        <Dialog
            title={'操作'}
            visible={visible}
            onClose={closeAction}
            autoFocus
            shouldUpdatePosition
            style={{ width: 800 }}
            footer={<div style={{ width: '100%' }}>

                <Button onClick={executeCommand} type="primary">
                    执行
                    </Button>
            </div>}
        >
            <div style={{ width: 700, marginLeft: -12 }}>
                <Form field={field}>
                    <Form.Item

                        label="Service"
                        labelTextAlign="left"
                        help={`选择服务`}
                        required
                    >
                        <Select
                            name="service"
                            style={{ width: "100%" }}
                            dataSource={services}
                            defaultValue="all"
                        />
                    </Form.Item>
                    <If condition={field.getValue('service') === DEFAULT_SERVICE || commands.length === 0}>
                        <Form.Item
                            label="行为"
                            labelTextAlign="left"
                            help={`输入可全量操作的方法`}
                            required
                        >
                            <Input
                                name="method"
                                style={{ width: "100%" }}
                            />
                        </Form.Item>
                    </If>
                    <If condition={field.getValue('service') !== DEFAULT_SERVICE && commands.length > 0}>
                        <Form.Item
                            label="行为"
                            labelTextAlign="left"
                            help={`选择服务方法`}
                            required
                        >
                            <Select
                                name="method"
                                style={{ width: "100%" }}
                                dataSource={commands}
                            />
                        </Form.Item>
                    </If>
                    <Form.Item
                        label="参数"
                        labelTextAlign="left"
                        help={'除yaml配置外，额外的入参 如 --user-remote'}
                    >
                        <Input
                            name="params"
                            style={{ width: "100%" }}


                        />
                    </Form.Item>
                </Form>
            </div>
        </Dialog>
    );
}