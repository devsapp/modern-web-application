import React, { Component } from "react";
import _ from "loadsh";
import { Button, Icon, Input, Step } from "@b-design/ui";

import Prepare from './debug-step/prepare';
import DebugInvoke from './debug-step/debug-invoke';
import CleanDebug from './debug-step/clean-debug';
import request from '../../../utils/request';
import { getParams } from '../../../utils/common';
import vscodeIcon from "../../../assets/vscode.png";
import "../index.scss";





export default class DebugView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      currentStep: 0
    }
  }

  componentDidMount = async () => {

  }


  setCurrentStep = (currentStep) => {
    this.setState({
      currentStep
    })
  }

  openWithVscode = async (workspace) => {
    await request('commonAction/openWithVscode', { workspace });
  }


  render() {
    const { currentStep } = this.state;
    const workspace = getParams('workspace');
    return (
      <React.Fragment>
        <div className="debug-container">

          <Step current={currentStep} shape="arrow">
            <Step.Item title="云端资源及环境准备" content="Description" onClick={() => this.setCurrentStep(0)} />
            <Step.Item title="本地调试配置" onClick={() => this.setCurrentStep(1)} />
            <Step.Item title="资源清理" onClick={() => this.setCurrentStep(2)} />
          </Step>
          <div className="debug-step-container">
            <div className="workspace-title"><span style={{ marginRight: 15 }}>当前工作空间: </span> {workspace} <img
              className="open-workspace-icon"
              style={{ width: 24, cursor: 'pointer' }}
              src={vscodeIcon}
              onClick={() => this.openWithVscode(workspace)}
            /></div>
            <div className="debug-view-step" style={currentStep === 0 ? { visibility: 'visible', zIndex: 3 } : { visibility: 'hidden', zIndex: -1 }}>
              <Prepare />
            </div>
            <div className="debug-view-step" style={currentStep === 1 ? { visibility: 'visible', zIndex: 2 } : { visibility: 'hidden', zIndex: -2 }}>
              <DebugInvoke setCurrentStep={this.setCurrentStep}/>
            </div>
            <div className="debug-view-step" style={currentStep === 2 ? { visibility: 'visible', zIndex: 1 } : { visibility: 'hidden', zIndex: -3 }}>
              <CleanDebug />
            </div>
          </div>

        </div>
      </React.Fragment>
    );
  }
}
