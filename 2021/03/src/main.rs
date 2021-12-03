#[path = "../../utils/parser.rs"]
mod parser;
#[path = "../../utils/binary.rs"]
mod binary;

fn main() {
    // let lines = parser::parse_lines("1".to_string());
    let lines = parser::parse_lines(None);
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

    let total_count = lines.len();
    let line_size = lines[0].len();

    let mut counters: Vec<usize> = (0..line_size).map(|_x| 0).collect();
    for number in lines {
        let chars: Vec<char> = number.chars().collect();
        for ix in 0..(line_size) {
            let character = chars[ix];
            if character == '1' {
                counters[ix] = counters[ix] + 1;
            }
        }
    }

    let mut gama_bin: Vec<u8> = Vec::new();
    let mut epsilon_bin: Vec<u8> = Vec::new();
    for ix in 0..(line_size) {
        if counters[ix] > (total_count / 2) {
            gama_bin.push(1);
            epsilon_bin.push(0);
        } else {
            gama_bin.push(0);
            epsilon_bin.push(1);
        }
    }

    let gama = binary::to_dec(gama_bin);
    let epsilon = binary::to_dec(epsilon_bin);

    println!("REULT is {}", gama * epsilon)
}
