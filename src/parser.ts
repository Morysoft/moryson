import csvParser from "csv-parser";

function tryParseJson(json: string) {
    try {
        return JSON.parse(json);
    } catch (error) {
        return error;
    }
}

export interface Parser {
    name: string;
    title: string;
    descrioption?: string;
    tryParse: (text: string) => any;
}

export const parsers: Parser[] = [
    {
        name: 'single-object-json',
        title: 'Single object JSON',
        tryParse: text => tryParseJson(text),
    },
    {
        name: 'multiline-json',
        title: 'Multiline JSON',
        tryParse: text => text.split('\n')
            .map(line => line.trim())
            .filter(line => line)
            .map(line => tryParseJson(line)),
    },
    // {
    //     name: 'csv-with-headers',
    //     title: 'CSV with Headers',
    //     tryParse: text => {
    //         text.split('\n')
    //             .map(line => line.trim()).filter(line => line).map(line => tryParseJson(line))
    //     },
    // },
    // {
    //     name: 'csv-no-headers',
    //     title: 'CSV without Headers',
    //     tryParse: text => {
    //         const results = [];

    //         csvParser([text]).
    //             .on('data', (data) => results.push(data))
    //             .on('end', () => {
    //                 console.log(results);
    //             });
    //     },
    // },
];

export const defaultParser: Parser = parsers[0];
