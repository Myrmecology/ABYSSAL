/* ============================================
   TODO.C — Command Line Todo Manager
   Language : C (C99)
   Compiler : GCC
   Run       : gcc todo.c -o todo && ./todo
   Theme     : Red + Amber — raw and honest
   ============================================ */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/* ── ANSI Color Codes ── */
#define RED     "\033[31m"
#define AMBER   "\033[33m"
#define WHITE   "\033[97m"
#define DIM     "\033[2m"
#define BOLD    "\033[1m"
#define RESET   "\033[0m"
#define CLEAR   "\033[2J\033[H"

/* ── Constants ── */
#define MAX_TASKS    64
#define MAX_LEN     128
#define APP_VERSION "1.0.0"

/* ── Task Structure ── */
typedef struct {
    int  id;
    char title[MAX_LEN];
    int  done;
} Task;

/* ── Global State ── */
static Task tasks[MAX_TASKS];
static int  task_count = 0;
static int  next_id    = 1;

/* ============================================
   UTILITIES
   ============================================ */

void clear_screen(void) {
    printf(CLEAR);
    fflush(stdout);
}

void print_line(char ch, int len) {
    printf(DIM RED);
    for (int i = 0; i < len; i++) putchar(ch);
    printf(RESET "\n");
}

void flush_input(void) {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

/* ============================================
   HEADER
   ============================================ */

void print_header(void) {
    clear_screen();
    print_line('=', 50);
    printf(BOLD RED
        "  ████████╗ ██████╗ ██████╗  ██████╗ \n"
        "     ██╔══╝██╔═══██╗██╔══██╗██╔═══██╗\n"
        "     ██║   ██║   ██║██║  ██║██║   ██║\n"
        "     ██║   ██║   ██║██║  ██║██║   ██║\n"
        "     ██║   ╚██████╔╝██████╔╝╚██████╔╝\n"
        "     ╚═╝    ╚═════╝ ╚═════╝  ╚═════╝ \n"
        RESET);
    printf(AMBER "  CLI Task Manager  " DIM "v%s — written in C\n"
        RESET, APP_VERSION);
    print_line('=', 50);
    printf("\n");
}

/* ============================================
   DISPLAY TASKS
   ============================================ */

void list_tasks(void) {
    print_header();
    printf(BOLD WHITE "  TASKS\n" RESET);
    print_line('-', 50);

    if (task_count == 0) {
        printf(DIM "  No tasks yet. Add one below.\n" RESET);
        print_line('-', 50);
        return;
    }

    for (int i = 0; i < task_count; i++) {
        if (tasks[i].done) {
            printf(DIM "  [%d]  ✓  %s\n" RESET,
                tasks[i].id, tasks[i].title);
        } else {
            printf(RED "  [%d] " RESET
                   AMBER " ○  " RESET
                   WHITE "%s\n" RESET,
                tasks[i].id, tasks[i].title);
        }
    }

    print_line('-', 50);

    /* Stats */
    int done = 0;
    for (int i = 0; i < task_count; i++) {
        if (tasks[i].done) done++;
    }
    printf(DIM "  %d of %d completed\n\n" RESET,
        done, task_count);
}

/* ============================================
   ADD TASK
   ============================================ */

void add_task(void) {
    if (task_count >= MAX_TASKS) {
        printf(RED "  Error: task limit reached (%d).\n"
            RESET, MAX_TASKS);
        return;
    }

    char title[MAX_LEN];
    printf(AMBER "\n  New task: " RESET);
    fflush(stdout);

    if (fgets(title, MAX_LEN, stdin) == NULL) return;

    /* Strip newline */
    title[strcspn(title, "\n")] = '\0';

    if (strlen(title) == 0) {
        printf(DIM "  No input. Task not added.\n" RESET);
        return;
    }

    tasks[task_count].id   = next_id++;
    tasks[task_count].done = 0;
    strncpy(tasks[task_count].title, title, MAX_LEN - 1);
    tasks[task_count].title[MAX_LEN - 1] = '\0';
    task_count++;

    printf(RED "  ✓ " RESET "Task added.\n");
}

/* ============================================
   COMPLETE TASK
   ============================================ */

void complete_task(void) {
    if (task_count == 0) {
        printf(DIM "  No tasks to complete.\n" RESET);
        return;
    }

    int id;
    printf(AMBER "\n  Task ID to mark complete: " RESET);
    fflush(stdout);

    if (scanf("%d", &id) != 1) {
        flush_input();
        printf(RED "  Invalid input.\n" RESET);
        return;
    }
    flush_input();

    for (int i = 0; i < task_count; i++) {
        if (tasks[i].id == id) {
            if (tasks[i].done) {
                printf(DIM "  Task [%d] already completed.\n"
                    RESET, id);
            } else {
                tasks[i].done = 1;
                printf(RED "  ✓ " RESET
                    "Task [%d] marked complete.\n", id);
            }
            return;
        }
    }

    printf(RED "  Task [%d] not found.\n" RESET, id);
}

/* ============================================
   DELETE TASK
   ============================================ */

void delete_task(void) {
    if (task_count == 0) {
        printf(DIM "  No tasks to delete.\n" RESET);
        return;
    }

    int id;
    printf(AMBER "\n  Task ID to delete: " RESET);
    fflush(stdout);

    if (scanf("%d", &id) != 1) {
        flush_input();
        printf(RED "  Invalid input.\n" RESET);
        return;
    }
    flush_input();

    for (int i = 0; i < task_count; i++) {
        if (tasks[i].id == id) {
            /* Shift remaining tasks down */
            for (int j = i; j < task_count - 1; j++) {
                tasks[j] = tasks[j + 1];
            }
            task_count--;
            printf(RED "  ✓ " RESET
                "Task [%d] deleted.\n", id);
            return;
        }
    }

    printf(RED "  Task [%d] not found.\n" RESET, id);
}

/* ============================================
   CLEAR COMPLETED
   ============================================ */

void clear_completed(void) {
    int removed = 0;
    int i = 0;

    while (i < task_count) {
        if (tasks[i].done) {
            for (int j = i; j < task_count - 1; j++) {
                tasks[j] = tasks[j + 1];
            }
            task_count--;
            removed++;
        } else {
            i++;
        }
    }

    if (removed == 0) {
        printf(DIM "  No completed tasks to clear.\n" RESET);
    } else {
        printf(RED "  ✓ " RESET
            "Cleared %d completed task(s).\n", removed);
    }
}

/* ============================================
   MENU
   ============================================ */

void print_menu(void) {
    printf(BOLD WHITE "  MENU\n" RESET);
    print_line('-', 50);
    printf(RED   "  [1]" RESET AMBER " Add task\n"       RESET);
    printf(RED   "  [2]" RESET AMBER " Complete task\n"  RESET);
    printf(RED   "  [3]" RESET AMBER " Delete task\n"    RESET);
    printf(RED   "  [4]" RESET AMBER " Clear completed\n"RESET);
    printf(RED   "  [0]" RESET DIM   " Exit\n"           RESET);
    print_line('-', 50);
    printf(AMBER "  Choice: " RESET);
    fflush(stdout);
}

/* ============================================
   MAIN
   ============================================ */

int main(void) {
    int choice;

    while (1) {
        list_tasks();
        print_menu();

        if (scanf("%d", &choice) != 1) {
            flush_input();
            continue;
        }
        flush_input();

        switch (choice) {
            case 1: add_task();        break;
            case 2: complete_task();   break;
            case 3: delete_task();     break;
            case 4: clear_completed(); break;
            case 0:
                clear_screen();
                printf(RED BOLD
                    "  Goodbye.\n\n" RESET);
                return 0;
            default:
                printf(DIM
                    "  Unknown option.\n" RESET);
        }

        printf(DIM "\n  Press Enter to continue..." RESET);
        flush_input();
    }

    return 0;
}