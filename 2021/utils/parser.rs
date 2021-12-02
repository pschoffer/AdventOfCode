use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

pub fn parse_lines<T1> ( id: T1 )-> Vec<String>
    where
    T1: Into<Option<String>>,
{

    let mut filename = "./input.txt".to_string();
    let id_intoed = id.into();
    if id_intoed.is_some() {
        filename = format!("./test{}.txt", id_intoed.unwrap());
    }

    let mut final_lines : Vec<String> = Vec::new();
    if let Ok(lines) = read_lines(filename) {
        for line in lines {
            final_lines.push(line.unwrap());
        }
    }

    return final_lines;
}


fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
