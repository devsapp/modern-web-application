import React from "react";
import _ from "loadsh";
import { Dialog } from '@b-design/ui';
import Editor from "./Editor";


export default function CodeDialog({ visible = false, title = "", code, closeDialog }) {
    return (
        <Dialog
            title={title}
            visible={visible}
            onClose={closeDialog}
            autoFocus
            shouldUpdatePosition
            style={{ width: 800 }}
            footer={<div />}
        >
            <div style={{ width: 700, marginLeft: -12 }}>
                <Editor
                    height={500}
                    code={code}
                    setConfigValue={() => { }}

                />
            </div>
        </Dialog>
    );
}