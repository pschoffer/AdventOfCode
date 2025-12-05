#!/bin/bash

FOLDER=$1;

mkdir $FOLDER
cd $FOLDER
touch test1.txt
touch input.txt

cat > "main.ts" << EOF
import * as path from 'path';
import * as fs from 'fs';
import { explode, parseArea } from '../lib/area.js';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {
    const input = parseInput(inputTestPath);
    console.log(JSON.stringify(input, null, 2))
}

const parseInput = (inputPath: string) => {
    const data = fs.readFileSync(inputPath, 'utf8');
    const lines: string[] = data.split("\n");

    const result = [];

    for (const line of lines) {
        result.push(line);
    }

    return result;
}

run();
EOF

