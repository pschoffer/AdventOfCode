use std::fmt;

pub struct Point {
    pub coordinates: Vec<isize>,
}

impl Point {
    pub fn new(coordinates: Vec<isize>) -> Self {
        Self { coordinates }
    }
    pub fn parse(coordinate_string: String) -> Self {
        let coordinates: Vec<isize> = coordinate_string
            .split(",")
            .map(|value| value.parse::<isize>().unwrap())
            .collect();
        Self::new(coordinates)
    }

    pub fn apply_diff(&mut self, diff: &Point) {
        for ix in 0..self.coordinates.len() {
            self.coordinates[ix] += diff.coordinates[ix];
        }
    }

    pub fn clone(&self) -> Self {
        Self {
            coordinates: self.coordinates.to_vec(),
        }
    }

    pub fn to_string(&self) -> String {
        return format!("P{:?}", self.coordinates);
    }
}

impl fmt::Debug for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.to_string())
    }
}
impl fmt::Display for Point {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(f, "{}", self.to_string())
    }
}

pub fn _dimention_diff_count(a: &Point, b: &Point) -> usize {
    let mut result = 0;
    for ix in 0..a.coordinates.len() {
        if a.coordinates[ix] != b.coordinates[ix] {
            result += 1;
        }
    }
    return result;
}

pub fn line(a: &Point, b: &Point) -> Vec<Point> {
    let mut result: Vec<Point> = Vec::new();

    let mut step = a.clone();
    for ix in 0..a.coordinates.len() {
        if a.coordinates[ix] == b.coordinates[ix] {
            step.coordinates[ix] = 0;
        } else {
            if a.coordinates[ix] > b.coordinates[ix] {
                step.coordinates[ix] = -1;
            } else {
                step.coordinates[ix] = 1;
            }
        }
    }

    let mut start_point = a.clone();
    while start_point.to_string() != b.to_string() {
        result.push(start_point.clone());

        start_point.apply_diff(&step);
    }
    result.push(b.clone());

    return result;
}
