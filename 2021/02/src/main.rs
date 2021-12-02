#[path = "../../utils/parser.rs"]
mod parser;
#[path = "../../utils/submarine.rs"]
mod submarine;

fn main() {
    let lines = parser::parse_lines("1".to_string());
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

    let sub = submarine::Submarine::new();
}
