import React, { Component } from "react";
import { Link } from "react-router-dom";
import moment from 'moment';
import _ from "loadsh";
import { Button } from "@b-design/ui";
import AppCard from '../components/app-card';
import Translation from "../../../components/Translation";
import { Consumer } from '../hub-config';
import * as request from '../../../utils/request';
import "./index.scss";
export default class SpecialView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apps: [],
        }
    }
    componentDidMount = async () => {
        const { data } = this.props;
        this.getSpecialDetail(data.id);
    }

    getSpecialDetail = async (special) => {
        const result = await request.post('appCenter/getSpecialDetail', { special });
        if (result.code === 200) {
            this.setState({
                apps: result.data.apps
            })
        }
    }

    render() {
        const { data, initAppTemplate } = this.props;
        const { apps } = this.state;
        return <Consumer>
            {({ collectApps, collectApp }) => <div style={{ backgroundColor: "#FFFFFF", marginBottom: 12 }} >
                <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: 8 }}>{data.label}</div>
                <div style={{ overflow: 'hidden' }}>
                    {apps.map((app, i) => <AppCard key={`app${i}`} data={app} initAppTemplate={initAppTemplate} collectApp={collectApp} collectApps={collectApps} searchApp={() => this.getSpecialDetail(data.id)} />)}
                </div>
            </div>
            }</Consumer>
    }
}
