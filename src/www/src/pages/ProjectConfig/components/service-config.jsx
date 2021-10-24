
import React, { Component } from "react";
import ServiceConfigList from './service-config-list';
import { Form } from '@b-design/ui';


export default class ServiceConfig extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const { field, data: services, executeCommand, accessInfo, setFullAction } = this.props;
        return <Form
            field={field}>
            <Form.Item>
                <ServiceConfigList name="services" defaultValue={services} field={field} services={services} executeCommand={executeCommand} accessInfo={accessInfo} setFullAction={setFullAction} />
            </Form.Item>
        </Form>

    }
}