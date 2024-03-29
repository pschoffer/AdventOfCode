use std::fs::File;
use std::io::{self, BufRead};
use std::path::Path;

fn main() {
    if let Ok(lines) = read_lines("./input.txt") {
        // Consumes the iterator, returns an (Optional) String
        let mut prevprev = -1;
        let mut prev = -1;
        let mut sumprev = -1;
        let mut counter = 0;
        for line in lines {
            if let Ok(depth) = line {
                let current = depth.parse::<i32>().unwrap();
                if prevprev >= 0 {
                    let sum = current + prev + prevprev;
                    if sumprev >= 0 {
                        if sum > sumprev {
                            counter += 1;
                        }
                    }
                    sumprev = sum;
                }
                prevprev = prev;
                prev = current;
            }
        }
        println!("Result is {}", counter);
    }
}

// The output is wrapped in a Result to allow matching on errors
// Returns an Iterator to the Reader of the lines of the file.
fn read_lines<P>(filename: P) -> io::Result<io::Lines<io::BufReader<File>>>
where
    P: AsRef<Path>,
{
    let file = File::open(filename)?;
    Ok(io::BufReader::new(file).lines())
}
