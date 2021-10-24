import React from "react";
import _ from "loadsh";
import { Select } from '@b-design/ui';
import RocketLayout from './layout/index';
import "./index.scss";
const TOOLS_LIST = [{
  label: '属性配置器',
  value: 'publish-config'
}, {
  label: '终端',
  value: 'terminal'
}]
export default function WebRocket({ history }) {
  return (
    <div className="page-container">
      <div className="page-title-container">
        <div className="title-name"><Select style={{ width: 160 }} dataSource={TOOLS_LIST} defaultValue={'publish-config'} onChange={(value) => {
          history.push({
            pathname: `/rocket/${value}`,
          })
        }} /></div>
        <div className="title-desc"></div>
      </div>
      <div className="center-content-container">
        <RocketLayout view={'publish-config'} />
      </div>
    </div>
  );
}