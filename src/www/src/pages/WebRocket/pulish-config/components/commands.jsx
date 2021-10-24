import React from "react";
import { Button, Icon } from "@b-design/ui";

import Translation from "../../../../components/Translation";
import CommandForm from './command-form';

import "../index.scss";


class Commands extends React.Component {
  constructor(props) {
    super(props);
    const { commands = {} } = props;
    const newCommands = Object.keys(commands).map((key) => ({
      id: key,
      name: key,
      desc: commands[key]
    }));
    this.state = {
      commands: newCommands
    };
  }

  componentWillReceiveProps = (nextProps) => {
    const { commands } = nextProps;
    if (commands && commands.length > 0 && JSON.stringify(nextProps.commands) !== JSON.stringify(this.props.commands)) {
      const newCommands = Object.keys(commands).map((key) => ({
        id: key,
        name: key,
        desc: commands[key]
      }));
      this.setState({
        commands: newCommands
      });
    }
  }

  setConfigValue = () => {
    const values = this.getValues();
    this.props.setConfigValue(values);
  }

  addCommand = () => {
    const { commands } = this.state;
    commands.push({ id: Date.now() });
    this.setState({
      commands
    });
  }

  removeCommand = (id) => {
    const { commands } = this.state;
    commands.forEach((data, i) => {
      if (data.id === id) {
        commands.splice(i, 1);
      }
    });
    this.setState({
      commands
    })
  }


  getValues = () => {
    const { commands } = this.state;
    if (commands.length > 0) {
      let commandValue = {};
      commands.forEach((data) => {
        if (this[`commands${data.id}`]) {
          const values = this[`commands${data.id}`].getValues();
          const { name, description = '' } = values;
          if (name) {
            commandValue[name] = description;
          }
        }
      });
      return commandValue;
    }
  }

  render() {
    const { commands } = this.state;
    return (
      <span>
        {commands.map((data) => <div style={{ position: 'relative' }} key={data.id}>
          <If condition={commands.length > 1}><span className="remove-icon" style={{ right: -20, top: -3 }}><Icon type="ashbin" onClick={() => this.removeCommand(data.id)} /></span></If>
          <CommandForm ref={(ref) => this[`commands${data.id}`] = ref} setConfigValue={this.setConfigValue} defaultValue={data} />
        </div>)}
        <div style={{ textAlign: 'center' }}>
          <Button type="primary" style={{ width: 120 }} onClick={this.addCommand}>+ <Translation>添加指令</Translation></Button>
        </div>
      </span>
    );
  }
}

export default Commands;
