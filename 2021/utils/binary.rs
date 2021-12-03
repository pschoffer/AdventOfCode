pub fn to_dec(binary: Vec<u8>) -> u32 {
    let mut multiplier = 1;
    let mut result = 0;

    // println!("to_dec {:?}", binary);

    for ix in (0..binary.len()).rev() {
        let bit = binary[ix];
        if bit > 0 {
            result += multiplier;
        }

        if multiplier == 1 {
            multiplier = 2
        } else {
            multiplier *= 2;
        }
    }

    return result;
}
