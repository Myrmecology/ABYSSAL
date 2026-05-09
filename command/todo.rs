// ============================================
//  TODO.RS — Command Line Todo Manager
//  Language : Rust (Edition 2021)
//  Compiler : rustc
//  Run       : rustc todo.rs -o todo && ./todo
//  Theme     : Cyan + White — engineered precision
// ============================================

use std::io::{self, Write};
use std::fmt;

// ── ANSI Color Constants ──────────────────────
const CYAN:    &str = "\x1b[36m";
const CYAN_B:  &str = "\x1b[96m";
const WHITE:   &str = "\x1b[97m";
const DIM:     &str = "\x1b[2m";
const BOLD:    &str = "\x1b[1m";
const GREEN:   &str = "\x1b[32m";
const RED:     &str = "\x1b[31m";
const RESET:   &str = "\x1b[0m";
const CLEAR:   &str = "\x1b[2J\x1b[H";

// ── App Metadata ─────────────────────────────
const VERSION: &str  = "1.0.0";
const MAX_TASKS: usize = 64;

// ============================================
//  TASK STATUS
// ============================================

#[derive(Debug, Clone, PartialEq)]
enum Status {
    Pending,
    Done,
}

impl fmt::Display for Status {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            Status::Pending => write!(f, "pending"),
            Status::Done    => write!(f, "done"),
        }
    }
}

// ============================================
//  TASK
// ============================================

#[derive(Debug, Clone)]
struct Task {
    id:     usize,
    title:  String,
    status: Status,
}

impl Task {
    fn new(id: usize, title: String) -> Self {
        Task {
            id,
            title,
            status: Status::Pending,
        }
    }

    fn is_done(&self) -> bool {
        self.status == Status::Done
    }
}

// ============================================
//  TODO LIST
// ============================================

struct TodoList {
    tasks:   Vec<Task>,
    next_id: usize,
}

impl TodoList {
    fn new() -> Self {
        TodoList {
            tasks:   Vec::new(),
            next_id: 1,
        }
    }

    fn add(&mut self, title: String) -> Result<usize, &'static str> {
        if self.tasks.len() >= MAX_TASKS {
            return Err("Task limit reached.");
        }
        if title.trim().is_empty() {
            return Err("Title cannot be empty.");
        }
        let id = self.next_id;
        self.tasks.push(Task::new(id, title.trim().to_string()));
        self.next_id += 1;
        Ok(id)
    }

    fn complete(&mut self, id: usize) -> Result<(), &'static str> {
        match self.tasks.iter_mut().find(|t| t.id == id) {
            Some(task) if task.is_done() => Err("Already completed."),
            Some(task) => {
                task.status = Status::Done;
                Ok(())
            }
            None => Err("Task not found."),
        }
    }

    fn delete(&mut self, id: usize) -> Result<(), &'static str> {
        let pos = self.tasks.iter().position(|t| t.id == id);
        match pos {
            Some(i) => {
                self.tasks.remove(i);
                Ok(())
            }
            None => Err("Task not found."),
        }
    }

    fn clear_done(&mut self) -> usize {
        let before = self.tasks.len();
        self.tasks.retain(|t| !t.is_done());
        before - self.tasks.len()
    }

    fn count_done(&self) -> usize {
        self.tasks.iter().filter(|t| t.is_done()).count()
    }
}

// ============================================
//  RENDERING
// ============================================

fn clear_screen() {
    print!("{}", CLEAR);
    let _ = io::stdout().flush();
}

fn print_rule(ch: char, len: usize) {
    println!("{}{}{}", DIM, ch.to_string().repeat(len), RESET);
}

fn print_header() {
    clear_screen();
    print_rule('─', 52);
    println!(
        "{}{}\
  ████████╗ ██████╗ ██████╗  ██████╗ \n\
     ██╔══╝██╔═══██╗██╔══██╗██╔═══██╗\n\
     ██║   ██║   ██║██║  ██║██║   ██║\n\
     ██║   ██║   ██║██║  ██║██║   ██║\n\
     ██║   ╚██████╔╝██████╔╝╚██████╔╝\n\
     ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝ {}{}",
        BOLD, CYAN, RESET, RESET
    );
    println!(
        "{}  CLI Task Manager  {}v{} — written in Rust{}",
        CYAN_B, DIM, VERSION, RESET
    );
    print_rule('─', 52);
    println!();
}

