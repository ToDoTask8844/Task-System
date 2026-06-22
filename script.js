const form = document.getElementById("todo-form");
const input = document.getElementById("todo-input");
const todoList = document.getElementById("todo-list");
const filterButtons = document.querySelectorAll(".filter-btn");

let todos = JSON.parse(localStorage.getItem("todos")) || [];
let currentFilter = "all";

function saveTodos() {
    localStorage.setItem("todos", JSON.stringify(todos));
}

function renderTodos() {

    todoList.innerHTML = "";

    let filteredTodos = todos.filter(todo => {

        if (currentFilter === "active") {
            return !todo.completed;
        }

        if (currentFilter === "completed") {
            return todo.completed;
        }

        return true;
    });

    filteredTodos.forEach(todo => {

        const li = document.createElement("li");

        li.className = todo.completed
            ? "todo-item completed"
            : "todo-item";

        li.dataset.id = todo.id;

        li.innerHTML = `
            <span class="task-text">${todo.text}</span>

            <div class="actions">
                <button class="complete-btn">
                    ${todo.completed ? "Undo" : "Done"}
                </button>

                <button class="edit-btn">
                    Edit
                </button>

                <button class="delete-btn">
                    Delete
                </button>
            </div>
        `;

        todoList.appendChild(li);
    });
}

form.addEventListener("submit", function (e) {

    e.preventDefault();

    const task = input.value.trim();

    if (task === "") return;

    todos.push({
        id: Date.now(),
        text: task,
        completed: false
    });

    saveTodos();
    renderTodos();

    input.value = "";
});

todoList.addEventListener("click", function (e) {

    const li = e.target.closest(".todo-item");

    if (!li) return;

    const id = Number(li.dataset.id);

    const todo = todos.find(t => t.id === id);

    if (!todo) return;

    if (e.target.classList.contains("complete-btn")) {

        todo.completed = !todo.completed;
    }

    if (e.target.classList.contains("edit-btn")) {

        const newText = prompt(
            "Edit Task",
            todo.text
        );

        if (newText && newText.trim() !== "") {
            todo.text = newText.trim();
        }
    }

    if (e.target.classList.contains("delete-btn")) {

        todos = todos.filter(t => t.id !== id);
    }

    saveTodos();
    renderTodos();
});

filterButtons.forEach(button => {

    button.addEventListener("click", function () {

        filterButtons.forEach(btn =>
            btn.classList.remove("active")
        );

        this.classList.add("active");

        currentFilter = this.dataset.filter;

        renderTodos();
    });
});

renderTodos();