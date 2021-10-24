import React from 'react';
import { Icon, Button } from '@b-design/ui';
import { getRandomColor } from '../../../utils/common';
import Translation from "../../../components/Translation";
import "./index.scss";

function generateNum() {
    return 'single' + getRandomColor();
}
class BasicFormStruct extends React.Component {
    constructor(props) {
        super(props);

        let singleItemList = [{ id: generateNum() }];
        this.listValueMap = {};
        if (props.initValue) {
            try {
                singleItemList = JSON.parse(props.initValue);
                singleItemList = singleItemList.map((value) => {
                    const id = generateNum();
                    this.listValueMap[id] = value;
                    return {
                        id, value
                    }
                })
            } catch (e) {

            }

        }
        this.state = {
            singleItemList
        };
    }
    componentWillReceiveProps = (nextProps) => {
        if (JSON.stringify(nextProps.initValue) !== JSON.stringify(this.props.initValue)) {
            let  values = [];
            try {
                values = JSON.parse(nextProps.initValue);
            }catch(e) {

            }
            values.forEach((value, i) => {
                const itemData = this.state.singleItemList[i] || {};
                this.listValueMap[itemData.id] = value;
            });
        }
    }
    removeGroup = (id) => {
        const { singleItemList } = this.state;
        const { changeField, field, fullKey } = this.props;
        singleItemList.forEach((item, i) => { // 重置值
            field.remove(`${fullKey}[${i}]`);
        });
        singleItemList.forEach((item, i) => { // 重置值
            if (item.id === id) {
                singleItemList.splice(i, 1);
            }
        });
        singleItemList.forEach((item, i) => {
            const currentId = this.listValueMap[item.id] || ''
            field.setValue(`${fullKey}[${i}]`, currentId);
        });
        this.setState({
            singleItemList
        }, () => {
            changeField();
        });
    };

    addGroup = () => {
        const { singleItemList } = this.state;
        singleItemList.push({ id: generateNum(), value: '' });
        this.setState({
            singleItemList
        })
    }

    render() {
        const { type = {}, renderStringType, fullKey } = this.props;
        const { singleItemList } = this.state;

        return (
            <div style={{ paddingLeft: 20 }}>
                <div style={{ marginBottom: 10 }}>
                    <Button type="primary" onClick={this.addGroup}><Translation>添加项</Translation></Button>
                </div>

                {singleItemList.map((item, i) => {
                    return (
                        <div className="init-form-group" key={item.id}>
                            <If condition={singleItemList.length > 1}>
                                <Icon className="remove-icon" type='ashbin' onClick={() => this.removeGroup(item.id)} style={{ position: 'absolute', right: 5, top: 5 }} />
                            </If>
                            <div style={{ width: '100%' }}>{renderStringType(type, `${fullKey}[${i}]`, { currentValue: item.value })}</div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default BasicFormStruct;
