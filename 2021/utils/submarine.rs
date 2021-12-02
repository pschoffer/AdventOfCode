use std::fmt;

pub struct Submarine {
    pub ip: usize,
    pub instructions: Vec<Instruction>,

    pub position: i32,
    pub depth: i32,
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

    pub fn load_instructions(&mut self, instruction_strings: &Vec<String>) {
        for instr_string in instruction_strings {
            let mut parts: Vec<&str> = instr_string.split(' ').collect();
            self.instructions.push({
                Instruction {
                    opcode: parts.remove(0).to_string(),
                    arguments: parts.iter().map(|&x| x.to_string()).collect(),
                }
            });
        }
    }

    pub fn do_step(&mut self) {
        let inst = &self.instructions[self.ip];

        match inst.opcode.as_str() {
            "forward" => {
                let steps = inst.arguments[0].parse::<i32>().unwrap();
                self.position += steps;
            }
            "down" => {
                let steps = inst.arguments[0].parse::<i32>().unwrap();
                self.depth += steps;
            }
            "up" => {
                let steps = inst.arguments[0].parse::<i32>().unwrap();
                self.depth -= steps;
            }
            _ => println!("UNKOWN code"),
        }

        self.ip += 1;
        println!("{}", self)
    }

    pub fn execute(&mut self) {
        while self.ip < self.instructions.len() {
            self.do_step();
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
    pub opcode: String,
    pub arguments: Vec<String>,
}

impl fmt::Debug for Instruction {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        let args = self.arguments.join(", ");
        write!(f, "{}({})", self.opcode, args)
    }
}
