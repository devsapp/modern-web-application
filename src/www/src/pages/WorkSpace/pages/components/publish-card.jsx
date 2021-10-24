import React from "react";
import { Link } from "react-router-dom";
import moment from 'moment';
import { Button, Icon } from "@b-design/ui";
import vscodeIcon from "../../../../assets/vscode.png";
import "./index.scss";
export default function PublishCard({ data, goToConfig, openWithVscode, removeUserApp }) {
    const { name, originalAppName, createAt, localPath } = data;
    return (
        <div className="app-next-card">
            <div className="next-header">
                <span className="header-text">{name}</span>
                <div style={{ display: 'flex' }}>

                    {/* <Button size="medium">
                        <Icon type="refresh" />
                    </Button> */}
                    <Button size="medium" onClick={() => removeUserApp(localPath)}>
                        <Icon type="delete" />
                    </Button>
                </div>
            </div>
            <div className="next-content">
                <div>来源模板：<Link
                    to={{
                        pathname: "/app-detail",
                        search: `name=${originalAppName}`,
                    }}
                >
                    {originalAppName}
                </Link></div>
                <div>更新时间：{moment(createAt).fromNow()}</div>
                <div className="content-text">本地路径：{localPath}  <img
                    className="open-workspace-icon"
                    style={{ width: 16, marginLeft: 16 }}
                    src={vscodeIcon}
                    onClick={() => openWithVscode(localPath)}
                /></div>
            </div>
            <div className="next-footer">
                <span style={{ background: '#c82728' }} className="status"></span>
                <div>
                    <Button size="medium" onClick={() => goToConfig(localPath)} type="primary">
                        <Icon type="edit" />
                        <span>发布配置</span>
                    </Button>
                </div>
            </div>
        </div>
    );
}
