import React, { Component } from "react";
import { Breadcrumb } from '@b-design/ui';
import PublishConfig from '../WebRocket/pulish-config';

export default class PublishView extends Component {

    constructor(props) {
        super(props);
        this.state = {

        }

    }

    componentDidMount = async () => {

    }



    render() {

        return <div className="page-container">
            <div className="page-title-container">
                {/* <div className="title-name">发布中心</div>
                <div className="title-desc"></div> */}
                <div className="title-container">
                    <span className="title-breadcrumb">
                        <Breadcrumb separator="/">
                            <Breadcrumb.Item onClick={() => this.props.history.goBack()} >工作空间</Breadcrumb.Item>
                            <Breadcrumb.Item >发布中心</Breadcrumb.Item>
                        </Breadcrumb>
                    </span>
                </div>
            </div>
            <div className="center-content-container">
                <PublishConfig {...this.props} />
            </div>

        </div>

    }
}
