#[path = "../../utils/parser.rs"]
mod parser;

use std::fmt;

fn main() {
    // let lines = parser::parse_lines("1".to_string());
    let lines = parser::parse_lines(None);
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

    let mut game = Game::new(&lines);
    game.run();

    let winner_number = game.winner_number.unwrap();
    let sum = game.boards[game.winner_ix.unwrap()].sum_remaining();

    println!(
        "RESULT {} * {} = {}",
        winner_number,
        sum,
        winner_number * sum
    );
}

struct Game {
    pub numbers: Vec<usize>,
    pub boards: Vec<Board>,
    pub winner_ix: Option<usize>,
    pub winner_number: Option<usize>,
}

impl Game {
    pub fn new(lines: &Vec<String>) -> Self {
        let numbers: Vec<usize> = lines[0]
            .split(',')
            .map(|x| x.parse::<usize>().unwrap())
            .collect();

        let mut boards: Vec<Board> = Vec::new();

        let mut ix = 2;
        while ix < lines.len() {
            let board_lines: Vec<String> = (ix..(ix + 5)).map(|i| lines[i].to_owned()).collect();
            boards.push(Board::new(&board_lines));

            ix += 6;
        }

        Self {
            numbers,
            boards,
            winner_ix: None,
            winner_number: None,
        }
    }

    pub fn run(&mut self) {
        // while self.numbers.len() > 0 && self.winner_ix.is_none() {
        while self.numbers.len() > 0 {
            let current_number = self.numbers.remove(0);

            for board_ix in 0..self.boards.len() {
                if !self.boards[board_ix].is_finished {
                    self.boards[board_ix].mark(current_number);

                    if self.boards[board_ix].is_finished {
                        self.winner_ix = Some(board_ix);
                        self.winner_number = Some(current_number);
                    }
                }
            }
        }
    }
}

impl fmt::Display for Game {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "Game: numbers left {}, boards count {}",
            self.numbers.len(),
            self.boards.len(),
        )
    }
}

struct Board {
    pub is_finished: bool,
    rows: Vec<Vec<usize>>,
    cols: Vec<Vec<usize>>,
}

impl Board {
    pub fn sum_remaining(&self) -> usize {
        let mut sum = 0;
        for row_ix in 0..self.rows.len() {
            let row_sum: usize = self.rows[row_ix].iter().sum();
            sum += row_sum;
        }
        return sum;
    }

    pub fn mark(&mut self, current_number: usize) {
        for row_ix in 0..self.rows.len() {
            self.rows[row_ix] = self.rows[row_ix]
                .iter()
                .map(|item| item.to_owned())
                .filter(|item| item.to_owned() != current_number)
                .collect();
            if self.rows[row_ix].len() == 0 {
                self.is_finished = true;
            }
        }
        for col_ix in 0..self.cols.len() {
            self.cols[col_ix] = self.cols[col_ix]
                .iter()
                .map(|item| item.to_owned())
                .filter(|item| item.to_owned() != current_number)
                .collect();
            if self.cols[col_ix].len() == 0 {
                self.is_finished = true;
            }
        }
    }

    pub fn new(lines: &Vec<String>) -> Self {
        let mut rows: Vec<Vec<usize>> = Vec::new();
        let mut cols: Vec<Vec<usize>> = Vec::new();

        for line in lines {
            let line_numbers: Vec<usize> = line
                .trim()
                .split_whitespace()
                .map(|x| x.parse::<usize>().unwrap())
                .collect();
            let col_count = line_numbers.len();

            if cols.len() == 0 {
                cols = (0..col_count).map(|_ix| Vec::new()).collect();
            }

            for ix in 0..col_count {
                cols[ix].push(line_numbers[ix]);
            }

            rows.push(line_numbers)
        }

        Self {
            is_finished: false,
            rows,
            cols,
        }
    }
}

impl fmt::Display for Board {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let mut lines = "".to_owned();

        for row in &self.rows {
            lines.push_str(
                &row.iter()
                    .map(|item| item.to_string())
                    .collect::<Vec<String>>()
                    .join(","),
            );
            lines.push_str("\n");
        }
        // lines.push_str("\ncols\n");
        // for row in &self.cols {
        //     lines.push_str(&row.iter().map(|item| item.to_string()).collect::<Vec<String>>().join(","));
        //     lines.push_str("\n");
        // }

        write!(f, "Board - finished {}\n{}", self.is_finished, lines,)
    }
}
