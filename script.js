const taskInput = document.querySelector(".task-input input"),
    filters = document.querySelectorAll(".filters span"),
    clearAll = document.querySelector(".clear-btn"),
    taskBox = document.querySelector(".task-box"),
    searchInput = document.querySelector(".search-input"),
    sortSelect = document.querySelector(".sort-select"),
    categorySelect = document.querySelector(".category-select");
let editId,
    isEditTask = false,
    todos = JSON.parse(localStorage.getItem("todo-list"));
filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showTodoAndApplyFilterSort();
    });
});
searchInput.addEventListener("input", () => {
    showTodoAndApplyFilterSort();
});
sortSelect.addEventListener("change", () => {
    showTodoAndApplyFilterSort();
});
categorySelect.addEventListener("change", () => {
    showTodoAndApplyFilterSort();
});
function showTodoAndApplyFilterSort() {
    const filter = document.querySelector("span.active").id;
    showTodo(filter);
}
function showTodo(filter) {
    const searchTerm = searchInput.value.toLowerCase();
    const sortCriteria = sortSelect.value;
    const categoryFilter = categorySelect.value;
    let liTag = "";
    if (todos) {
        todos.sort((a, b) => {
            if (sortCriteria === "az") {
                return a.name.localeCompare(b.name);
            } else if (sortCriteria === "za") {
                return b.name.localeCompare(a.name);
            } else {
                return 0;
            }
        });
        todos.forEach((todo, id) => {
            let completed = todo.status == "completed" ? "checked" : "";
            if ((filter == todo.status || filter == "all") &&
                (categoryFilter === "default" || categoryFilter === todo.category) &&
                (searchTerm === "" || todo.name.toLowerCase().includes(searchTerm))) {
                liTag += `<li class="task">
                            <label for="${id}">
                                <input onclick="updateStatus(this)" type="checkbox" id="${id}" ${completed}>
                                <p class="${completed}">${todo.name}</p>
                            </label>
                            <div class="settings">
                                <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                                <ul class="task-menu">
                                    <li onclick='editTask(${id}, "${todo.name}", "${todo.category}")'><i class="uil uil-pen"></i>Edit</li>
                                    <li onclick='deleteTask(${id}, "${filter}")'><i class="uil uil-trash"></i>Delete</li>
                                </ul>
                            </div>
                        </li>`;
            }
        });
    }
    taskBox.innerHTML = liTag || `<span>You don't have any task here</span>`;
    let checkTask = taskBox.querySelectorAll(".task");
    !checkTask.length ? clearAll.classList.remove("active") : clearAll.classList.add("active");
    taskBox.offsetHeight >= 300 ? taskBox.classList.add("overflow") : taskBox.classList.remove("overflow");
}
showTodoAndApplyFilterSort();
function showMenu(selectedTask) {
    let menuDiv = selectedTask.parentElement.lastElementChild;
    menuDiv.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != selectedTask) {
            menuDiv.classList.remove("show");
        }
    });
}
function updateStatus(selectedTask) {
    let taskName = selectedTask.parentElement.lastElementChild;
    if (selectedTask.checked) {
        taskName.classList.add("checked");
        todos[selectedTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectedTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
}
function editTask(taskId, textName, category) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = textName;
    taskInput.focus();
    taskInput.classList.add("active");
    categorySelect.value = category;
}
function deleteTask(deleteId, filter) {
    isEditTask = false;
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodoAndApplyFilterSort();
}
clearAll.addEventListener("click", () => {
    isEditTask = false;
    todos.splice(0, todos.length);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showTodoAndApplyFilterSort();
});
taskInput.addEventListener("keyup", e => {
    let userTask = taskInput.value.trim();
    if (e.key == "Enter" && userTask) {
        if (!isEditTask) {
            todos = !todos ? [] : todos;
            let taskInfo = { name: userTask, status: "pending", category: categorySelect.value };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = userTask;
            todos[editId].category = categorySelect.value;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showTodoAndApplyFilterSort();
    }
});