fn render_tasks(list: &TodoList) {
    println!("{}{}  TASKS{}", BOLD, WHITE, RESET);
    print_rule('·', 52);

    if list.tasks.is_empty() {
        println!("{}  No tasks yet. Add one below.{}", DIM, RESET);
    } else {
        for task in &list.tasks {
            match task.status {
                Status::Done => {
                    println!(
                        "{}  [{:>2}]  {}✓{}  {}{}",
                        DIM, task.id,
                        GREEN, DIM,
                        task.title,
                        RESET
                    );
                }
                Status::Pending => {
                    println!(
                        "{}  [{:>2}]{}  {}○{}  {}{}{}",
                        CYAN, task.id, RESET,
                        CYAN_B, RESET,
                        WHITE, task.title, RESET
                    );
                }
            }
        }
    }

    print_rule('·', 52);
    println!(
        "{}  {} of {} completed{}",
        DIM,
        list.count_done(),
        list.tasks.len(),
        RESET
    );
    println!();
}

fn render_menu() {
    println!("{}{}  ACTIONS{}", BOLD, WHITE, RESET);
    print_rule('·', 52);
    println!("{}  [1]{}  Add task",       CYAN, RESET);
    println!("{}  [2]{}  Complete task",  CYAN, RESET);
    println!("{}  [3]{}  Delete task",    CYAN, RESET);
    println!("{}  [4]{}  Clear completed",CYAN, RESET);
    println!("{}  [0]{}{}  Exit{}",       CYAN, RESET, DIM, RESET);
    print_rule('·', 52);
    print!("{}  › {}", CYAN_B, RESET);
    let _ = io::stdout().flush();
}

// ============================================
//  INPUT HELPERS
// ============================================

fn read_line() -> String {
    let mut buf = String::new();
    io::stdin().read_line(&mut buf).unwrap_or(0);
    buf.trim().to_string()
}

fn read_id(prompt: &str) -> Option<usize> {
    print!("{}  {} {}", CYAN_B, prompt, RESET);
    let _ = io::stdout().flush();
    read_line().parse::<usize>().ok()
}

fn pause() {
    print!("{}  Press Enter to continue...{}", DIM, RESET);
    let _ = io::stdout().flush();
    read_line();
}

// ============================================
//  ACTIONS
// ============================================

fn action_add(list: &mut TodoList) {
    print!("{}  New task: {}", CYAN_B, RESET);
    let _ = io::stdout().flush();
    let title = read_line();

    match list.add(title) {
        Ok(id) => println!(
            "{}  ✓ {}Task [{}] added.",
            GREEN, RESET, id
        ),
        Err(e) => println!("{}  ✗ {}{}", RED, e, RESET),
    }
}

fn action_complete(list: &mut TodoList) {
    match read_id("Mark complete — Task ID:") {
        Some(id) => match list.complete(id) {
            Ok(_)  => println!(
                "{}  ✓ {}Task [{}] marked complete.",
                GREEN, RESET, id
            ),
            Err(e) => println!("{}  ✗ {}{}", RED, e, RESET),
        },
        None => println!("{}  ✗ Invalid ID.{}", RED, RESET),
    }
}

fn action_delete(list: &mut TodoList) {
    match read_id("Delete — Task ID:") {
        Some(id) => match list.delete(id) {
            Ok(_)  => println!(
                "{}  ✓ {}Task [{}] deleted.",
                GREEN, RESET, id
            ),
            Err(e) => println!("{}  ✗ {}{}", RED, e, RESET),
        },
        None => println!("{}  ✗ Invalid ID.{}", RED, RESET),
    }
}

fn action_clear(list: &mut TodoList) {
    let removed = list.clear_done();
    if removed == 0 {
        println!("{}  No completed tasks to clear.{}", DIM, RESET);
    } else {
        println!(
            "{}  ✓ {}Cleared {} completed task(s).",
            GREEN, RESET, removed
        );
    }
}

// ============================================
//  MAIN LOOP
// ============================================

fn main() {
    let mut list = TodoList::new();

    loop {
        print_header();
        render_tasks(&list);
        render_menu();

        let input = read_line();

        match input.as_str() {
            "1" => { action_add(&mut list);      pause(); }
            "2" => { action_complete(&mut list); pause(); }
            "3" => { action_delete(&mut list);   pause(); }
            "4" => { action_clear(&mut list);    pause(); }
            "0" => {
                clear_screen();
                println!(
                    "{}{}  Goodbye.\n{}",
                    BOLD, CYAN, RESET
                );
                break;
            }
            _ => {
                println!(
                    "{}  Unknown option.{}",
                    DIM, RESET
                );
                pause();
            }
        }
    }
}