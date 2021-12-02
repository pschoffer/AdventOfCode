#!/bin/bash

mkdir $1
cd $1
cargo init --name "advent"
touch test.txt
touch input.txt