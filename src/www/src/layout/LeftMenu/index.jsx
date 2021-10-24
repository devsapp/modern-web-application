import React from "react";
import { Link, withRouter } from "react-router-dom";
import { Icon } from '@b-design/ui';
import AuthorGithub from '../../components/author-github';
import hubs from "../../assets/hubs.png";
import hubsActive from "../../assets/hubs-selected.png";
import packages from "../../assets/packages.png";
import packagesActive from "../../assets/packages-selected.png";
import workspace from "../../assets/workspace.png";
import workspaceActive from "../../assets/workspace-selected.png";
import rocket from "../../assets/rocket.png";
import rocketActive from "../../assets/rocket-selected.png";
import "./index.scss";

const LeftMenu = (props, context) => {
  const { location } = props;
  const { pathname } = location;
  const isworkspace = pathname.indexOf('workspace') !== -1 || pathname.indexOf('userapp') !== -1;
  const ishub = pathname.indexOf('/hubs') !== -1;
  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <Link to="/hubs" className="menu-item">
        <div
          className={ishub ? "menu-item-active" : "menu-item-normal"}
        >
          <img
            className="menu-item-icon"
            src={hubsActive}
          />
          <span
            className={
              ishub ? "menu-item-text-active" : "menu-item-text"
            }
          >
            Serverless Hub
          </span>
        </div>
      </Link>
      <Link to="/workspace" className="menu-item">
        <div
          className={isworkspace ? "menu-item-active" : "menu-item-normal"}
        >
          <img
            className="menu-item-icon"
            src={workspaceActive}
          />
          <span
            className={
              isworkspace ? "menu-item-text-active" : "menu-item-text"
            }
          >
            工作空间
          </span>
        </div>
      </Link>
      <Link to="/component-center" className="menu-item">
        <div
          className={pathname === "/component-center" ? "menu-item-active" : "menu-item-normal"}
        >
          <img
            className="menu-item-icon"
            src={packagesActive}
          />
          <span
            className={
              pathname === "/component-center" ? "menu-item-text-active" : "menu-item-text"
            }
          >
            组件中心
          </span>
        </div>
      </Link>
      {/* <Link to="/packages" className="menu-item">
        <div
          className={
            pathname === "/packages" ? "menu-item-active" : "menu-item-normal"
          }
        >
          <img
            className="menu-item-icon"
            src={pathname === "/packages" ? packagesActive : packages}
          />
          <span
            className={
              pathname === "/packages"
                ? "menu-item-text-active"
                : "menu-item-text"
            }
          >
            包管理
          </span>
        </div>
      </Link>
      <Link to="/cli" className="menu-item">
        <div
          className={
            pathname === "/cli" ? "menu-item-active" : "menu-item-normal"
          }
        >
          <img
            className="menu-item-icon"
            src={pathname === "/cli" ? cliActive : cli}
          />
          <span
            className={
              pathname === "/cli" ? "menu-item-text-active" : "menu-item-text"
            }
          >
            Serverless CLI
          </span>
        </div>
      </Link> */}
      <Link to="/rocket" className="menu-item">
        <div
          className={
            pathname === "/rocket" ? "menu-item-active" : "menu-item-normal"
          }
        >
          <img
            className="menu-item-icon"
            src={rocketActive}
          />
          <span
            className={
              pathname === "/rocket"
                ? "menu-item-text-active"
                : "menu-item-text"
            }
          >
            实用工具
          </span>
        </div>
      </Link>

      <div className="menu-item" style={{ position: 'absolute', bottom: 140, left: '50%', marginLeft: -23 }} >
        <AuthorGithub />
      </div>
      <div className="menu-item" style={{ position: 'absolute', bottom: 60, left: '50%', marginLeft: -23 }} >
        <Link to="/user-config-center" >
          <Icon type="set" className="menu-set" />
        </Link>
      </div>
    </div>
  );
};

export default withRouter(LeftMenu);
