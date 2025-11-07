/**
 * File: script.js
 * Description: Todo list application with add, toggle, and delete functionality
 * Author: Shinto
 * Date: November 2025
 */

let todos = [];
let currentFilter = 'all';

function addTodo() {
    const input = document.getElementById('todoInput');
    const prioritySelect = document.getElementById('prioritySelect');
    const todoText = input.value.trim();
    const priority = prioritySelect.value;

    if (todoText === '') {
        alert('Please enter a task!');
        return;
    }

    const todo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        priority: priority
    };

    todos.push(todo);
    input.value = '';
    prioritySelect.value = 'medium'; // Reset to default
    renderTodos();
}

function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        renderTodos();
    }
}

function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    renderTodos();
}

function editTodo(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const textSpan = todoItem.querySelector('.todo-text');
    const editInput = todoItem.querySelector('.edit-input');
    const editBtn = todoItem.querySelector('.edit-btn');
    const deleteBtn = todoItem.querySelector('.delete-btn');
    const saveBtn = todoItem.querySelector('.save-btn');
    const cancelBtn = todoItem.querySelector('.cancel-btn');

    // Hide text and normal buttons
    textSpan.style.display = 'none';
    editBtn.style.display = 'none';
    deleteBtn.style.display = 'none';

    // Show input and edit mode buttons
    editInput.style.display = 'inline-block';
    saveBtn.style.display = 'inline-block';
    cancelBtn.style.display = 'inline-block';

    // Focus the input
    editInput.focus();
    editInput.select();
}

function saveEdit(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const editInput = todoItem.querySelector('.edit-input');
    const newText = editInput.value.trim();

    if (newText === '') {
        alert('Task text cannot be empty!');
        return;
    }

    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.text = newText;
        renderTodos();
    }
}

function cancelEdit(id) {
    const todoItem = document.querySelector(`[data-id="${id}"]`);
    const todo = todos.find(t => t.id === id);
    const editInput = todoItem.querySelector('.edit-input');

    // Reset input to original value
    if (todo) {
        editInput.value = todo.text;
    }

    renderTodos();
}

function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    renderTodos();
}

function setFilter(filter) {
    currentFilter = filter;

    // Update active button styling
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.filter === filter) {
            btn.classList.add('active');
        }
    });

    renderTodos();
}

function updateActiveCounter() {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    const counter = document.getElementById('activeCounter');
    counter.textContent = `Active tasks: ${activeTasks}`;
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    // Filter todos based on currentFilter
    let filteredTodos = todos;
    if (currentFilter === 'active') {
        filteredTodos = todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    }

    filteredTodos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.setAttribute('data-id', todo.id);

        // Set default priority if not set
        const priority = todo.priority || 'medium';

        li.innerHTML = `
            <input type="checkbox"
                   ${todo.completed ? 'checked' : ''}
                   onchange="toggleTodo(${todo.id})">
            <span class="priority-badge priority-${priority}">${priority}</span>
            <span class="todo-text" style="margin-left: 10px;">${todo.text}</span>
            <input type="text" class="edit-input" value="${todo.text}" style="display: none; margin-left: 10px;">
            <div class="button-group">
                <button class="edit-btn" onclick="editTodo(${todo.id})">Edit</button>
                <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
                <button class="save-btn" onclick="saveEdit(${todo.id})" style="display: none;">Save</button>
                <button class="cancel-btn" onclick="cancelEdit(${todo.id})" style="display: none;">Cancel</button>
            </div>
        `;
        todoList.appendChild(li);
    });

    // Show/hide Clear Completed button based on completed tasks
    const clearBtn = document.getElementById('clearCompletedBtn');
    const hasCompletedTasks = todos.some(t => t.completed);
    clearBtn.style.display = hasCompletedTasks ? 'block' : 'none';
    updateActiveCounter();
}

// Dark Mode Toggle Functionality
function toggleDarkMode() {
    const body = document.body;
    const toggle = document.getElementById('darkModeToggle');

    body.classList.toggle('dark-mode');

    // Update button text based on current mode
    if (body.classList.contains('dark-mode')) {
        toggle.textContent = '☀️ Light Mode';
        localStorage.setItem('darkMode', 'enabled');
    } else {
        toggle.textContent = '🌙 Dark Mode';
        localStorage.setItem('darkMode', 'disabled');
    }
}

// Load dark mode preference from localStorage
function loadDarkModePreference() {
    const darkMode = localStorage.getItem('darkMode');
    const body = document.body;
    const toggle = document.getElementById('darkModeToggle');

    if (darkMode === 'enabled') {
        body.classList.add('dark-mode');
        toggle.textContent = '☀️ Light Mode';
    }
}

// Allow Enter key to add todo
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('todoInput');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });

    // Set up dark mode toggle button
    const darkModeToggle = document.getElementById('darkModeToggle');
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Set up filter button event listeners
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            setFilter(this.dataset.filter);
        });
    });

    // Load dark mode preference on page load
    loadDarkModePreference();
});
