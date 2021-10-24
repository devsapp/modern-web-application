import React from "react";
import _ from "loadsh";
import { Select, Icon } from '@b-design/ui';
import CommonBalloon from '../../components/CommonBalloon';
import WorkspaceLayout from './layout';
import "./index.scss";


const WORKSPACE_SUBPATH = 'sdesktop-subpath';
const VIEW_DATA = [{ label: '用户视角', value: 'user-view' }, { label: '开发者视角', value: 'developer-view' }]
export default function WorkSpace({ history }) {
    const view = localStorage.getItem(WORKSPACE_SUBPATH) || 'user-view';
    return (
        <div className="page-container">
            <div className="page-title-container">
                <div className="title-name">工作空间 <Select className="choose-type" style={{ marginRight: 4 }} dataSource={VIEW_DATA} defaultValue={view} onChange={(value) => {
                    localStorage.setItem(WORKSPACE_SUBPATH, value);
                    history.push({
                        pathname: `/workspace/${value}`,
                    })
                }} />
                    <CommonBalloon content={'用户视角呈现开发者所使用的应用，开发者视角则是呈现开发者贡献的应用及组件'}>
                        <Icon type="help" />
                    </CommonBalloon>
                </div>
                <div className="title-desc"></div>
            </div>
            <div className="center-content-container">
                <WorkspaceLayout view={view} />
            </div>

        </div>
    );
}