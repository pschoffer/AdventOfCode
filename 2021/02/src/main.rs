#[path = "../../utils/parser.rs"]
mod parser;
#[path = "../../utils/submarine.rs"]
mod submarine;

fn main() {
    let lines = parser::parse_lines("1".to_string());
    // let lines = parser::parse_lines(None);
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

    let mut sub = submarine::Submarine::new();
    sub.load_instructions(&lines);
    sub.execute();
    println!();
    println!("RESULT is {}", sub.depth * sub.position);
}
