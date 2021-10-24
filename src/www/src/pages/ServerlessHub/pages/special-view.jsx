import React, { Component } from "react";
import _ from "loadsh";

import { Loading } from '@b-design/ui';
import SpecialCard from '../components/special-card';

import * as request from '../../../utils/request';
import "../index.scss";
export default class SpecialView extends Component {

    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            apps: [],
            params: [],
            specialList: [],
            category: []
        }
    }
    componentDidMount = async () => {
        this.getSpecial();
    }

    openLoading = () => {
        this.setState({
            loading: true
        })
    }

    closeLoading = () => {
        this.setState({
            loading: false
        })
    }

    getSpecial = async () => {
        this.openLoading();
        const result = await request.get('appCenter/getSpecial');
        if (result.code === 200) {
            const data = _.get(result, 'data.apps.Response', {});
            this.setState({
                specialList: Object.keys(data).map(key => ({ id: key, label: data[key] }))
            })
        }
        this.closeLoading();
    }




    initAppTemplate = async (data) => {

    }

    render() {
        const { specialList, loading } = this.state;
        const { history } = this.props;
        return <div className="serverless-hub-container">
            <div className="center-content-container">

                <div className="app-list-container" >
                    < Loading tip="应用查询"
                        visible={loading}
                        style={{ position: 'relative', width: '100%' }}
                        indicator={<div className="load-container load8">
                            <div className="loader"></div>
                        </div>}>
                        {specialList.map((data) => <SpecialCard data={data} key={data.label} key={data.id} initAppTemplate={this.initAppTemplate} />)}
                    </Loading>
                </div>
            </div>


        </div>
    }
}