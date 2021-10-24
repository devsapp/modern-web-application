import React from 'react';

import { Icon, Button } from '@b-design/ui';
import { getRandomColor } from '../../../utils/common';
import Translation from "../../../components/Translation";
import "./index.scss";

function generateNum() {
    return 'complex' + getRandomColor();
}
class ComplexFormStruct extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            groupList: [{ id: generateNum() }]
        };
    }

    componentDidMount() {
        let configDataValue = [];
        try {
            configDataValue = JSON.parse(this.props.configDataValue);
        } catch (e) {

        }
        if (configDataValue.length > 0) {
            const groupList = configDataValue.map(() => ({ id: generateNum() }));
            this.setState({ groupList });
        }
    }

    // componentWillReceiveProps = (nextProps) => {
    //     if (nextProps.configDataValue && JSON.stringify(nextProps.configDataValue) !== JSON.stringify(this.props.configDataValue)) {
    //         let configDataValue = [];
    //         try {
    //             configDataValue = JSON.parse(nextProps.configDataValue);
    //         } catch (e) {

    //         }
    //         if (configDataValue.length > 0) {
    //             const groupList = configDataValue.map(() => ({ id: generateNum() }));
    //             this.setState({ groupList });
    //         }
    //     }
    // }

    removeGroup = (id) => {
        const { groupList } = this.state;
        const { changeField, field, fullKey, data } = this.props;
        const tmpObjValue = {};
        const allValues = field.getValues();
        const allKeys = Object.keys(allValues);
        groupList.forEach((item, i) => {  // 清理所有复杂结构的 键值，并保存副本
            const preKey = `${fullKey}[${i}]`; // app[0] 的所有值 和 app[1]的所有值
            const preIdKey = `${fullKey}[${item.id}]`;
            allKeys.forEach((_key) => {
                if (_key.indexOf(preKey) === 0) {
                    const replacedKey = _key.replace(preKey, preIdKey);
                    tmpObjValue[replacedKey] = { replacedKey: _key.replace(preKey, ''), value: allValues[_key] }
                    field.remove(_key);
                }
            });
        });
        groupList.forEach((item, i) => {  // 删除数据
            if (item.id === id) {
                groupList.splice(i, 1);
            }
        });

        groupList.forEach((item, i) => { // 重新对数据进行赋值
            const preKey = `${fullKey}[${i}]`; // app[0] 的所有值 和 app[1]的所有值
            const idKey = `${fullKey}[${item.id}]`;
            Object.keys(tmpObjValue).forEach((key) => {
                if (key.indexOf(idKey) === 0) {
                    const { replacedKey, value } = tmpObjValue[key];
                    field.setValue(`${preKey}${replacedKey}`, value)
                }
            });
        });
        changeField();
        this.setState({
            groupList
        });
    };

    addGroup = () => {
        const { groupList } = this.state;
        groupList.push({ id: generateNum() });
        this.setState({
            groupList
        })
    }

    render() {
        const { data = {}, renderServiceForm, fullKey } = this.props;
        const { groupList } = this.state;
        return (
            <div style={{ paddingRight: 20 }}>
                <div style={{ marginBottom: 10 }}>
                    <Button type="primary" onClick={this.addGroup}><Translation>添加项</Translation></Button>
                </div>
                {groupList.map((item, i) => {
                    return (
                        <div key={item.id} className="init-form-group">
                            <If condition={groupList.length > 1}>
                                <Icon className="remove-icon" type='ashbin' onClick={() => this.removeGroup(item.id)} style={{ position: 'absolute', right: -5, top: -30 }} />
                            </If>
                            <div style={{ width: '100%' }}>{Object.keys(data).map((key) => renderServiceForm(key, data[key], `${fullKey}[${i}].${key}`))}</div>
                        </div>
                    );
                })}
            </div>
        );
    }
}

export default ComplexFormStruct;
