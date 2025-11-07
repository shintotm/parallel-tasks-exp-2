/**
 * File: script.js
 * Description: Todo list application with add, toggle, and delete functionality
 * Author: Shinto
 * Date: November 2025
 */

let todos = [];

function addTodo() {
    const input = document.getElementById('todoInput');
    const todoText = input.value.trim();
    
    if (todoText === '') {
        alert('Please enter a task!');
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: todoText,
        completed: false,
        timestamp: new Date().toISOString()
    };
    
    todos.push(todo);
    input.value = '';
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

function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    renderTodos();
}

function exportTodos() {
    // Create JSON string with proper formatting
    const jsonString = JSON.stringify(todos, null, 2);

    // Create a blob from the JSON string
    const blob = new Blob([jsonString], { type: 'application/json' });

    // Create a temporary download link
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'todos.json';

    // Trigger download
    document.body.appendChild(link);
    link.click();

    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function updateActiveCounter() {
    const activeTasks = todos.filter(todo => !todo.completed).length;
    const counter = document.getElementById('activeCounter');
    counter.textContent = `Active tasks: ${activeTasks}`;
}

function renderTodos() {
    const todoList = document.getElementById('todoList');
    todoList.innerHTML = '';

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = 'todo-item' + (todo.completed ? ' completed' : '');
        li.innerHTML = `
            <input type="checkbox"
                   ${todo.completed ? 'checked' : ''}
                   onchange="toggleTodo(${todo.id})">
            <span style="margin-left: 10px;">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTodo(${todo.id})">Delete</button>
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

    // Load dark mode preference on page load
    loadDarkModePreference();
});
