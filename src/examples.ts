export interface Example {
    data: string;
    code: string;
}

export const examples: Example[] = [{
    data: `{"Data":{"Data":[{"EventLogId":496357,"Source":{"Value":3,"Name":"WorkflowOverall"},"Type":3,"Action":{"Value":1,"Name":"Created"},"Info":{"WorkflowId":7715},"Date":"2021-03-25T12:51:23.577Z","UserId":100370,"UserName":"g.zedginidze g.zedginidze","CustomMessageId":null,"SystemMessage":null},{"EventLogId":496360,"Source":{"Value":3,"Name":"WorkflowOverall"},"Type":3,"Action":{"Value":20,"Name":"WorkflowStarted"},"Info":{"IsAuto":false,"WorkflowId":7715},"Date":"2021-03-25T12:52:26.533Z","UserId":100370,"UserName":"g.zedginidze g.zedginidze","CustomMessageId":null,"SystemMessage":null}],"Count":2,"SeqNumber":0},"HasError":false,"AlertType":"success","AlertMessage":null,"Message":null,"ModelErrors":null}`,
    code: `const changes = data.reduce((a, b) => a.concat(b), []);

    return changes.map(r => r.BaseObject && r.BaseObject.Id);`,
}];
