import React from "react";

import { Form, Input, Radio, Select, Icon } from "@b-design/ui";
import CommonBalloon from "../../../components/CommonBalloon";
import ComplexFormStruct from "./complex-form-struct";
import BasicFormStruct from "./basic-form-struct";
import StructForm from './struct-form';
import { FOTM_ITEM_LAYOUT } from '../../../constants';
import Translation from "../../../components/Translation";
import "./index.scss";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const GENERIC_LIST_REG = new RegExp(/List<(.*)>/, "i");
// const COMMON_VARIABLE_TYPE_REG = new RegExp(/\$\{(.*)\}/, 'i');
class FormField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderStringType = (type, fullKey, data = {}) => {
        const { configDataValue = {}, field, changeField } = this.props;
        let value = data.currentValue !== undefined ? data.currentValue : (configDataValue[fullKey] || data.Default || '');
        if (type === "String") {
            return (
                <Input
                    {...field.init(fullKey, { initValue: value })}
                    style={{ width: '100%' }}
                    type="line"
                    size="medium"
                    theme="dark"

                />
            );
        }
        if (type === "Number") {

            return (
                <Input
                    {...field.init(fullKey, { initValue: value })}
                    style={{ width: '100%' }}
                    type="line"
                    size="medium"
                    theme="dark"
                    htmlType="number"
                />
            );
        }
        if (type === "Boolean") {
            return (
                <RadioGroup
                    {...field.init(fullKey, { initValue: !!value })}
                    dataSource={[
                        { label: <Translation>Yes</Translation>, value: true },
                        { label: <Translation>No</Translation>, value: false },
                    ]}
                />
            );
        }
        const typeMatchResut = type.match(GENERIC_LIST_REG);
        if (typeMatchResut) {
            return (
                <BasicFormStruct
                    {...field.init(fullKey, { initValue: value })}
                    type={typeMatchResut[1]}
                    renderStringType={this.renderStringType}
                    fullKey={fullKey}
                    initValue={value}
                    changeField={changeField}
                    field={field}
                />
            );
        }
    };

    renderLabel = (name, description) => {
        return <span>
            <span>{name}</span>
            <CommonBalloon content={description || ''}>
                <Icon type="help" />
            </CommonBalloon>
        </span>
    }

    renderExample = (example) => {
        return example ? <span>【<Translation>Example</Translation>】 {example}</span> : ''
    }

    renderSingleForm = () => {
        let {
            parentData,
            currentData,
            name,
            fullKey,
            renderServiceForm,
            configDataValue = {},
            hasParent,
            field,
            hideUnRequiredForm,
            changeField,
        } = this.props;
        const data = parentData;
        let dataValue = configDataValue[fullKey];
        try {
            dataValue = JSON.parse(dataValue);
        } catch (e) {

        }
        const trueTypeData = currentData;

        if (Object.prototype.toString.call(trueTypeData) === "[object String]") {
            return (
                <FormItem
                    {...FOTM_ITEM_LAYOUT}
                    className={hasParent ? 'no-require-icon' : ''}
                    style={{ visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}
                    label={!hasParent ? <Translation>{name}</Translation> : " "}
                    labelTextAlign="left"
                    help={this.renderExample(data.Example)}
                    required={data.Required}
                >
                    {this.renderStringType(trueTypeData, fullKey, data)}
                </FormItem>
            );
        }
        if (trueTypeData.Enum || trueTypeData['List<Enum>']) {

            let dataSource = trueTypeData.Enum ? trueTypeData.Enum : trueTypeData['List<Enum>'];
            return (
                <FormItem
                    {...FOTM_ITEM_LAYOUT}
                    style={{ visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}
                    label={!hasParent ? this.renderLabel(name, data.Description || '') : " "}
                    labelTextAlign="left"
                    help={this.renderExample(data.Example)}
                    required={data.Required}
                >
                    <Select
                        {...field.init(fullKey, { initValue: dataValue })}
                        style={{ width: "100%" }}
                        mode={trueTypeData.Enum ? 'single' : 'multiple'}
                        dataSource={dataSource.map((_key) => {
                            return { label: _key, value: _key };
                        })}
                    />
                </FormItem>
            );

        }
        if (trueTypeData.Struct) {
            return (
                <React.Fragment>
                    <If condition={!hasParent}>
                        <FormItem
                            {...FOTM_ITEM_LAYOUT}
                            style={{ visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}
                            label={
                                this.renderLabel(name, data.Description || '')
                            }
                            labelTextAlign="left"
                            required={data.Required}
                        />
                    </If>
                    <div style={{ paddingLeft: 60 }}>
                        <StructForm {...field.init(fullKey, { initValue: dataValue })} trueTypeData={trueTypeData} fullKey={fullKey} renderServiceForm={renderServiceForm} initValue={dataValue} field={field} />
                    </div>
                </React.Fragment>
            );
        }
        if (trueTypeData["List<Struct>"] || trueTypeData["List"]) {
            return (
                <React.Fragment>
                    <If condition={!hasParent}>
                        <FormItem
                            {...FOTM_ITEM_LAYOUT}
                            style={{ visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}
                            label={
                                this.renderLabel(name, data.Description || '')
                            }
                            labelTextAlign="left"
                            required={data.Required}
                        />
                    </If>
                    <FormItem
                        {...FOTM_ITEM_LAYOUT}
                        style={{ visibility: (hideUnRequiredForm && !data.Required) ? 'hidden' : 'visible' }}
                        label={<span />}
                        labelTextAlign="left"
                    >
                        <ComplexFormStruct
                            {...field.init(fullKey, { initValue: dataValue })}
                            data={trueTypeData["List<Struct>"] || trueTypeData["List"]}
                            renderServiceForm={renderServiceForm}
                            field={field}
                            fullKey={fullKey}
                            name={fullKey}
                            configDataValue={dataValue}
                            changeField={changeField}
                        />
                    </FormItem>

                </React.Fragment>
            );
        }
    };

    render() {
        const {
            parentData,
            hideUnRequiredForm
        } = this.props;
        const data = parentData;
        return <div style={{ display: (hideUnRequiredForm && !data.Required) ? 'none' : 'block' }}>{this.renderSingleForm()}</div>;
    }
}

export default FormField;
