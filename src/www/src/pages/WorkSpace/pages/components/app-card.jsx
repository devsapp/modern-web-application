import React from "react";
import { Link } from "react-router-dom";
import moment from 'moment';
import { Button, Icon } from "@b-design/ui";
import { openPathInFile } from '../../../../utils/url';
import "./index.scss";

const HOT_SPACE = 'hot-space';
export default function AppCard({ data, goToConfig, goToAppDetail, removeUserApp, openAction }) {
    const { name, originalAppName, update_at, create_at, localPath } = data;
    return (
        <div className="app-next-card"
            onClick={(e) => {
                e.stopPropagation();
                if (e.target && e.target.className && e.target.className.indexOf(HOT_SPACE) !== -1) {
                    return;
                }
                goToAppDetail(localPath, name)
            }
            }>
            <div className="next-header">
                <span className="header-text">{name} </span>
                <div className="header-options">
                    <span >更新时间:{moment(update_at).fromNow()}</span>
                    <Button className={HOT_SPACE} size="medium" onClick={() => removeUserApp(localPath)}>
                        <Icon className={HOT_SPACE} type="delete" />
                    </Button>
                </div>
            </div>
            <div className="next-content">
                <div className="content-item">应用模板：<Link
                    className={`${HOT_SPACE} template-title`}
                    to={{
                        pathname: "/app-detail",
                        search: `name=${originalAppName}`,
                    }}
                >
                    {originalAppName}
                </Link></div>
                <div className="content-item" >创建时间：{moment(create_at).fromNow()}</div>
                <div className="content-item">
                    <div className="content-text"><div className="title">本地路径：</div><span className={`link ${HOT_SPACE}`} onClick={() => openPathInFile(localPath)}>{localPath}</span></div>
                    {/* <img
                        className="open-workspace-icon"
                        style={{ width: 16, marginLeft: 16 }}
                        src={vscodeIcon}
                        onClick={() => openWithVscode(localPath)}
                    /> */}
                </div>
            </div>
            <div className="next-footer">
                {/* <span style={{ background: '#c82728' }} className="status"></span> */}
                {/* <div style={{ textAlign: 'right', width: '100%' }}>
                    <Button size="medium" onClick={() => goToAppDetail(localPath, name)} type="primary" >
                        应用详情
                    </Button>
                    <Button size="medium" onClick={() => goToConfig(localPath)}>
                        <Icon type="edit" />
                        <span>应用配置</span>
                    </Button>
                    <Button size="medium" onClick={() => openAction(data)}>
                        <Icon type="setting" />
                        <span>快捷操作</span>
                    </Button>
                </div> */}
            </div>
        </div>
    );
}
