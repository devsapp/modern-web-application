import React, { Component } from "react";
import _ from "loadsh";
import { Loading, Icon, Input } from '@b-design/ui';
import CommonBalloon from '../../../components/CommonBalloon';
import SimpleFoldContainer from '../../../components/SimpleFoldContainer';
import ComponentItemCard from './component-item-card';
import request from '../../../utils/request';

export default class ComponentList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            installedList: [],
            installedLoading: false,
            recommendLoading: false,
            recommendList: []
        }
    }
    componentDidMount = async () => {
        this.getData();
    }

    getData = async () => {
        this.setState({
            installedLoading: true,
            recommendLoading: true
        })
        const result = await request('componentCenter/getLocalComponents');
        const recommendResult = await request('componentCenter/getRecommendComponent');
        if (result.code === 200) {
            const installedList = result.data || [];
            const installedNameMap = {};
            installedList.forEach((item) => { installedNameMap[item.name] = true });
            const recommendList = _.get(recommendResult, 'data', []).map((item) => Object.assign({}, item, { name: item.package, version: item.version.tag_name })).filter((item) => !installedNameMap[item.name]);
            this.setState({
                installedList,
                recommendList,
                installedLoading: false,
                recommendLoading: false
            })
        }
    }
    render() {
        const { installedList, recommendList, installedLoading, recommendLoading } = this.state;
        const { getComponentInfo } = this.props;
        return <div className="component-list-container">
            <div className="component-title">
                <span style={{ marginRight: 4 }}>组件列表</span>
                <CommonBalloon content={'组件本身具备独立的逻辑能力，可以单独使用。注：部分组件无可视化操作可以直接使用命令行完成执行'}>
                    <Icon type="help" />
                </CommonBalloon></div>
            <div className="search"><Input style={{ width: '100%' }} size="small" /></div>
            <SimpleFoldContainer title='已安装' height={500} resetDomClassName="component-list-container">
                < Loading tip="正在查询已安装组件..."
                    visible={installedLoading}
                    style={{ position: 'relative', width: '100%' }}
                    indicator={<div style={{ marginTop: 160 }}>
                        <div className="loader"></div>
                    </div>}>
                    <If condition={installedList.length === 0 && installedLoading === false}>
                        <div style={{ height: 300, width: '100%', textAlign: 'center', lineHeight: '300px' }}>
                            您还未安装任何组件
                        </div>
                    </If>
                    {installedList.map((item) => <ComponentItemCard data={item} getComponentInfo={getComponentInfo} key={item.name} />)}
                </ Loading>
            </SimpleFoldContainer>
            <SimpleFoldContainer title='推荐安装' height={window.innerHeight - 400} resetDomClassName="component-list-container">
                < Loading tip="正在查询已推荐组件..."
                    visible={installedLoading}
                    style={{ position: 'relative', width: '100%' }}
                    indicator={<div style={{ marginTop: 160 }}>
                        <div className="loader"></div>
                    </div>}>
                    <If condition={recommendList.length === 0 && installedLoading === false}>
                        <div style={{ height: 300, width: '100%', textAlign: 'center', lineHeight: '300px' }}>
                            暂无
                        </div>
                    </If>
                    {recommendList.map((item) => <ComponentItemCard data={item} getComponentInfo={getComponentInfo} key={item.package} />)}
                </ Loading>
            </SimpleFoldContainer>
        </div>
    }
}