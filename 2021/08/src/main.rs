#[path = "../../utils/parser.rs"]
mod parser;
use std::collections::HashSet;
use std::fmt;

fn main() {
    // let lines = parser::parse_lines("1".to_string());
    let lines = parser::parse_lines(None);
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

    let mut entries: Vec<Entry> = Vec::new();
    for line in lines {
        entries.push(Entry::parse(&line));
    }

    let mut count_easy = 0;
    for entry in entries {
        for output in entry.outputs {
            let output_signal_count = output.signals.len();
            if output_signal_count == 2
                || output_signal_count == 3
                || output_signal_count == 4
                || output_signal_count == 7
            {
                count_easy += 1;
            }
        }
    }
    println!("RESULT {}", count_easy)
}

struct Entry {
    pub patterns: Vec<SignalGroup>,
    pub outputs: Vec<SignalGroup>,
}

impl Entry {
    pub fn parse(line: &str) -> Self {
        let mut patterns: Vec<SignalGroup> = Vec::new();
        let mut outputs: Vec<SignalGroup> = Vec::new();

        let parts: Vec<&str> = line.split_whitespace().collect();
        let mut output_section = false;
        for part in parts {
            if output_section {
                outputs.push(SignalGroup::parse(part));
            } else if part == "|" {
                output_section = true;
            } else {
                patterns.push(SignalGroup::parse(part));
            }
        }

        Self { patterns, outputs }
    }
}

impl fmt::Debug for Entry {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "Outputs - {}", self.outputs.len())
    }
}

struct SignalGroup {
    pub signals: HashSet<char>,
}

impl SignalGroup {
    pub fn parse(line: &str) -> Self {
        let mut signals: HashSet<char> = HashSet::new();

        let parts: Vec<char> = line.chars().collect();
        for part in parts {
            signals.insert(part);
        }

        Self { signals }
    }
}
