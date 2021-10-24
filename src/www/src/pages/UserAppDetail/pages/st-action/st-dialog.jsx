import React from "react";
import _ from "loadsh";
import { Dialog, Button } from "@b-design/ui";
import Editor from "../../../../components/Editor";


export default function ExecuteDialog({ visible = false, data, closeExecuteDialog }) {
    return (
        <Dialog
            title={data.executeTitle}
            visible={visible}
            onClose={closeExecuteDialog}
            autoFocus
            shouldUpdatePosition
            style={{ width: 1080 }}
            footer={<div style={{ width: '100%' }}>
                <If condition={data.initError}>
                    <Button type="secondary" onClick={closeExecuteDialog} >关闭</Button>
                </If>
                <If condition={!data.initError}>
                    <Button type="primary" onClick={closeExecuteDialog} disabled={!data.executeEnd}>确定</Button>
                </If>
            </div>}
        >
            <div style={{ width: 980, marginLeft: -12, marginTop: -24 }}>
                <If condition={data.executeInfo}>
                    <Editor
                        height={500}
                        code={data.executeInfo}
                        setConfigValue={() => { }}

                    />
                    {/* <div dangerouslySetInnerHTML={{ __html: data.executeInfo }} style={{ width: 400, height: 500 }}></div> */}
                </If>
                <If condition={!data.executeInfo}>
                    <div style={{ fontSize: '20px' }}>压测开始...</div>
                </If>
            </div>
        </Dialog>
    );
}