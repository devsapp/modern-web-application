import React from "react";
import _ from "loadsh";
import { Dialog } from "@b-design/ui";
import Editor from "../../../components/Editor";
export default function ComponentInstallDialog({ visible = false, data, closeInstallDialog }) {
    return (
        <Dialog
            title={data.installTitle}
            visible={visible}
            onClose={() => closeInstallDialog()}
            autoFocus
            shouldUpdatePosition
            style={{ width: 800 }}
            footer={<div style={{ width: '100%' }} />}
        >
            <div style={{ width: 700, marginLeft: -12 }}>
                <If condition={data.installInfo}>
                    <Editor
                        height={500}
                        code={data.installInfo}
                        setConfigValue={() => { }}

                    /> </If>
                <If condition={!data.installInfo}>
                    <div style={{ fontSize: '20px' }}>安装开始...</div>
                </If>
            </div>
        </Dialog>
    );
}