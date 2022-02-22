/*eslint no-new-func: "off"*/

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import './App.scss';
import Button from 'react-bootstrap/Button';
import ExecutorApi from './executor-api';

function tryParseJson(json: string) {
  try {
    return JSON.parse(json);
  } catch (error) {
    return error;
  }
}

function App() {
  // const [code, setCode] = useState(`return data`);
  const [code, setCode] = useState(`const changes = data.reduce((a, b) => a.concat(b), []);

  return changes.map(r => r.BaseObject && r.BaseObject.Id);`);
  const [parsingMode, setParsingMode] = useState<'full' | 'line'>('line');
  const [json, setJson] = useState(`{"Data":{"Data":[{"EventLogId":496357,"Source":{"Value":3,"Name":"WorkflowOverall"},"Type":3,"Action":{"Value":1,"Name":"Created"},"Info":{"WorkflowId":7715},"Date":"2021-03-25T12:51:23.577Z","UserId":100370,"UserName":"g.zedginidze g.zedginidze","CustomMessageId":null,"SystemMessage":null},{"EventLogId":496360,"Source":{"Value":3,"Name":"WorkflowOverall"},"Type":3,"Action":{"Value":20,"Name":"WorkflowStarted"},"Info":{"IsAuto":false,"WorkflowId":7715},"Date":"2021-03-25T12:52:26.533Z","UserId":100370,"UserName":"g.zedginidze g.zedginidze","CustomMessageId":null,"SystemMessage":null}],"Count":2,"SeqNumber":0},"HasError":false,"AlertType":"success","AlertMessage":null,"Message":null,"ModelErrors":null}`);
  const [result, setResult] = useState<any>();
  const [autoExecute, setAutoExecute] = useState(true);
  const processor = useMemo(() => {
    try {
      return Function('data', 'log', code);
    } catch (error) {
      return () => error;
    }
  }, [code]);

  const execute = useCallback(
    () => {
      const data = parsingMode === 'full' ? tryParseJson(json) : json.split('\n').map(line => tryParseJson(line));

      if (data instanceof Error) {
        return setResult(data);
      }

      const { log } = ExecutorApi;

      try {
        const res = processor(data, log);

        if (typeof res !== 'function') {
          setResult(res);
        } else {
          setResult(new Error('Function returned.'));
        }
      } catch (error) {
        setResult(error);
      }
    },
    [json, parsingMode, processor],
  );

  useEffect(() => {
    let timeoutHandler: NodeJS.Timeout;

    if (autoExecute) {
      timeoutHandler = setTimeout(() => execute(), 500);
    }

    return () => {
      clearTimeout(timeoutHandler);
    }
  }, [autoExecute, execute]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>mory<b>son</b></h1>
      </header>
      <section className={'form'}>
        <div className="form-group">
          <label htmlFor="inputJson">JSON</label>
          &nbsp;
          <span>
            <label><input type="radio" onChange={e => e.target.checked && setParsingMode('line')} checked={parsingMode === 'line'} /> Line</label>
            &nbsp;
            <label><input type="radio" onChange={e => e.target.checked && setParsingMode('full')} checked={parsingMode === 'full'} /> Full</label>
          </span>
          <textarea id="inputJson" onChange={e => setJson(e.target.value)} value={json} />
        </div>
        <div className="form-group">
          <label htmlFor="inputCode">Code (JavaScript)</label>
          <textarea id="inputCode" onChange={e => setCode(e.target.value)} value={code} />
          <div id="codeHelp" className="form-text text-muted">
            <ul>
              <li><code>data</code> Parsed json</li>
              <li><code>log</code> Equivalent of console.log</li>
            </ul>
          </div>
        </div>
        <div className="">
          <label htmlFor="inputCode">Result</label>
          <div>
            {result instanceof Error ? <div>
              <h4>{result.name}</h4>
              <p>{result.message}</p>
              {/* <pre>{result.stack}</pre> */}
            </div> : <pre>{result === undefined ? '[UNDEFINED]' : JSON.stringify(result, undefined, 4)}</pre>}
          </div>
        </div>
        <div className="form-group">
          <Button onClick={execute} disabled={autoExecute}>Execute</Button>
          &nbsp;
          <label><input id="autoExecuteCheckbox" type="checkbox" checked={autoExecute} onChange={e => setAutoExecute(e.target.checked)} /> Auto Execure</label>
        </div>
      </section>
    </div>
  );
}

export default App;
