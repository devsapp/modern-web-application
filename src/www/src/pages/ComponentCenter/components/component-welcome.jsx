import React from "react";
import { Button, Icon } from '@b-design/ui';
export default function ComponentWelcome({ initAppTemplate }) {
    return (
        <div className="welcome-container">
            <div className="welcome-title">欢迎来到组件中心</div>
            <div style={{ width: '100%', textAlign: 'center', marginTop: 30 }}><Button className="developer-create-btn" type="primary" onClick={() => initAppTemplate('component')}><Icon type="edit" />快速创建</Button>
            </div>


        </div>
    );
}