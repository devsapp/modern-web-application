import React from "react";
import { findDOMNode } from 'react-dom';

import Translation from "./Translation";

export default class SimpleFoldContainer extends React.Component {
    constructor(props) {
        super(props);
    }
    componentDidMount = () => {
        this.el = findDOMNode(this);
    }
    toggleShowClass = () => {
        const { resetDomClassName } = this.props;
        if (resetDomClassName) {
            const activeDom = document.querySelector(`.${resetDomClassName}`).querySelectorAll('.active');
            if (activeDom) {
                activeDom.forEach((el) => {
                    el.classList.remove('active');
                })
            }
        }

        document.querySelectorAll('.fold-title').forEach((el) => {
            el.classList.remove('active');
        })

        const foldDom = this.el.querySelector('.fold-title');
        foldDom && foldDom.classList.add('active');
        if (this.el.classList.contains('close')) {
            this.el.classList.remove('close');
        } else {
            this.el.classList.add('close');
        }

    }
    render() {
        const { title, desc, children, height = 320, isClose = false } = this.props;
        return <div className={isClose ? 'fold-container close' : 'fold-container'}>
            <div className="title fold-title" onClick={this.toggleShowClass}>
                <Translation>{title}</Translation>
                <div className="desc">{desc}</div>
            </div>
            <div className="content" style={{ overflowY: 'auto', height }}>
                {children}
            </div>
        </div>
    }
}
