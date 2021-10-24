import React from "react";
import { Field, Form } from '@b-design/ui';
import { GENERIC_ARR_REG } from '../../../constants';
import SingleFormField from "./single-form-field";
import MultiFormField from "./multi-form-field";
import "./index.scss";
class FormField extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.fieldData = {};
        this.field = new Field(this, { 
            onChange: this.changeField
        });
    }


    componentWillReceiveProps = (nextProps) => {
        const data = _.get(nextProps, 'configDataValue', {});
        const preData = _.get(this.props, 'configDataValue', {});
        if (JSON.stringify(data) !== JSON.stringify(preData)) {
            this.field.remove(); // 重置初始值
            this.forceUpdate();
        }
    }

    changeField = () => {
        this.inputTimmer && clearTimeout(this.inputTimmer);
        this.inputTimmer = setTimeout(() => {
            this.fieldData = {};
            const propsValues = this.field.getValues();
            const formatValues = this.transformData(propsValues);
            this.props.setProps(formatValues);
        }, 500);
    }

    createFieldData = (keyarr, value) => {
        let currentData = this.fieldData;
        let lastKey = keyarr[keyarr.length - 1];
        if (keyarr.length > 1) {
            for (let i = 0; i <= keyarr.length - 2; i++) {
                currentData = this.createDataStruct(currentData, keyarr[i]);
            }
        }

        const matchResult = lastKey.match(GENERIC_ARR_REG);
        if (matchResult) {
            const formatKey = matchResult[1];
            const number = matchResult[2];
            if (
                !currentData[formatKey] ||
                Object.prototype.toString.call(currentData[formatKey]) !== '[object Array]'
            ) {
                currentData[formatKey] = [];
            }
            currentData[formatKey][parseInt(number, 10)] = value;
            this.field = Object.assign({}, this.field, currentData);
        } else {

            currentData[lastKey] = value;
        }
    };

    createDataStruct = (data, key) => {
        const matchResult = key.match(GENERIC_ARR_REG);
        if (matchResult) {
            key = matchResult[1];
            const number = matchResult[2];
            if (!data[key] || Object.prototype.toString.call(data[key]) !== '[object Array]') {
                data[key] = [];
            }
            if (!data[key][number] || Object.prototype.toString.call(data[key][number]) !== '[object Object]') {
                data[key][number] = {};
            }
            this.field = Object.assign({}, this.field, data);
            return data[key][number];
        } else {
            if (!data[key] || Object.prototype.toString.call(data[key]) !== '[object Object]') {
                data[key] = {};
            }
            this.field = Object.assign({}, this.field, data);
            return data[key];
        }
    };


    transformData = (values) => {
        Object.keys(values).forEach((key) => {
            if (values[key]) { 
                const keyarr = key.split('.');
                const value = values[key];
                this.createFieldData(keyarr, value);
            }
        });
        return this.fieldData;

    };

    renderServiceForm = (name, data, fullKey) => {
        const { configDataValue, hideUnRequiredForm } = this.props;
        if (data.Type) {
            if (data.Type.length === 1) {
                const trueTypeData = data.Type[0]; // eg String[Simple configuration]           
                return (
                    <SingleFormField
                        key={fullKey}
                        hideUnRequiredForm={hideUnRequiredForm}
                        parentData={data}
                        currentData={trueTypeData}
                        name={name}
                        fullKey={fullKey}
                        renderServiceForm={this.renderServiceForm}
                        configDataValue={configDataValue}
                        field={this.field}
                        changeField={this.changeField}
                        transformData={this.transformData}
                    />
                );
            } else {
                //多项表单
                return (
                    <MultiFormField
                        key={fullKey}
                        hideUnRequiredForm={hideUnRequiredForm}
                        data={data}
                        name={name}
                        fullKey={fullKey}
                        renderServiceForm={this.renderServiceForm}
                        configValue={configDataValue}
                        field={this.field}
                        changeField={this.changeField}
                        transformData={this.transformData}
                    />
                );
            }
        }
    };

    render() {
        const { configSchemaValue = {} } = this.props;
        return (
            <Form
                field={this.field}>
                <div className="config-render" >
                    {Object.keys(configSchemaValue).length > 0 && Object.keys(configSchemaValue).map((key) => {
                        return this.renderServiceForm(key, configSchemaValue[key], key);
                    })}
                </div>
            </Form>
        );
    }
}

export default FormField;
