import React, { Component } from 'react';
import _ from "loadsh";
import ServiceConfigItem from './service-config-item';

import BoxContaier from '../../../components/box-container';

class ServiceConfigList extends Component {
    constructor(props) {
        super(props);
        const { onChange, services } = props;
        this.state = {
            services: [...services],
        };
        this.services = {};
        services.forEach((item) => {
            this.services[item.name] = item.value;
        })
        onChange(this.services);

    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.services && JSON.stringify(nextProps.services) !== JSON.stringify(this.props.services)) {
            this.setState({
                services: [...nextProps.services],
            })
            this.services = {};
            nextProps.services.forEach((item) => {
                this.services[item.name] = item.value;
            })
            this.props.onChange(this.services);
        }
    }

    setServices = (data) => {
        const { onChange } = this.props;
        this.services = Object.assign({}, this.services, data);
        onChange(this.services);
    }

    render() {
        const { services } = this.state;
        const { executeCommand, accessInfo, setFullAction } = this.props;
        return (

            <BoxContaier title="服务配置" desc="配置服务信息">
                    {
                        services.map((service) => <ServiceConfigItem data={service.value} key={service.name} title={service.name} setServices={this.setServices} executeCommand={executeCommand} accessInfo={accessInfo} setFullAction={setFullAction} />)
                    }
            </BoxContaier>


        );
    }
}

export default ServiceConfigList;