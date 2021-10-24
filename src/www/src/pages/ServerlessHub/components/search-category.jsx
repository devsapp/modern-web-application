import React from "react";
import _ from "loadsh";
import { Radio } from "@b-design/ui";
import "./index.scss";


// const { Group: CheckboxGroup } = Checkbox;
const RadioGroup = Radio.Group;

export default function SearchCategory({ category, changeCategory, changeRuntime }) {
    return (
        <div className="search-container" >
            <div className="search-main-title">筛选条件</div>
            <div className="search-sub-title">分类</div>
            <div className="search-category-info">
                <RadioGroup
                    onChange={changeCategory}
                    dataSource={category}
                />
            </div>
            {/* <div className="search-sub-title">运行时</div>
            <div className="search-category-info">
                <CheckboxGroup
                    onChange={changeRuntime}
                    dataSource={RUNTIME_LIST}
                />
            </div> */}
        </div>
    );
}