import React, { useCallback, useEffect, useMemo, useState } from 'react';
import CodeEditor from '@uiw/react-textarea-code-editor';
import { examples } from '../examples';

export function JavaScriptProcessor() {
    const [code, setCode] = useState(examples[0].code);
    return <div>
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
                <li><code>out</code> Use to output results</li>
                <li>
                    <code>tools</code> External libs
                    <ul>
                        <li><code>tools.jslinq</code> <a href='https://www.npmjs.com/package/jslinq' target={'_blank'} rel="noreferrer">jslinq</a></li>
                    </ul>
                </li>
            </ul>
        </div></div>;
}
