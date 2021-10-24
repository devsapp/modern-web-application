import React from "react";
import { findDOMNode } from 'react-dom';

import Translation from "../Translation";
import './index.scss';
class BoxContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        this.el = findDOMNode(this);
    }
    toggleShowClass = () => {
        if (this.el.classList.contains('close')) {
            this.el.classList.remove('close');
        } else {
            this.el.classList.add('close');
        }

    }
    render() {
        const { title, desc, children } = this.props;
        return <div className="box-container">
            <div className="config-title-container" onClick={this.toggleShowClass}>
                <Translation>{title}</Translation>
                <div className="config-title-desc">{desc}</div>
            </div>
            <div className="config-box">
                {children}
            </div>
        </div>
    }
}

export default BoxContainer;
