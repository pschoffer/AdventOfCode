#[path = "../../utils/parser.rs"]
mod parser;
use std::collections::HashMap;
use std::fmt;

fn main() {
    // let lines = parser::parse_lines("1".to_string());
    let lines = parser::parse_lines(None);
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

    let mut fishes = FishColony::parse(&lines[0]);

    for _day in 0..256 {
        fishes.age();
        println!("Doing day {}", _day);
    }
    println!("RESULT is {}", fishes);
}

struct FishColony {
    pub fishes: HashMap<usize, usize>,
}

impl FishColony {
    pub fn parse(input_str: &String) -> Self {
        let mut fishes: HashMap<usize, usize> = HashMap::new();

        let ages: Vec<usize> = input_str
            .split(",")
            .map(|item| item.parse::<usize>().unwrap())
            .collect();

        for age in ages {
            if fishes.contains_key(&age) {
                let old_count = fishes.get(&age).unwrap().clone();
                fishes.insert(age, old_count + 1);
            } else {
                fishes.insert(age, 1);
            }
        }

        Self { fishes }
    }

    pub fn age(&mut self) {
        let mut new_fishes: HashMap<usize, usize> = HashMap::new();
        for age in self.fishes.keys() {
            let count = self.fishes.get(age).unwrap().clone();
            if *age == 0 {
                self.carefuly_set(&mut new_fishes, 6, count);
                new_fishes.insert(8, count);
            } else if *age == 7 {
                self.carefuly_set(&mut new_fishes, 6, count);
            } else {
                new_fishes.insert(*age - 1, count);
            }
        }
        self.fishes = new_fishes;
    }

    fn carefuly_set(&self, target: &mut HashMap<usize, usize>, key: usize, value: usize) {
        if target.contains_key(&key) {
            let old_count = target.get(&key).unwrap().clone();
            target.insert(key, old_count + value);
        } else {
            target.insert(key, value);
        }
    }

    pub fn count_fish(&self) -> usize {
        let mut total = 0;
        for age in self.fishes.keys() {
            let count = self.fishes.get(age).unwrap().clone();
            total += count;
        }
        return total;
    }
}

impl fmt::Display for FishColony {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut fishes: Vec<String> = Vec::new();
        for age in self.fishes.keys() {
            let count = self.fishes.get(age).unwrap().clone();
            fishes.push(format!("{}<{}>", age, count));
        }

        write!(f, "{} - {:?}\n", self.count_fish(), fishes.join(","))
    }
}
