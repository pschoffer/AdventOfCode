use std::fmt;

pub struct Point {
    pub coordinates: Vec<usize>,
}

impl Point {
    pub fn new(coordinates: Vec<usize>) -> Self {
        Self { coordinates }
    }
    pub fn parse(coordinate_string: String) -> Self {
        let coordinates: Vec<usize> = coordinate_string
            .split(",")
            .map(|value| value.parse::<usize>().unwrap())
            .collect();
        Self::new(coordinates)
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

pub fn dimention_diff_count(a: &Point, b: &Point) -> usize {
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

    let mut diff_dim_ix_opt: Option<usize> = None;
    let mut decreasing = false;
    for ix in 0..a.coordinates.len() {
        if a.coordinates[ix] != b.coordinates[ix] {
            diff_dim_ix_opt = Some(ix);
            if a.coordinates[ix] > b.coordinates[ix] {
                decreasing = true;
            } else {
                decreasing = false;
            }
        }
    }

    let diff_dim_ix = diff_dim_ix_opt.unwrap();

    let mut start_coordinate = a.coordinates[diff_dim_ix];
    while start_coordinate != b.coordinates[diff_dim_ix] {
        let mut new_point = a.clone();
        new_point.coordinates[diff_dim_ix] = start_coordinate;
        result.push(new_point);

        if decreasing {
            start_coordinate -= 1
        } else {
            start_coordinate += 1
        }
    }
    result.push(b.clone());

    return result;
}
