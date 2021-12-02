use std::fmt;

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

    pub fn load_instructions(&self, instruction_strings: &Vec<String>) {
        for instr_string in instruction_strings {
            println!("{}", instr_string);
        }
    }
}

impl fmt::Display for Submarine {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        write!(
            f,
            "Submarine: depth={} position={}; instr[{}] -> {}",
            self.depth,
            self.position,
            self.ip,
            self.instructions.len()
        )
    }
}

pub struct Instruction {
    opcode: String,
    arguments: Vec<String>,
}
