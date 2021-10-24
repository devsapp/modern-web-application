import React from "react";
import { Form } from "@b-design/ui";
import _ from "loadsh";
import PropertyList from './property-list';
import Commands from './commands';
import BoxContainer from '../../../../components/box-container';
class PropertyInfoConfig extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
        };

    }
    getValues = () => {
        let values = {};
        const commands = this.commands.getValues();

        if (commands) {
            values.Commands = commands
        }
        const properties = this.propertyList.getValues();
        values.Properties = properties;
        return values;
    }
    render() {

        const { configValue = {}, setConfigValue } = this.props;
        return <div>
            <BoxContainer title="命令配置" desc="配置可以执行的指令，如 delploy, remove等">
                <Commands setConfigValue={setConfigValue} ref={(ref) => this.commands = ref} commands={configValue.Commands} />
            </BoxContainer>
            <BoxContainer title="属性配置" desc="组件功能需要让用户使用的属性配置">
                <PropertyList setConfigValue={setConfigValue} ref={(ref) => this.propertyList = ref} configValue={configValue.Properties} id="top-level-property" />
            </BoxContainer>
        </div>

    }
}

export default PropertyInfoConfig;
