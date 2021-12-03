#[path = "../../utils/binary.rs"]
mod binary;
#[path = "../../utils/parser.rs"]
mod parser;

fn main() {
    // let lines = parser::parse_lines("1".to_string());
    let lines = parser::parse_lines(None);
    println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

    let rating = get_rating(&lines, false);
    let rating_two = get_rating(&lines, true);

    println!("Ratings {},{} => {}", rating, rating_two, rating*rating_two)
}

fn get_rating(src: &Vec<String>, reverse: bool) -> u32 {
    let mut src_copy = src.to_vec();
    let line_size = src[0].len();
    let mut ix = 0;

    while src_copy.len() > 1 && ix < line_size {
        let mut most_common = get_most_common(&src_copy, ix);
        if reverse {
            most_common = if most_common == '1' {'0'} else {'1'};
        }

        // println!(
        //     "Got there {} {:?} common {}",
        //     ix, src_copy, most_common
        // );

        src_copy = src_copy
            .into_iter()
            .filter(|item| has_matching_char(&item, ix, most_common))
            .collect();
        ix += 1;
    }

    return binary::to_dec_from_string(&src_copy[0]);
}

fn has_matching_char(src: &String, ix: usize, target: char) -> bool {
    let chars: Vec<char> = src.chars().collect();
    let character = chars[ix];

    return if character == target { true } else { false };
}

fn get_most_common(src: &Vec<String>, ix: usize) -> char {
    let mut counter = 0;
    let total = src.len();

    for number in src {
        let chars: Vec<char> = number.chars().collect();
        let character = chars[ix];
        if character == '1' {
            counter += 1;
        }
    }

    let break_point = total / 2;
    // println!("most {} out of {} and modulo {}", counter, break_point, total % 2);
    if total % 2 == 0 && counter == break_point {
        // both sides are equal;
        return '1';
    }

    return if counter > break_point { '1' } else { '0' };
}

// fn main_part1() {
//     let lines = parser::parse_lines("1".to_string());
//     // let lines = parser::parse_lines(None);
//     println!("Got lines {}, e.g. \"{}\"", lines.len(), lines[0]);

//     let total_count = lines.len();
//     let line_size = lines[0].len();

//     let mut counters: Vec<usize> = (0..line_size).map(|_x| 0).collect();
//     for number in lines {
//         let chars: Vec<char> = number.chars().collect();
//         for ix in 0..(line_size) {
//             let character = chars[ix];
//             if character == '1' {
//                 counters[ix] = counters[ix] + 1;
//             }
//         }
//     }

//     let mut gama_bin: Vec<u8> = Vec::new();
//     let mut epsilon_bin: Vec<u8> = Vec::new();
//     for ix in 0..(line_size) {
//         if counters[ix] > (total_count / 2) {
//             gama_bin.push(1);
//             epsilon_bin.push(0);
//         } else {
//             gama_bin.push(0);
//             epsilon_bin.push(1);
//         }
//     }

//     let gama = binary::to_dec(gama_bin);
//     let epsilon = binary::to_dec(epsilon_bin);

//     println!("REULT is {}", gama * epsilon)
// }
