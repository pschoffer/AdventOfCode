pub struct Submarine {
    ip: u32,
    instructions: Vec<Instruction>,

    position: i32,
    depth: i32,
}

impl Submarine {
    pub fn new() -> Self {
        Self {
            ip: 0,
            instructions: Vec::new(),

            position: 0,
            depth: 0,
        }
    }
}

pub struct Instruction {
    opcode: String,
    arguments: Vec<String>,
}
