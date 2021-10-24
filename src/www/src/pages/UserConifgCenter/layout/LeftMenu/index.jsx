import React from "react";
import { Link, withRouter } from "react-router-dom";

import { Icon, Input, Dialog, Notification, Nav } from "@b-design/ui";

const LeftMenu = (props, context) => {
    const { location } = props;
    const { pathname } = location;

    return (
        <div style={{ position: 'relative', height: '100%' }}>
            <Nav embeddable aria-label="local navigation" >
                <Nav.Item key="access">
                    <Link>秘钥配置管理</Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default withRouter(LeftMenu);
