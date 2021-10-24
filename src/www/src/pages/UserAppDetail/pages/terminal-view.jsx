import React, { Component } from "react";
import _ from "loadsh";
import { Button, Icon, Input } from "@b-design/ui";
import Terminal from '../../../components/terminal';
import { getParams } from '../../../utils/common';
import "../index.scss";





export default class TerminalView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      appList: []
    }
  }

  componentDidMount = async () => {
    
  }

  render() {
    return (
      <React.Fragment>
          <Terminal workspace={getParams('workspace')} />
      </React.Fragment>
    );
  }
}
