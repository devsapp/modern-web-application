import React from "react";
import _ from "loadsh";
import { Icon } from "@b-design/ui";
import { addOpenLinks, removeOpenLinks } from '../../../../utils/url';
import fcIcon from "../../../../assets/fc.png";

export default class FcItem extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount = async () => {
        this.linkers = addOpenLinks();

    }
    componentWillUnmount = () => {
        removeOpenLinks(this.linkers);
    }

    render() {
        const { item } = this.props;
        const region = _.get(item, 'content.region');
        const service = _.get(item, 'content.service');
        const _function = _.get(item, 'content.function');

        return (
            <React.Fragment>
                <div style={{ fontWeight: 'bold' }} className="resource-name-container">资源名：<img src={fcIcon} className="resource-icon" /><a href="https://www.aliyun.com/product/fc?spm=5176.10695662.1112509.1.703843573wugX2" target="_blank" className="external-link">函数计算</a> </div>
                <div style={{ fontWeight: 'bold' }}>资源详情:</div>
                <If condition={region}>
                    <div style={{ paddingLeft: 54 }}><span >地域:</span><span style={{ marginLeft: 8 }}>{region}</span></div>
                </If>
                <If condition={service}>
                    <div style={{ paddingLeft: 54 }}><span >服务:</span><a href={`https://fcnext.console.aliyun.com/cn-hangzhou/services/${service}/detail`} style={{ marginLeft: 8 }} target="_blank" className="external-link">{service}<Icon type="external-link" /></a></div>
                </If>
                <If condition={_function}>
                    <div style={{ paddingLeft: 54 }}><span >函数:</span><a href={`https://fcnext.console.aliyun.com/cn-hangzhou/services/${service}/function-detail/${_function}/LATEST?tab=code`} style={{ marginLeft: 8 }} target="_blank" className="external-link">{_function}<Icon type="external-link" /></a></div>
                </If>

            </React.Fragment>
        );
    }


}
