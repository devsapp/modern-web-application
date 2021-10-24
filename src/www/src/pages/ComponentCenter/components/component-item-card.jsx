import React, { Component } from "react";
import { findDOMNode } from 'react-dom';
import _ from "loadsh";
import { Search, Loading, Breadcrumb, Input, Tag } from '@b-design/ui';

export default class ComponentItemCard extends Component {

    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount = async () => {
        this.el = findDOMNode(this);
    }

    highlightComponentCard = () => {
        const activeDom = document.querySelector('.component-list-container').querySelectorAll('.active');
        if(activeDom) {
            activeDom.forEach((el)=>{
                el.classList.remove('active');
            })
        }
        this.el.classList.add('active');
    }
    chooseComponent = () => {
        this.highlightComponentCard();
        const { data = {}, getComponentInfo } = this.props;
        getComponentInfo(data);
    }

    render() {
        const { data = {}, } = this.props;
        return <div className="component-item-card" onClick={this.chooseComponent}>
            <div className="avartor-container">
                <div className="avartor"></div>
            </div>
            <div className="detail">
                <div className="top-content">
                    <div className="tite">{data.name || ''}</div>
                    <div className="version">{data.version}</div>
                    <div className="downloadnumber">下载数：{data.download || ''}</div>
                    <div className="star"></div>
                </div>
                <div className="inner-content">
                    <div className="desc">{data.description || ''}</div>
                </div>
                {/* <div style={{ position: 'absolute', right: 4, bottom: 6 }}>
                    <Tag ><span>删除</span></Tag>
                </div> */}
            </div>
        </div>
    }
}