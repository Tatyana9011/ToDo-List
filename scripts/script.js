'use strict';

const todoControl = document.querySelector('.todo-control');
const headerInput = document.querySelector('.header-input');
const todoList = document.querySelector('.todo-list');
const todoCompleted = document.querySelector('.todo-completed');


//получение дел из локал сторидж
let todoData = JSON.parse(localStorage.getItem('todoData')) || [];
//записываем в историю
function updateLocalStorage() {
  localStorage.setItem('todoData', JSON.stringify(todoData));
}
//удаление со страници и с истории
function deleteLi(value) {
  todoData = todoData.filter(item => item.value !== value);
  render();
  updateLocalStorage();
}
updateLocalStorage();

//рендер на страницу
const render = function () {
  todoList.textContent = '';
  todoCompleted.textContent = '';
  
  todoData.forEach((item) => {
    const li = document.createElement('li');
    li.classList.add('todo-item');
    li.innerHTML = `<span class="text-todo" >${item.value}</span>
			<div class="todo-buttons">
				<button class="todo-remove"></button>
				<button class="todo-complete"></button>
			</div>`;
    if (item.completed ) {
      todoCompleted.append(li);
      updateLocalStorage();
    } else if(item.value!==''){
      todoList.append(li);
      headerInput.value = ''; //после добавления в масив очищаем поле для ввода
      updateLocalStorage();
    }
    //cтавим и убираем галочку
    const btnTodoCompleted = li.querySelector('.todo-complete');
    btnTodoCompleted.addEventListener('click', () => {
      //текущий item будет инвертирован (был true станет false и наоборот)
      item.completed = !item.completed;
      render();
      updateLocalStorage();
    });
      //при нажатии на корзину удаляем
    const todoRemove = li.querySelector('.todo-remove');
    todoRemove.addEventListener('click', () => {
      deleteLi(item.value);
    });
  });
};

//вещаем событие сабмит
todoControl.addEventListener('submit', (event) => {
  event.preventDefault();
  let newToDo = {
    value: headerInput.value,
    completed: false,
  };
  if (newToDo.value !== '') {
    todoData.push(newToDo);
    render();
  }
})
//запускаем сразу как только страница загрузилась
render();