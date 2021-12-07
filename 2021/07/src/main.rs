#[path = "../../utils/parser.rs"]
mod parser;
use std::collections::HashMap;

fn main() {
    // let lines = parser::parse_lines("1".to_string());
    let lines = parser::parse_lines(None);
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

    let crabs = parser::parse_items::<usize>(&lines[0]);

    let mut current_bounds = get_bounds(&crabs.keys().collect());
    let mut current_target = get_midpoint(current_bounds);
    let mut found_it = false;
    while !found_it {
        let fuel_cost = count_fuel(&crabs, current_target);
        let mut bounds_changed = false;
        if current_target > current_bounds.0 {
            let left_cost = count_fuel(&crabs, current_target - 1);
            if left_cost < fuel_cost {
                current_bounds = (current_bounds.0, current_target - 1);
                bounds_changed = true;
            }
        }
        if current_target < current_bounds.1 {
            let right_cost = count_fuel(&crabs, current_target + 1);
            if right_cost < fuel_cost {
                current_bounds = (current_target + 1, current_bounds.1);
                bounds_changed = true;
            }
        }

        if bounds_changed {
            current_target = get_midpoint(current_bounds);
        } else {
            found_it = true;
        }
        println!(
            "Crabs bounds {:?}, target {}, cost {}",
            current_bounds, current_target, fuel_cost
        );
    }
}

fn get_midpoint((lowest, highest): (usize, usize)) -> usize {
    let half_step = (highest - lowest) / 2;
    return lowest + half_step;
}

fn get_bounds(all: &Vec<&usize>) -> (usize, usize) {
    let mut lowest: Option<usize> = None;
    let mut highest: Option<usize> = None;
    for elem in all {
        let value = **elem;
        if lowest.is_none() {
            lowest = Some(value);
            highest = Some(value);
        } else {
            if value < lowest.unwrap() {
                lowest = Some(value)
            } else if value > highest.unwrap() {
                highest = Some(value);
            }
        }
    }

    return (lowest.unwrap(), highest.unwrap());
}

fn count_fuel(crabs: &HashMap<usize, usize>, target: usize) -> usize {
    let mut cost = 0;

    for key in crabs.keys() {
        if *key != target {
            let crab_count = crabs.get(key).unwrap();
            let distance = if *key > target {
                *key - target
            } else {
                target - *key
            };
            cost += count_fuel_for_distance(distance) * crab_count;
        }
    }

    return cost;
}

fn count_fuel_for_distance(distance: usize) -> usize {
    let mut current_distance = distance;
    let mut cost = 0;
    while current_distance > 0 {
        cost += current_distance;

        current_distance -= 1;
    }
    return cost;
}
