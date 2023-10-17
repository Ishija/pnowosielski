const searchInput = document.getElementById('searchInput');
const taskInput = document.getElementById('taskInput');
const deadlineInput = document.getElementById('deadlineInput');
const addTaskButton = document.getElementById('addTask');
const todoList = document.getElementById('todoList');

class Todo {
    constructor() {
        this.tasks = [];
        this.term = '';
    }
    getFilteredTasks() {
        return this.tasks.filter(task => task.text.toLowerCase().includes(this.term.toLowerCase()));
    }
}

const todo = new Todo();

function generateTaskList(filteredTasks = todo.tasks) {
    todoList.innerHTML = '';
    for (let i = 0; i < filteredTasks.length; i++) {
        const taskItem = document.createElement('li');
        taskItem.classList.add('task-item');

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = filteredTasks[i].completed;
        checkbox.addEventListener('change', () => {
            filteredTasks[i].completed = checkbox.checked;
            saveTasksToLocalStorage();
        });

        taskItem.appendChild(checkbox);

        const taskText = document.createElement('span');
        const searchTerm = todo.term.toLowerCase();
        const text = filteredTasks[i].text;
        if (searchTerm.length > 0 && text.toLowerCase().includes(searchTerm)) {
            const parts = text.split(new RegExp(`(${searchTerm})`, 'gi'));
            parts.forEach(part => {
                const span = document.createElement('span');
                if (part.toLowerCase() === searchTerm) {
                    span.classList.add('highlight');
                }
                span.textContent = part;
                taskText.appendChild(span);
            });
        } else {
            taskText.textContent = text;
        }

        taskText.classList.add('task-text');
        taskItem.appendChild(taskText);

        const deadline = document.createElement('input');
        deadline.type = 'datetime-local';
        deadline.value = filteredTasks[i].deadline;
        deadline.classList.add('task-deadline');
        taskItem.appendChild(deadline);

        const editButton = document.createElement('button');
        editButton.textContent = 'Edytuj';
        editButton.addEventListener('click', () => {
            taskText.setAttribute('contenteditable', 'true');
            taskText.focus();
            deadline.removeAttribute('readonly');
        });

        taskText.addEventListener('blur', () => {
            taskText.removeAttribute('contenteditable');
            filteredTasks[i].text = taskText.textContent;
            saveTasksToLocalStorage();
        });

        deadline.addEventListener('change', () => {
            filteredTasks[i].deadline = deadline.value;
            saveTasksToLocalStorage();
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Usuń';
        deleteButton.addEventListener('click', () => {
            const index = todo.tasks.indexOf(filteredTasks[i]);
            if (index !== -1) {
                todo.tasks.splice(index, 1);
                saveTasksToLocalStorage();
                generateTaskList();
            }
        });

        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);
        todoList.appendChild(taskItem);
    }
}

function saveTasksToLocalStorage() {
    localStorage.setItem('tasks', JSON.stringify(todo.tasks));
}

function loadTasksFromLocalStorage() {
    const storedTasks = localStorage.getItem('tasks');
    if (storedTasks) {
        todo.tasks = JSON.parse(storedTasks);
        generateTaskList();
    }
}

addTaskButton.addEventListener('click', () => {
    const taskText = taskInput.value.trim();
    const deadline = deadlineInput.value;
    if (taskText.length >= 3 && taskText.length <= 255 && (!deadline || new Date(deadline) > new Date())) {
        todo.tasks.push({ text: taskText, deadline: deadline, completed: false });
        generateTaskList();
        saveTasksToLocalStorage();
        taskInput.value = '';
        deadlineInput.value = '';
    } else {
        alert('Niepoprawne dane! Upewnij się, że tekst ma co najmniej 3 znaki, nie więcej niż 255 znaków, ' +
            'a data jest w przyszłości.');
    }
});

searchInput.addEventListener('input', () => {
    todo.term = searchInput.value;
    const filteredTasks = todo.getFilteredTasks();
    generateTaskList(filteredTasks);
});

loadTasksFromLocalStorage();
