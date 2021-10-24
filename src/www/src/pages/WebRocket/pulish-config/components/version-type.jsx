import React from "react";
import { NumberPicker } from "@b-design/ui";
import "../index.scss";


class VersionType extends React.Component {
    constructor(props) {
        super(props);
        const initValue = props.defaultValue || '';
        const [a, b, c] = initValue.split('.');
        this.state = {
            a,
            b,
            c,
        };
    }


    componentWillReceiveProps = (nextProps) => {
        if (nextProps.defaultValue !== this.props.defaultValue) {
            const defaultValue = nextProps.defaultValue || '';
            const [a, b, c] = defaultValue.split('.');
            this.setState({
                a,
                b,
                c
            })
        }
    }

    setValue = (type, value) => {
        const currentState = this.state;
        currentState[type] = value;
        this.setState(currentState, () => {
            this.props.onChange(Object.keys(currentState).map((key) => currentState[key]).join('.'));
        })
    }


    render() {
        const { a, b, c } = this.state;
        return (
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <NumberPicker onChange={(value) => this.setValue('a', value)} value={a} />
                <div style={{ alignItems: 'end', fontSize: '20px', fontWeight: 'bold' }} >.</div>
                <NumberPicker onChange={(value) => this.setValue('b', value)} value={b} />
                <div style={{ alignItems: 'end', fontSize: '20px', fontWeight: 'bold' }} >.</div>
                <NumberPicker onChange={(value) => this.setValue('c', value)} value={c} />
            </div>
        );
    }
}

export default VersionType;
