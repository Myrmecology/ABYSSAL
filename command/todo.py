# ============================================
#  TODO.PY — Command Line Todo Manager
#  Language : Python 3.12+
#  Run       : python todo.py
#  Theme     : Green + Yellow — clean and human
# ============================================

from __future__ import annotations
import os
import sys
from dataclasses import dataclass, field
from typing import Optional
from enum import Enum, auto

# ── ANSI Color Constants ─────────────────────
class C:
    GREEN   = "\033[32m"
    GREEN_B = "\033[92m"
    YELLOW  = "\033[33m"
    YELLOW_B= "\033[93m"
    WHITE   = "\033[97m"
    DIM     = "\033[2m"
    BOLD    = "\033[1m"
    RED     = "\033[31m"
    RESET   = "\033[0m"
    CLEAR   = "\033[2J\033[H"

# ── App Metadata ─────────────────────────────
VERSION   = "1.0.0"
MAX_TASKS = 64

# ============================================
#  STATUS ENUM
# ============================================

class Status(Enum):
    PENDING = auto()
    DONE    = auto()

    def __str__(self) -> str:
        return "done" if self == Status.DONE else "pending"

# ============================================
#  TASK DATACLASS
# ============================================

@dataclass
class Task:
    id:     int
    title:  str
    status: Status = Status.PENDING

    @property
    def is_done(self) -> bool:
        return self.status == Status.DONE

    def complete(self) -> None:
        self.status = Status.DONE

# ============================================
#  TODO LIST
# ============================================

@dataclass
class TodoList:
    tasks:   list[Task] = field(default_factory=list)
    _next_id: int       = field(default=1, repr=False)

    # ── Add ──────────────────────────────────
    def add(self, title: str) -> Task:
        if len(self.tasks) >= MAX_TASKS:
            raise ValueError(f"Task limit reached ({MAX_TASKS}).")
        title = title.strip()
        if not title:
            raise ValueError("Title cannot be empty.")
        task = Task(id=self._next_id, title=title)
        self.tasks.append(task)
        self._next_id += 1
        return task

    # ── Find ─────────────────────────────────
    def find(self, task_id: int) -> Optional[Task]:
        return next((t for t in self.tasks if t.id == task_id), None)

    # ── Complete ─────────────────────────────
    def complete(self, task_id: int) -> Task:
        task = self.find(task_id)
        if task is None:
            raise LookupError(f"Task [{task_id}] not found.")
        if task.is_done:
            raise ValueError(f"Task [{task_id}] already completed.")
        task.complete()
        return task

    # ── Delete ───────────────────────────────
    def delete(self, task_id: int) -> Task:
        task = self.find(task_id)
        if task is None:
            raise LookupError(f"Task [{task_id}] not found.")
        self.tasks.remove(task)
        return task

    # ── Clear Completed ──────────────────────
    def clear_done(self) -> int:
        before      = len(self.tasks)
        self.tasks  = [t for t in self.tasks if not t.is_done]
        return before - len(self.tasks)

    # ── Stats ────────────────────────────────
    @property
    def done_count(self) -> int:
        return sum(1 for t in self.tasks if t.is_done)

    @property
    def pending_count(self) -> int:
        return len(self.tasks) - self.done_count

# ============================================
#  RENDERING
# ============================================

def clear_screen() -> None:
    print(C.CLEAR, end="", flush=True)

def rule(char: str = "─", width: int = 52) -> None:
    print(f"{C.DIM}{char * width}{C.RESET}")

def header() -> None:
    clear_screen()
    rule("═")
    print(
        f"{C.BOLD}{C.GREEN}"
        "  ████████╗ ██████╗ ██████╗  ██████╗ \n"
        "     ██╔══╝██╔═══██╗██╔══██╗██╔═══██╗\n"
        "     ██║   ██║   ██║██║  ██║██║   ██║\n"
        "     ██║   ██║   ██║██║  ██║██║   ██║\n"
        "     ██║   ╚██████╔╝██████╔╝╚██████╔╝\n"
        "     ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝ "
        f"{C.RESET}"
    )
    print(
        f"{C.YELLOW}  CLI Task Manager  "
        f"{C.DIM}v{VERSION} — written in Python{C.RESET}"
    )
    rule("═")
    print()

