import React from "react";
import _ from "loadsh";
import ReactJson from 'react-json-view'
import { Dialog } from "@b-design/ui";
export default function JsonEditorDialog({ visible = false, jsonData, title, closeDialog }) {
    return (
        <Dialog
            title={'变量详情'}
            visible={visible}
            onClose={() => closeDialog()}
            autoFocus
            shouldUpdatePosition
            style={{ width: 800, height: 600 }}
            footer={<div />}
        >
            <div style={{ width: 700, marginLeft: -12, marginTop: -32 }}>
                <ReactJson src={jsonData} theme="monokai" name={title} displayDataTypes={false} displayObjectSize={false} enableClipboard={false} />
            </div>
        </Dialog>
    );
}