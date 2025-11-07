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
        completed: false
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
}

// Allow Enter key to add todo
document.addEventListener('DOMContentLoaded', function() {
    const input = document.getElementById('todoInput');
    input.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
});
