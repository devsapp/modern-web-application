import React from "react";
import _ from "loadsh";

import { Dialog, CodeSnippet, Button } from "@b-design/ui";
import ParamsDialog from './params-dialog';
import "./index.scss";



export default function InitDialog({ visible = false, data, closeInitDialog, goToConfig, params, openParamsDialog, showParamsDialog, submitParams, closeParamsDialog }) {
    return (
        <Dialog
            title={data.initTitle}
            visible={visible}
            onClose={() => closeInitDialog()}
            autoFocus
            shouldUpdatePosition
            style={{ width: 800 }}
            footer={<div style={{ width: '100%' }}>
                <If condition={data.initError}>
                    <Button type="secondary" onClick={closeInitDialog} >关闭</Button>
                </If>
                <If condition={!data.initError}>
                    <If condition={params.length > 0}>
                        <Button type="primary" onClick={goToConfig} onClick={() => openParamsDialog()}>配置参数</Button>
                    </If>
                    <If condition={params.length === 0}>
                        <Button type="primary" disabled={!data.initEnd} onClick={goToConfig}>进入配置</Button>
                    </If>

                </If>
            </div>}
        >
            <div style={{ width: 700, marginLeft: -12 }}>
                <ParamsDialog visible={showParamsDialog}
                    params={params}
                    submitParams={submitParams}
                    closeParamsDialog={closeParamsDialog} />
                <If condition={data.initInfo}> <CodeSnippet code={data.initInfo} style={{ width: 400, height: 500 }}></CodeSnippet></If>
                <If condition={!data.initInfo}>
                    <div style={{ fontSize: '20px' }}>初始化准备中...</div>
                </If>
            </div>
        </Dialog>
    );
}