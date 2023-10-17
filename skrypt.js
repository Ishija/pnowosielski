const taskList = document.getElementById("taskList");
const taskInput = document.getElementById("task");
const dueDateInput = document.getElementById("dueDate");
const searchInput = document.getElementById("search");
const addTaskButton = document.getElementById("addTask");
const tasks = [];

// Funkcja dodająca nowe zadanie do listy
function addTask() {
    const taskText = taskInput.value;
    const dueDate = dueDateInput.value;

    if (taskText.trim() === "") {
        alert("Wprowadź treść zadania!");
        return;
    }

    tasks.push({ text: taskText, dueDate: dueDate });

    renderTasks();
    saveTasksToLocalStorage();
    taskInput.value = "";
    dueDateInput.value = "";
}

// Funkcja usuwająca zadanie z listy
function removeTask(index) {
    tasks.splice(index, 1);
    renderTasks();
    saveTasksToLocalStorage();
}

// Funkcja wyświetlająca zadania na liście
function renderTasks(filteredTasks = tasks) {
    taskList.innerHTML = "";
    filteredTasks.forEach((task, index) => {
        const listItem = document.createElement("li");
        listItem.innerHTML = `${task.text} (Termin: ${task.dueDate || "brak"}) <button onclick="removeTask(${index})">Usuń</button>`;
        taskList.appendChild(listItem);
    });
}

// Funkcja filtrująca i wyświetlająca zadania na liście
function searchTasks() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredTasks = tasks.filter(task => task.text.toLowerCase().includes(searchTerm));
    renderTasks(filteredTasks);
}

// Funkcja zapisująca listę zadań do Local Storage
function saveTasksToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Funkcja wczytująca listę zadań z Local Storage
function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
        tasks = JSON.parse(storedTasks);
        renderTasks();
    }
}

addTaskButton.addEventListener("click", addTask);
searchInput.addEventListener("input", searchTasks);

loadTasksFromLocalStorage();
