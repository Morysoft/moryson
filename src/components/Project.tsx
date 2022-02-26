/*eslint no-new-func: "off"*/

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Button from 'react-bootstrap/Button';
import ExecutorApi from '../executor-api';
import { defaultParser as DefaultParser, Parser, parsers } from '../parser';
import { examples } from '../examples';
import { Alert, ButtonGroup } from 'react-bootstrap';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { JsonVisualizer, ErrorVisualizer } from './Visualizer';

function Project() {
    const [code, setCode] = useState(examples[0].code);
    const [activeParser, setParser] = useState<Parser>(DefaultParser);
    const [textData, setTextData] = useState(examples[0].data);
    const data = useMemo(() => activeParser.tryParse(textData), [textData, activeParser]);
    const [result, setResult] = useState<any>();
    const [autoExecute, setAutoExecute] = useState(true);
    const processor = useMemo(() => {
        try {
            const func = Function('data', 'log', 'out', code);
            
            console.log(func);
            return func;
        } catch (error) {
            return () => error;
        }
    }, [code]);

    const execute = useCallback(
        () => {
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
        [data, processor],
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
        <section className={'form'}>
            <div className="form-group">
                <label htmlFor="inputText">Text Data</label>
                &nbsp;
                <ButtonGroup size="sm">
                    {parsers.map(parser => (
                        <Button key={parser.name}
                            onClick={() => setParser(parser)}
                            active={parser === activeParser}
                            title={parser.descrioption}>
                            {parser.title}
                        </Button>
                    ))}
                </ButtonGroup>
                &nbsp;
                <Button size='sm' onClick={() => setTextData('')} active={!!textData}>Clear</Button>
                {textData.length < 1_000_000
                    ? <textarea id="inputText" className='form-control' onChange={e => setTextData(e.target.value)} value={textData} />
                    : <Alert variant='warning'>Text is too large</Alert>}
            </div>
            <div className="form-group">
                <label htmlFor="inputCode">Code</label>
                &nbsp;
                <ButtonGroup size="sm">
                    <Button>JavaScript</Button>
                </ButtonGroup>
                <div
                    className='form-control'
                    style={{ height: 'auto' }}>
                    <CodeEditor
                        value={code}
                        language="js"
                        placeholder="Please enter JS code."
                        onChange={(evn) => setCode(evn.target.value)}
                        padding={0}
                        minHeight={150}
                        style={{
                            fontSize: 12,
                            // backgroundColor: "#f5f5f5",
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                        }}
                    />
                </div>
                <div id="codeHelp" className="form-text text-muted">
                    <ul>
                        <li><code>data</code> Input data</li>
                        <li><code>log</code> Equivalent of console.log</li>
                    </ul>
                </div>
            </div>
            <div className="">
                <label htmlFor="inputCode">Output</label>
                &nbsp;
                <ButtonGroup size="sm">
                    <Button>Returned</Button>
                </ButtonGroup>
                <div>
                    {result instanceof Error
                        ? <ErrorVisualizer error={result} func={processor} />
                        : <JsonVisualizer data={result} />}
                </div>
            </div>
            <div className="form-group">
                <Button onClick={execute} disabled={autoExecute}>Execute</Button>
                &nbsp;
                <label><input id="autoExecuteCheckbox" type="checkbox" checked={autoExecute} onChange={e => setAutoExecute(e.target.checked)} /> Auto Execure</label>
            </div>
        </section>
    );
}

export default Project;
