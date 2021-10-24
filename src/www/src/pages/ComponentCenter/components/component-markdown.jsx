import React from "react";
import _ from 'loadsh';
import ReactMarkdown from "react-markdown";
import CodeBlock from "../../../components/CodeBlock";
import HeaderBlock from "../../../components/HeaderBlock";
import { addOpenLinks, removeOpenLinks } from '../../../utils/url';

export default class ComponentMarkdown extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: {},
        };
        this.linkListener = [];
    }

    async componentDidMount() {

        this.linkListener = addOpenLinks();
    }

    componentWillUnmount() {

        removeOpenLinks(this.linkListener);
    }




    render() {

        const { readme } = this.props;


        return (
            <If condition={readme}>
                <ReactMarkdown
                    source={readme}
                    renderers={{
                        code: CodeBlock,
                        heading: HeaderBlock,
                    }}
                />
            </If>
        );
    }
}


