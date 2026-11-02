// ----- Types -----
type Filter = "all" | "active" | "completed";

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// ----- The app as a class -----
class TodoApp {
  todos: Todo[] = [];
  filter: Filter = "all";
  nextId: number = 1;

  // grab the elements once
  input = document.getElementById("todoInput") as HTMLInputElement;
  list = document.getElementById("todoList") as HTMLUListElement;
  count = document.getElementById("count") as HTMLSpanElement;

  constructor() {
    // Add button + Enter key
    document.getElementById("addBtn")!.addEventListener("click", () => this.add());
    this.input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") this.add();
    });

    // Filter buttons
    document.querySelectorAll<HTMLButtonElement>(".filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        this.filter = btn.dataset.filter as Filter;
        document.querySelectorAll(".filter").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        this.render();
      });
    });

    // Clear buttons
    document.getElementById("clearCompleted")!.addEventListener("click", () => {
      this.todos = this.todos.filter((t) => !t.done);
      this.render();
    });
    document.getElementById("clearAll")!.addEventListener("click", () => {
      this.todos = [];
      this.render();
    });

    this.render();
  }

  add(): void {
    const text = this.input.value.trim();
    if (text === "") return;
    this.todos.push({ id: this.nextId++, text, done: false });
    this.input.value = "";
    this.render();
  }

  toggle(id: number): void {
    this.todos = this.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t));
    this.render();
  }

  remove(id: number): void {
    this.todos = this.todos.filter((t) => t.id !== id);
    this.render();
  }

  edit(id: number, text: string): void {
    this.todos = this.todos.map((t) => (t.id === id ? { ...t, text } : t));
    this.render();
  }

  // Replace the text with an input box
  startEditing(todo: Todo, span: HTMLSpanElement): void {
    const box = document.createElement("input");
    box.className = "edit-input";
    box.value = todo.text;
    span.replaceWith(box);
    box.focus();

    box.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && box.value.trim() !== "") this.edit(todo.id, box.value.trim());
      if (e.key === "Escape") this.render();
    });
    box.addEventListener("blur", () => this.render());
  }

  // Which todos to show for the current filter
  visibleTodos(): Todo[] {
    if (this.filter === "active") return this.todos.filter((t) => !t.done);
    if (this.filter === "completed") return this.todos.filter((t) => t.done);
    return this.todos;
  }

  render(): void {
    this.list.innerHTML = "";

    this.visibleTodos().forEach((todo) => {
      const li = document.createElement("li");
      if (todo.done) li.classList.add("done");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = todo.done;
      checkbox.addEventListener("change", () => this.toggle(todo.id));

      const span = document.createElement("span");
      span.textContent = todo.text;
      span.addEventListener("dblclick", () => this.startEditing(todo, span));

      const del = document.createElement("button");
      del.className = "delete";
      del.textContent = "🗑";
      del.addEventListener("click", () => this.remove(todo.id));

      li.append(checkbox, span, del);
      this.list.appendChild(li);
    });

    const left = this.todos.filter((t) => !t.done).length;
    this.count.textContent = `${left} ${left === 1 ? "item" : "items"} left`;
  }
}

new TodoApp();
