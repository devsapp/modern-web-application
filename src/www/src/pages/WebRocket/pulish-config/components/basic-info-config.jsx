import React from "react";
import { findDOMNode } from 'react-dom';
import { Form, Select, Input } from "@b-design/ui";
import { PUBLISH_FOTM_ITEM_LAYOUT, APP_CATEGORY } from '../../../../constants';
import Translation from "../../../../components/Translation";
import BoxContainer from '../../../../components/box-container';
import VersionType from './version-type';
import TagType from './tag-type';
const TYPE_LIST = [{ label: '应用', value: 'Application' }, { label: '组件', value: 'Component' }];

class BasicInfoConfig extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { configValue = {}, chooseNewWrokspace, workspace } = this.props;
        return <BoxContainer title="基本信息" desc="描述应用或者组件的基本信息">
            <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', top: -63, left: 120, fontSize: '16px', cursor: 'pointer' }} onClick={chooseNewWrokspace}>
                当前工作空间：<span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>{workspace}</span>
            </div>
            <Form.Item
                {...PUBLISH_FOTM_ITEM_LAYOUT}
                label={<Translation>类型</Translation>}
                labelTextAlign="left"
                hasFeedback
                required
            >
                <Select dataSource={TYPE_LIST} name="Type" defaultValue={configValue.Type} style={{ width: '100%' }} />
            </Form.Item>
            <Form.Item
                {...PUBLISH_FOTM_ITEM_LAYOUT}
                label={<Translation>名称</Translation>}
                labelTextAlign="left"
                hasFeedback
                required
            >
                <Input
                    type="line"
                    size="medium"
                    theme="dark"
                    name="Name"
                    defaultValue={configValue.Name}
                />
            </Form.Item>
            <Form.Item
                {...PUBLISH_FOTM_ITEM_LAYOUT}
                label={<Translation>版本</Translation>}
                labelTextAlign="left"
                hasFeedback
                required
            >
                <VersionType name="Version" defaultValue={configValue.Version} />
            </Form.Item>
            <Form.Item
                {...PUBLISH_FOTM_ITEM_LAYOUT}
                label={<Translation>类别</Translation>}
                labelTextAlign="left"
                hasFeedback
                required
            >
                <Select
                    dataSource={APP_CATEGORY}
                    name="Category"
                    defaultValue={configValue.Category}
                    style={{ width: '100%' }}
                />
            </Form.Item>
            <Form.Item
                {...PUBLISH_FOTM_ITEM_LAYOUT}
                label={<Translation>首页</Translation>}
                labelTextAlign="left"
                hasFeedback
            >
                <Input
                    type="line"
                    size="medium"
                    theme="dark"
                    name="HomePage"
                    defaultValue={configValue.HomePage}
                />
            </Form.Item>
            <If condition={configValue.Tags}>
                <Form.Item
                    {...PUBLISH_FOTM_ITEM_LAYOUT}
                    label={<Translation>标签</Translation>}
                    labelTextAlign="left"
                    hasFeedback
                >
                    <TagType name='Tags' defaultValue={configValue.Tags} />
                </Form.Item>
            </If>
            <Form.Item
                {...PUBLISH_FOTM_ITEM_LAYOUT}
                label={<Translation>描述</Translation>}
                labelTextAlign="left"
                hasFeedback
            >
                <Input.TextArea style={{ width: '100%' }} name="Description" defaultValue={configValue.Description} />
            </Form.Item>
        </BoxContainer>
        // <div className="box-container" id={CONTAINER_ID}>
        //     <div className="config-title-container" onClick={this.toggleShowClass}>
        //         <Translation>基本信息</Translation>
        //         <div className="config-title-desc">描述应用或者组件的基本信息</div>
        //     </div>
        //     <div className="config-box">
        //         <Form.Item
        //             {...PUBLISH_FOTM_ITEM_LAYOUT}
        //             label={<Translation>类型</Translation>}
        //             labelTextAlign="left"
        //             hasFeedback
        //             required
        //         >
        //             <Select dataSource={TYPE_LIST} name="Type" defaultValue={configValue.Type} style={{ width: '100%' }} />
        //         </Form.Item>
        //         <Form.Item
        //             {...PUBLISH_FOTM_ITEM_LAYOUT}
        //             label={<Translation>名称</Translation>}
        //             labelTextAlign="left"
        //             hasFeedback
        //             required
        //         >
        //             <Input
        //                 type="line"
        //                 size="medium"
        //                 theme="dark"
        //                 name="Name"
        //                 defaultValue={configValue.Name}
        //             />
        //         </Form.Item>
        //         <Form.Item
        //             {...PUBLISH_FOTM_ITEM_LAYOUT}
        //             label={<Translation>版本</Translation>}
        //             labelTextAlign="left"
        //             hasFeedback
        //             required
        //         >
        //             <VersionType name="Version" defaultValue={configValue.Version} />
        //         </Form.Item>
        //         <Form.Item
        //             {...PUBLISH_FOTM_ITEM_LAYOUT}
        //             label={<Translation>类别</Translation>}
        //             labelTextAlign="left"
        //             hasFeedback
        //             required
        //         >
        //             <Select
        //                 dataSource={APP_CATEGORY}
        //                 name="Category"
        //                 defaultValue={configValue.Category}
        //                 style={{ width: '100%' }}
        //             />
        //         </Form.Item>
        //         <Form.Item
        //             {...PUBLISH_FOTM_ITEM_LAYOUT}
        //             label={<Translation>首页</Translation>}
        //             labelTextAlign="left"
        //             hasFeedback
        //         >
        //             <Input
        //                 type="line"
        //                 size="medium"
        //                 theme="dark"
        //                 name="HomePage"
        //                 defaultValue={configValue.HomePage}
        //             />
        //         </Form.Item>
        //         <If condition={configValue.Tags}>
        //             <Form.Item
        //                 {...PUBLISH_FOTM_ITEM_LAYOUT}
        //                 label={<Translation>标签</Translation>}
        //                 labelTextAlign="left"
        //                 hasFeedback
        //             >
        //                 <TagType name='Tags' defaultValue={configValue.Tags} />
        //             </Form.Item>
        //         </If>
        //         <Form.Item
        //             {...PUBLISH_FOTM_ITEM_LAYOUT}
        //             label={<Translation>描述</Translation>}
        //             labelTextAlign="left"
        //             hasFeedback
        //         >
        //             <Input.TextArea style={{ width: '100%' }} name="Description" defaultValue={configValue.Description} />
        //         </Form.Item>
        //     </div>
        // </div>
    }
}

export default BasicInfoConfig;
