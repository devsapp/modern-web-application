
import React from "react";
import moment from 'moment';
import { CodeSnippet, Button } from '@b-design/ui';
export default function CommandActionItem({ data, openResultDetail }) {
    return <React.Fragment>
        <div className="command-item"><span className="word">执行指令:</span><CodeSnippet code={`s ${data.customerCommand} ${data.method} ${data.params}`} style={{ width: 400 }} width={400} /></div>
        <div className="command-item"><span className="word">执行结果:</span>{data.isOk ? <span style={{ color: "green" }}>成功</span> : <span style={{ color: 'red' }}>失败</span>} <Button text onClick={() => openResultDetail(data.resultText)}>点击查看详情</Button></div>
        <div className="command-item"><span className="word">执行时间:</span>{moment(data.create_time).format('YYYY-MM-DD HH:mm:ss')}</div>
    </React.Fragment>
}