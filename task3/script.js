
let todos = [];
let currentFilter = 'all'; // 'all' | 'active' | 'completed'


const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const errorMessage = document.getElementById('error-message');
const todoList = document.getElementById('todo-list');
const itemsLeft = document.getElementById('items-left');
const itemsCompleted = document.getElementById('items-completed');
const filterButtons = document.querySelectorAll('.btn-filter');



function addTodo(text) {
  const trimmedText = text.trim();

  // Валидация на пустой ввод
  if (!trimmedText) {
    showError();
    return;
  }

  hideError();

  const newTodo = {
    id: Date.now(),
    text: trimmedText,
    completed: false
  };

  todos.push(newTodo);
  todoInput.value = '';
  render();
}

function toggleTodo(id) {
  todos = todos.map(todo => {
    if (todo.id === id) {
      return { ...todo, completed: !todo.completed };
    }
    return todo;
  });
  render();
}

function deleteTodo(id) {
  todos = todos.filter(todo => todo.id !== id);
  render();
}

function setFilter(newFilter) {
  currentFilter = newFilter;

  filterButtons.forEach(btn => {
    if (btn.dataset.filter === newFilter) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  render();
}


function showError() {
  todoInput.classList.add('input-error');
  errorMessage.classList.add('visible');
  todoInput.focus();
}

function hideError() {
  todoInput.classList.remove('input-error');
  errorMessage.classList.remove('visible');
}


function render() {
  todoList.innerHTML = '';

  // Фильтрация для текущего вида
  const filteredTodos = todos.filter(todo => {
    if (currentFilter === 'active') return !todo.completed;
    if (currentFilter === 'completed') return todo.completed;
    return true;
  });

  if (filteredTodos.length === 0) {
    const emptyLi = document.createElement('li');
    emptyLi.className = 'empty-state';
    emptyLi.textContent = todos.length === 0 ? 'Задач пока нет' : 'В этой вкладке ничего нет';
    todoList.appendChild(emptyLi);
  } else {
    filteredTodos.forEach(todo => {
      const li = document.createElement('li');
      li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
      li.dataset.id = todo.id;

      const contentDiv = document.createElement('div');
      contentDiv.className = 'todo-content';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'todo-checkbox';
      checkbox.checked = todo.completed;

      const span = document.createElement('span');
      span.className = 'todo-text';
      span.textContent = todo.text;

      contentDiv.appendChild(checkbox);
      contentDiv.appendChild(span);

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn-delete';
      deleteBtn.innerHTML = '&times;';
      deleteBtn.title = 'Удалить задачу';

      li.appendChild(contentDiv);
      li.appendChild(deleteBtn);
      todoList.appendChild(li);
    });
  }

  const activeCount = todos.filter(t => !t.completed).length;
  const completedCount = todos.filter(t => t.completed).length;

  itemsLeft.textContent = `Осталось: ${activeCount}`;
  itemsCompleted.textContent = `Выполнено: ${completedCount}`;
}


todoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTodo(todoInput.value);
});

todoInput.addEventListener('input', () => {
  if (todoInput.value.trim()) {
    hideError();
  }
});

todoList.addEventListener('click', (e) => {
  const item = e.target.closest('.todo-item');
  if (!item) return;

  const todoId = Number(item.dataset.id);

  if (e.target.classList.contains('btn-delete')) {
    deleteTodo(todoId);
    return;
  }

  if (e.target.closest('.todo-content')) {
    toggleTodo(todoId);
  }
});

filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    setFilter(button.dataset.filter);
  });
});

render();