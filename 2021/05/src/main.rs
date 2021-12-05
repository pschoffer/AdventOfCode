#[path = "../../utils/parser.rs"]
mod parser;
#[path = "../../utils/point.rs"]
mod point;
use std::collections::HashMap;
use std::fmt;

fn main() {
    // let lines = parser::parse_lines("1".to_string());
    let lines = parser::parse_lines(None);
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

    let vents: Vec<Vent> = parse(lines);
    // println!("Vents {:?}", vents);

    let mut vent_points: HashMap<String, usize> = HashMap::new();
    for vent in vents {
        for point in vent.points {
            let key = point.to_string();
            if vent_points.contains_key(&key) {
                let old_value = vent_points.get(&key).unwrap().clone();
                vent_points.insert(key, old_value + 1);
            } else {
                vent_points.insert(key, 1);
            }
        }
    }

    let mut count_more_than_1 = 0;
    for key in vent_points.keys() {
        let value = vent_points.get(key).unwrap();
        if value > &1 {
            count_more_than_1 += 1;
        }
    }

    println!("RESULT is {}", count_more_than_1)
}

fn parse(lines: Vec<String>) -> Vec<Vent> {
    let mut vents: Vec<Vent> = Vec::new();

    for ix in 0..lines.len() {
        let coordinates: Vec<point::Point> = lines[ix]
            .split(" -> ")
            .map(|x| point::Point::parse(x.to_owned()))
            .collect();

        let line = point::line(&coordinates[0], &coordinates[1]);
        let new_vent = Vent::new(ix, line);
        vents.push(new_vent);
    }

    return vents;
}

struct Vent {
    pub id: usize,
    pub points: Vec<point::Point>,
}

impl Vent {
    pub fn new(id: usize, points: Vec<point::Point>) -> Self {
        Self { id, points }
    }
}

impl fmt::Debug for Vent {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "V-{}{:?}\n", self.id, self.points)
    }
}
