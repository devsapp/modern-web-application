import React from "react";
import _ from "loadsh";
import { Select } from '@b-design/ui';
import "./index.scss";

import UserConfigLayout from './layout';


export default function UserConfigCenter({ history }) {
    return (
        <div className="page-container">
            <div className="page-title-container">
                <div className="title-name">配置中心</div>
                <div className="title-desc"></div>
            </div>
            <div className="config-content-container">
                <UserConfigLayout view={'access'} />
            </div>

        </div>
    );
}