import React from "react";
import _ from 'loadsh';
import { Button, Dialog } from "@b-design/ui";
import AccessItem from './access-item';
import request from '../../../../utils/request';
import AccessConfigDialog from '../../../ProjectConfig/components/access-config';
import './index.scss'
export default class AccessConfig extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            originAccessInfo: {

            },
            confusedAccessInfo: {

            }
        }
    }
    componentDidMount = () => {
        this.getAccess();
    }

    getAccess = async () => {
        const result = await request('accessCenter/getAccess');

        if (result.code === 200) {
            const originAccessInfo = _.get(result, 'data.originAccessInfo', {});
            const confusedAccessInfo = _.get(result, 'data.confusedAccessInfo', {});
            this.setState({
                originAccessInfo,
                confusedAccessInfo
            })
        }
    }

    removeAccess = (key) => {
        const dialog = Dialog.confirm({
            title: `确定删除别名为${key}的秘钥吗？`,
            content: '',
            footerActions: ['cancel', 'ok'],
            onOk: async () => {
                const result = await request('accessCenter/removeAccess', { aliasName: key });
                if (result.code === 200) {
                    this.refreshAccessData();
                    dialog.hide();
                }
            },
            onCancel: () => { },
        });
    }

    refreshAccessData = () => {
        this.getAccess();
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
        const { confusedAccessInfo, visible } = this.state;
        return (
            <div className="access-info-container">
                <div className="access-list">
                    {Object.keys(confusedAccessInfo).map((key, i) => <AccessItem key={`${key}${i}`} data={confusedAccessInfo[key]} name={key} removeAccess={this.removeAccess} />)}
                </div>
                <div className="access-option">
                    <Button type="primary" onClick={this.openAccessDialog}>添加秘钥</Button>
                </div>
                <AccessConfigDialog visible={visible} onClose={this.closeAccessDialog} confusedAccessInfo={confusedAccessInfo} refreshAccessData={this.refreshAccessData} />
            </div>
        );
    }
}

