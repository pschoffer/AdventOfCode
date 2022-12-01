#!/bin/bash

FOLDER=$1;

mkdir $FOLDER
cd $FOLDER
touch test1.txt
touch input.txt

cat > "main.ts" << EOF
const path = require('path');
const inputPath = path.join(__dirname, 'input.txt');
const inputTestPath = path.join(__dirname, 'test1.txt');

const run = async () => {

}

run();
EOF

