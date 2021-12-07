use std::collections::HashMap;
use std::fmt::Debug;
use std::fs::File;
use std::hash::Hash;
use std::io::{self, BufRead};
use std::path::Path;
use std::str::FromStr;

pub fn parse_lines<T1>(id: T1) -> Vec<String>
where
    T1: Into<Option<String>>,
{
    let mut filename = "./input.txt".to_string();
    let id_intoed = id.into();
    if id_intoed.is_some() {
        filename = format!("./test{}.txt", id_intoed.unwrap());
    }

    let mut final_lines: Vec<String> = Vec::new();
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

pub fn parse_items<T>(input_str: &String) -> HashMap<T, usize>
where
    T: FromStr + Hash + Eq + Debug,
    <T as FromStr>::Err: Debug,
{
    let mut result: HashMap<T, usize> = HashMap::new();

    let ages: Vec<T> = input_str
        .split(",")
        .map(|item| item.parse::<T>().unwrap())
        .collect();

    for age in ages {
        if result.contains_key(&age) {
            let old_count = result.get(&age).unwrap().clone();
            result.insert(age, old_count + 1);
        } else {
            result.insert(age, 1);
        }
    }

    return result;
}
