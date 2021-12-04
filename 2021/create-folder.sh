#!/bin/bash

FOLDER=$1;

mkdir $FOLDER
cd $FOLDER
cargo init --name "advent"
touch test1.txt
touch input.txt

cat > "src/main.rs" << EOF
#[path = "../../utils/parser.rs"]
mod parser;

fn main() {
    let lines = parser::parse_lines("1".to_string());
    // let lines = parser::parse_lines(None);
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);
}
EOF

