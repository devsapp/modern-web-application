import React from "react";

import { Input, Icon, Button } from "@b-design/ui";
import CommonBalloon from "../../../components/CommonBalloon";
import { Consumer } from '../project-config-context';
import JsonEditorDialog from '../../../components/jsoneditor-dialog';
import '../index.scss';
const COMMON_VARIABLE_TYPE_REG = new RegExp(/\$\{(.*)\}/, 'i');
class StructForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showForm: false,
            showJsonEditorDialog: false,
        };
    }

    openShowForm = () => {
        this.setState({
            showForm: true
        })
    }

    closeShowForm = () => {
        this.setState({
            showForm: false
        });
        const { fullKey, field } = this.props;
        const allValues = field.getValues();
        Object.keys(allValues).forEach((key) => {
            if (key.indexOf(fullKey) === 0 && key !== fullKey) {
                field.remove(key);
            }
        })
    }

    render() {
        const {
            field,
            fullKey,
            renderServiceForm,
            trueTypeData,
            initValue = ''
        } = this.props;
        const varsArr = initValue.match && initValue.match(COMMON_VARIABLE_TYPE_REG);
        const { showForm, showJsonEditorDialog } = this.state;
        return <Consumer>
            {({ globalDataMap = {} }) => <div style={{ paddingLeft: 60 }} className="struct-form-container">
                <If condition={varsArr && globalDataMap[varsArr[1]] && !showForm}>
                    <Button type="secondary" className="option-btn show-form-view" onClick={this.openShowForm} text>
                        表单视图
                    </Button>
                </If>
                <If condition={varsArr && globalDataMap[varsArr[1]] && showForm}>
                    <Button type="secondary" className="option-btn show-vars-view" onClick={this.closeShowForm} text>
                        变量视图
                    </Button>
                </If>
                <If condition={varsArr && globalDataMap[varsArr[1]] && !showForm}>
                    <div className="struct-item-text">
                        <Input {...field.init(fullKey, { initValue })} className="text-input" />
                        <CommonBalloon content="显示引用变量的值">
                            <Icon type={'view'} onClick={() => {
                                this.setState({ showJsonEditorDialog: true })
                            }} />
                        </CommonBalloon>

                        <JsonEditorDialog visible={showJsonEditorDialog} title={initValue} jsonData={globalDataMap[varsArr[1]]} closeDialog={() => this.setState({ showJsonEditorDialog: false })} />
                    </div>
                </If>
                <If condition={!varsArr || showForm}>
                    <div className="struct-item-obj">
                        {Object.keys(trueTypeData.Struct).map((key) =>
                            renderServiceForm(
                                key,
                                trueTypeData.Struct[key],
                                `${fullKey}.${key}`
                            )
                        )}
                    </div>
                </If>

            </div>}

        </Consumer>
    }
}

export default StructForm;
