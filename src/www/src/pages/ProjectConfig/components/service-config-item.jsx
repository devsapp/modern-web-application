
import React, { Component } from "react";
import _ from "loadsh";
import CommonBalloon from "../../../components/CommonBalloon";
import { Form, Field, Select, Button, Icon, Input } from '@b-design/ui';
import request from '../../../utils/request';
import { FOTM_ITEM_LAYOUT } from '../../../constants';
import Actions from './actions';
import FormField from '../config-detail/form-field';
import { generateMagicVariables } from '../../../utils/parsed';
const FormItem = Form.Item;

export default class ServiceConfigItem extends Component {
    constructor(props) {
        super(props);
        this._props = _.get(props, 'data.props', {})
        const initValue = generateMagicVariables(this._props);
        this.state = {
            serviceSchemaValue: {},
            serviceDataValue: initValue,
            serviceCommands: [],
            commandValue: '',
            actionParams: ''
        }
        this.field = new Field(this, {
            onChange: () => {
                this.changeTimmer && clearTimeout(this.changeTimmer);
                this.changeTimmer = setTimeout(this.changeValue, 500);
            }
        });
    }

    componentDidMount = async () => {
        const { data, setFullAction, title } = this.props;
        const component = _.get(data, 'component');
        const result = await request('configCenter/getComponentInfo', { component });

        if (result.code === 200) {
            const serviceSchemaValue = _.get(result, 'data.props', {});
            let serviceCommands = _.get(result, 'data.commands', {});
            if (Object.keys(serviceCommands).length === 0) {
                serviceCommands = { deploy: '部署' };
            }
            try {
                serviceCommands = JSON.parse(serviceCommands);
            } catch (e) {

            }
            const _commandData = {};
            _commandData[title] = Object.keys(serviceCommands);
            setFullAction(_commandData);
            serviceCommands = Object.keys(serviceCommands).map(key => ({ label: serviceCommands[key], value: key }));
            this.setState({
                serviceSchemaValue,
                serviceCommands,
                commandValue: _.get(serviceCommands, '[0].value')
            })

        }
    }

    componentWillReceiveProps = (nextProps) => {
        const data = _.get(nextProps, 'data', {});
        const preData = _.get(this.props, 'data', {});
        if (JSON.stringify(data) !== JSON.stringify(preData)) {
            this.field.setValue('component', data.component);
            const serviceDataValue = generateMagicVariables(data.props);
            this.setState({
                serviceDataValue
            })
        }
    }

    setProps = (propsValue) => {
        this._props = propsValue;
        this.changeValue();
    }

    changeValue = () => {
        const singleValues = this.field.getValues();
        if (singleValues.actions && Object.keys(singleValues.actions).length === 0) {
            delete singleValues.actions;
        }
        const combineServiceData = Object.assign({}, singleValues, { props: this._props });
        const { setServices, title } = this.props;
        const finalServiceData = {};
        finalServiceData[title] = combineServiceData;
        setServices(finalServiceData);
        this.setState({
            serviceDataValue: generateMagicVariables(this._props)
        })
    }

    executeCommand = () => {
        const { commandValue, actionParams } = this.state;
        const { executeCommand, title } = this.props;

        executeCommand(commandValue, title, actionParams);
    }
    setComponentLocalPath = async () => {
        const result = await request('commonAction/chooseLocalPath');
        if (result.code === 200) {
            const choosedPath = result.data
            this.field.setValue('component', choosedPath);
            this.changeValue();
        }
    }
    setActionParams = (actionParams) => {
        this.setState({
            actionParams
        })
    }
    render() {
        const { serviceSchemaValue, serviceDataValue, serviceCommands, commandValue } = this.state;
        const { data = {}, title, accessInfo = {} } = this.props
        const actions = _.get(data, 'actions', {});
        const component = _.get(data, 'component');
        const confusedAccessInfo = _.get(accessInfo, 'confusedAccessInfo', {}); //获取加密的秘钥信息
        const hasAccess = Object.keys(confusedAccessInfo).length > 0;
        return <div className="service-item-container">
            <div className="config-title" id={title}>
                <div className="config-text">服务名
                    <CommonBalloon content={'这里的服务是s 工具配置规范的约定，请注意区别阿里云函数计算的服务'}>
                        <Icon type="help" />
                    </CommonBalloon>
                </div>
                <div className="title-content">{title}</div>

            </div>
            <div className="config-title" id={title}>
                <div className="config-text">操作指令 <CommonBalloon content={'操作指令是当前服务所依赖的组件中的具体执行方法，比如deploy,remove等'}>
                    <Icon type="help" />
                </CommonBalloon></div>
                <div className="config-option">
                    <Select.AutoComplete label="指令动作" className="methods" dataSource={serviceCommands} defaultValue={commandValue} value={commandValue} onChange={(commandValue) => this.setState({ commandValue })} />
                    <Input label="指令参数" className="methods" onChange={this.setActionParams} style={{ width: 140 }} />
                    <If condition={hasAccess}>
                        <Button disabled={!commandValue} type="primary" className="action-btn" onClick={this.executeCommand} style={{ height: 32, lineHeight: '30px' }}>执行</Button>
                    </If>
                    <If condition={!hasAccess}>
                        <Button disabled={true} type="primary" className="action-btn" onClick={this.executeCommand} style={{ height: 32, lineHeight: '30px' }}>执行</Button>
                        <span className="info-tips">
                            <Icon type="prompt" />
                    您还没配置秘钥信息，请在基本配置中添加
                    </span>
                    </If>
                </div>
            </div>
            <div style={{ padding: 12 }}>
                <Form
                    {...FOTM_ITEM_LAYOUT}
                    labelTextAlign='left'
                    field={this.field}
                >
                    <div className="service-config-title">基本信息</div>
                    <FormItem
                        label='执行组件'
                        labelTextAlign='left'
                        hasFeedback
                        required
                    >
                        <Select.AutoComplete dataSource={[{}]} defaultValue={component} name="component" />
                        <Button type="primary" className="action-btn" onClick={this.setComponentLocalPath} style={{ marginLeft: 8 }} text><Icon type="edit" />选择本地路径</Button>
                    </FormItem>
                    <FormItem
                        label='执行动作'
                        labelTextAlign='left'
                        hasFeedback
                        required
                    >
                        <Actions name="actions" defaultValue={actions} />
                    </FormItem>
                </Form>
                <div className="service-config-title">属性信息</div>
                <FormField
                    name="props"
                    configSchemaValue={serviceSchemaValue}
                    configDataValue={serviceDataValue}
                    hideUnRequiredForm={false}
                    setProps={this.setProps}
                />
            </div>
        </div>
    }
}