def render_tasks(todo: TodoList) -> None:
    print(f"{C.BOLD}{C.WHITE}  TASKS{C.RESET}")
    rule("·")

    if not todo.tasks:
        print(f"{C.DIM}  No tasks yet. Add one below.{C.RESET}")
    else:
        for task in todo.tasks:
            if task.is_done:
                print(
                    f"{C.DIM}  [{task.id:>2}]  "
                    f"✓  {task.title}{C.RESET}"
                )
            else:
                print(
                    f"{C.GREEN}  [{task.id:>2}]{C.RESET}  "
                    f"{C.YELLOW_B}○{C.RESET}  "
                    f"{C.WHITE}{task.title}{C.RESET}"
                )

    rule("·")
    print(
        f"{C.DIM}  {todo.done_count} of "
        f"{len(todo.tasks)} completed  ·  "
        f"{todo.pending_count} remaining{C.RESET}"
    )
    print()

def render_menu() -> None:
    print(f"{C.BOLD}{C.WHITE}  ACTIONS{C.RESET}")
    rule("·")
    actions = [
        ("1", "Add task"),
        ("2", "Complete task"),
        ("3", "Delete task"),
        ("4", "Clear completed"),
        ("0", "Exit"),
    ]
    for key, label in actions:
        dim = C.DIM if key == "0" else ""
        print(
            f"{C.GREEN}  [{key}]{C.RESET}  "
            f"{dim}{C.YELLOW}{label}{C.RESET}"
        )
    rule("·")
    print(
        f"{C.GREEN_B}  › {C.RESET}",
        end="",
        flush=True
    )

# ============================================
#  INPUT HELPERS
# ============================================

def prompt(message: str) -> str:
    print(f"{C.YELLOW_B}  {message} {C.RESET}", end="", flush=True)
    try:
        return input().strip()
    except (EOFError, KeyboardInterrupt):
        return ""

def prompt_id(message: str) -> Optional[int]:
    raw = prompt(message)
    try:
        return int(raw)
    except ValueError:
        return None

def pause() -> None:
    prompt(f"{C.DIM}Press Enter to continue...{C.RESET}")

def ok(message: str) -> None:
    print(f"{C.GREEN_B}  ✓ {C.RESET}{message}")

def err(message: str) -> None:
    print(f"{C.RED}  ✗ {message}{C.RESET}")

# ============================================
#  ACTIONS
# ============================================

def action_add(todo: TodoList) -> None:
    title = prompt("New task:")
    try:
        task = todo.add(title)
        ok(f"Task [{task.id}] added.")
    except ValueError as e:
        err(str(e))

def action_complete(todo: TodoList) -> None:
    task_id = prompt_id("Mark complete — Task ID:")
    if task_id is None:
        err("Invalid ID.")
        return
    try:
        task = todo.complete(task_id)
        ok(f"Task [{task.id}] marked complete.")
    except (LookupError, ValueError) as e:
        err(str(e))

def action_delete(todo: TodoList) -> None:
    task_id = prompt_id("Delete — Task ID:")
    if task_id is None:
        err("Invalid ID.")
        return
    try:
        task = todo.delete(task_id)
        ok(f"Task [{task.id}] deleted.")
    except LookupError as e:
        err(str(e))

def action_clear(todo: TodoList) -> None:
    removed = todo.clear_done()
    if removed == 0:
        print(f"{C.DIM}  No completed tasks to clear.{C.RESET}")
    else:
        ok(f"Cleared {removed} completed task(s).")

# ============================================
#  MAIN LOOP
# ============================================

ACTIONS: dict[str, callable] = {
    "1": action_add,
    "2": action_complete,
    "3": action_delete,
    "4": action_clear,
}

def main() -> None:
    todo = TodoList()

    while True:
        header()
        render_tasks(todo)
        render_menu()

        try:
            choice = input().strip()
        except (EOFError, KeyboardInterrupt):
            break

        if choice == "0":
            clear_screen()
            print(f"{C.BOLD}{C.GREEN}  Goodbye.\n{C.RESET}")
            sys.exit(0)

        if choice in ACTIONS:
            print()
            ACTIONS[choice](todo)
            print()
            pause()
        else:
            print(f"{C.DIM}  Unknown option.{C.RESET}")
            pause()

# ============================================
#  ENTRY POINT
# ============================================

if __name__ == "__main__":
    main()