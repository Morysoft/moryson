import CodeEditor from '@uiw/react-textarea-code-editor';
import { useState } from 'react';
import { Alert, Button, ButtonGroup } from 'react-bootstrap';

interface EvalErrorStack {
    func: string;
    row: number;
    col: number;
}

export function ErrorVisualizer({ error, func }: { error: Error, func: Function }) {
    const stack: EvalErrorStack[] = [];

    if (error.stack) {
        const regex = /at (?<func>[$A-Z_][0-9A-Z_$]*) \(eval at <anonymous> \(.*\), <anonymous>:(?<row>\d+):(?<col>\d+)\)/iug;
        const str = error.stack;
        // const funcLines = func.toString().split('\n');
        let m;

        while ((m = regex.exec(str)) !== null) {
            // This is necessary to avoid infinite loops with zero-width matches
            if (m.index === regex.lastIndex) {
                regex.lastIndex++;
            }

            if (!m.groups) {
                continue;
            }

            stack.push({
                func: m.groups['func'],
                row: parseInt(m.groups['row']),
                col: parseInt(m.groups['col']),
            });
        }
    }

    return <Alert variant='danger'>
        <Alert.Heading>{error.name}</Alert.Heading>
        <p>{error.message}</p>
        {stack.map(({ func, row, col }) => <pre key={`${func}:${row}:${col}`}>{func}:{row}:{col}</pre>)}

        <div
            className='form-control'
            style={{ height: 'auto' }}>
            <CodeEditor
                value={func.toString()}
                language="js"
                placeholder="Please enter JS code."
                readOnly
                padding={0}
                minHeight={150}
                style={{
                    fontSize: 12,
                    // backgroundColor: "#f5f5f5",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                }}
            />
        </div>
    </Alert>;
}

export function JsonVisualizer({ data, limit = 1_000_000 }: { data: any, limit?: number }) {
    const json = data === undefined ? '[UNDEFINED]' : JSON.stringify(data, undefined, 4);

    return <div>
        {json.length > limit
            ? <Alert variant='warning'>JSON is too large</Alert>
            : <pre className='form-control' style={{ height: 'auto' }}>{json}</pre>}
    </div>;
}

export function TableVisualizer({ data, limit = 100_000 }: { data: any, limit?: number }) {
    if (!data) {
        return <Alert variant='warning'>[UNDEFINED]</Alert>;
    }

    if (!Array.isArray(data)) {
        data = [data];
    }

    if (data.length === 0) {
        return <Alert variant='warning'>[EMPTY]</Alert>;
    }

    const columns = Object.keys(data[0]);

    const table: any[] = data || [];

    return <table>
        <thead>
            <tr>
                {columns.map(c => <th key={c}>{c}</th>)}
            </tr>
        </thead>
        <tbody>
            {table.map((row, j) => <tr key={j}>
                {columns.map(c => <td key={c}>{row[c]}</td>)}
            </tr>)}
        </tbody>
    </table>;
}

export function DataVisualizer({ data }: { data: any }) {
    const [visualizer, setVisualizer] = useState('json');

    function Visualizer() {
        switch (visualizer) {
            case 'table':
                return <TableVisualizer data={data} />;
            default:
                return <JsonVisualizer data={data} />;
        }
    }

    return <div>
        <ButtonGroup size="sm">
            <Button active={visualizer === 'json'} onClick={() => setVisualizer('json')}>JSON</Button>
            <Button active={visualizer === 'table'} onClick={() => setVisualizer('table')}>Table</Button>
        </ButtonGroup>

        <Visualizer />
    </div>
}
