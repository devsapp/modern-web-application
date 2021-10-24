
import React, { Component } from "react";
import _ from "loadsh";
import { Form, Input, Button, Select, Icon } from '@b-design/ui';
import Editor from "../../../components/Editor";
import EnvArray from './env-array';
import { throttle } from '../../../utils/common';
import "../index.scss";
const ENVS = 'vars';
export default class GlobalVars extends Component {
    constructor(props) {
        super(props);
        this.state = {
            editorView: false
        }
        this.throttleEditorChange = throttle();
    }

    showEditorView = () => {
        this.setState({
            editorView: true
        })
    }
    showFormView = () => {
        this.setState({
            editorView: false
        })
    }

    render() {
        const { field, initValue, onChange, originVars } = this.props;
        const { editorView } = this.state;
        let code = originVars;
        try {
            code = JSON.stringify(code, null, '\t')
        } catch (e) { };
        return <div>
            <div>
                <Button onClick={this.showFormView}>表单视图</Button>
                <Button onClick={this.showEditorView}>编辑器视图</Button>
            </div>
            <If condition={!editorView}>
                <EnvArray initValue={initValue} field={field} onChange={onChange} />
            </If>
            <If condition={editorView}>
                <Editor
                    height={300}
                    defaultValue={code}
                    language='json'
                    setConfigValue={(values) => {
                        this.throttleEditorChange(() => {
                            try {
                                values = JSON.parse(values);
                                onChange(values);
                            } catch (e) {
                            }
                        })

                    }}
                />
            </If>
        </div>

    }
}