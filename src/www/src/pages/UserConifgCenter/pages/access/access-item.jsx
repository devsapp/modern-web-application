import React from "react";
import { Icon } from "@b-design/ui";

export default function AccessItem({ name, data, removeAccess }) {
    return (
        <div className="access-item">
            <Icon type="ashbin" className="access-remove" onClick={() => removeAccess(name)} />
            <div className="access-title">秘钥别名: <span className="access-aliasname">{name}</span></div>
            <div className="access-info-tip">秘钥信息:</div>
            <div className="access-info-item">{Object.keys(data).map((key) => {
                return <div className="access-item-tab">
                    <span className="access-info-key">{key}:</span>
                    <span className="access-info-value">{data[key]}</span>
                </div>
            })}</div>
        </div>
    );
}