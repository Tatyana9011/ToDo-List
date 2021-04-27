// eslint-disable-next-line strict
'use strict';

class ToDo {
  constructor(form, input, todoList, todoCompleted, todoContainer) {
    this.form = document.querySelector(form);
    this.input = document.querySelector(input);
    this.todoList = document.querySelector(todoList);
    this.todoCompleted = document.querySelector(todoCompleted);
    this.todoContainer = document.querySelector(todoContainer);
    this.todoData = new Map(JSON.parse(localStorage.getItem('todoData')));
  }

  addToStorage() {
    //коллекцию необходимо перевести в масив для записи в локал сторидж
    localStorage.setItem('todoData', JSON.stringify([...this.todoData]));
  }

  render() {
    this.todoList.textContent = '';
    this.todoCompleted.textContent = '';
    this.todoData.forEach(this.createItem, this);
    this.addToStorage();
  }

  createItem(todoElem) {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.key = todoElem.key;
    li.insertAdjacentHTML('beforeend', `
    <span class="text-todo">${todoElem.value}</span>
				<div class="todo-buttons">
					<button class="todo-edit"></button>
          <button class="todo-remove"></button>
					<button class="todo-complete"></button>
				</div>
    `);

    if (todoElem.completed) {
      this.todoCompleted.append(li);
    } else {
      this.todoList.append(li);
    }
  }

  addTodo(e) {
    e.preventDefault();

    if (this.input.value.trim()) {
      const newTodo = {
        value: this.input.value,
        completed: false,
        key: this.generateKey(),
      };
      //ключь нужен для поиска, манипуляций и удаления елементов в коллекции
      this.todoData.set(newTodo.key, newTodo); //добавили в коллекцию ключ значение
      this.render();
      this.input.value = '';
    } else {
      alert('Пустое дело добавить нельзя!');
    }
  }

  animated(elem, callback) {
    let count = 0;
    let flyInterval;
    const flyAnimate = () => {
      flyInterval = requestAnimationFrame(flyAnimate);
      if (count <= 2000) {
        count += 100;
        elem.style.right = count + 'px';
      } else {
        cancelAnimationFrame(flyInterval);
        callback(elem);
      }
    };
    let animate;
    if (!animate) {
      flyInterval = requestAnimationFrame(flyAnimate);
      animate = true;
    } else {
      animate = false;
      cancelAnimationFrame(flyInterval);
    }
  }

  deleteItem(elem) {
    if (this.todoData.has(elem.key)) {
      this.todoData.delete(`${elem.key}`);
    }
    this.render();
    this.addToStorage();
    /* elem.remove();//тоже рабочий вариант удаления
    this.todoData = [...this.todoData].filter(item => item[0] !== elem.key);
    this.addToStorage(); */
  }

  completedItem(elem) {
    this.todoData.forEach(item => {
      if (elem.key === item.key) {
        if (item.completed === false) {
          item.completed = true;
        } else {
          item.completed = false;
        }
      }
    });
    this.render();
    this.addToStorage();
  }

  updateItem(elem) {
    this.todoData.forEach(item => {
      if (elem.key === item.key) {
        elem.contentEditable = 'true';
        elem.style.backgroundColor = "#d6f4f8";
        elem.focus();
        elem.addEventListener('blur', () => {
          const updateValue = elem.textContent;
          elem.style.backgroundColor = '#fff';
          item.value = updateValue.trim();
          this.addToStorage();
        });
      }
    });
  }

  handler() {
    this.todoContainer.addEventListener('click', event => {
      const target = event.target;
      if (target.matches('.todo-remove')) {
        this.animated(target.closest('.todo-item'), this.deleteItem.bind(this));
      }
      if (target.matches('.todo-complete')) {
        this.animated(target.closest('.todo-item'), this.completedItem.bind(this));
      }
      if (target.matches('.todo-edit')) {
        this.updateItem(target.closest('.todo-item'));
      }
    });
  }

  generateKey() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }
  init() {
    this.form.addEventListener('submit', this.addTodo.bind(this));
    this.render();
  }
}

const todo = new ToDo('.todo-control', '.header-input', '.todo-list', '.todo-completed', '.todo-container');
todo.init();
todo.handler();
