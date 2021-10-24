import React, { Component } from "react";
import _ from "loadsh";
import { Button, Icon, Input } from "@b-design/ui";
import ProjectConfig from '../../ProjectConfig/index';
import "../index.scss";





export default class ConfigView extends Component {

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
          <ProjectConfig history={this.props.history} hideTitle />
      </React.Fragment>
    );
  }
}
