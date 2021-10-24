import React from "react";
import { Tag, Select } from "@b-design/ui";

import { APP_CATEGORY } from '../../../../constants';
import "../index.scss";
const { Group: TagGroup } = Tag;

class TagType extends React.Component {
    constructor(props) {
        super(props);
        const tagArr = props.defaultValue || [];
        this.state = {
            tagArr
        };
    }

    componentWillReceiveProps = (nextProps) => {
        if (nextProps.defaultValue && nextProps.defaultValue !== this.props.defaultValue) {
            const defaultValue = nextProps.defaultValue;
            this.setState({
                tagArr: defaultValue
            })
        }
    }

    render() {
        const { tagArr } = this.state;
        return (
            <div >
                <div>
                    <TagGroup>
                        {tagArr.map((tag, i) => (
                            <Tag key={`tag-${i}`} type="normal" color={'#0064c8'}>
                                <span style={{ color: '#fff' }}>{tag}</span>
                            </Tag>
                        ))}
                    </TagGroup>
                </div>
                <div>
                    <Select
                        style={{ width: '100%' }}
                        dataSource={APP_CATEGORY}
                        value={tagArr}
                        onChange={this.props.onChange}
                        aria-label="标签操作"
                        mode="tag" />
                </div>
            </div>
        );
    }
}

export default TagType;
