(function () {
  // * Создаем глобальную функцию объекта дела
  let itemNameObj;


  // * Создаем массив, который будет заполняться делами
  let arrItemsResult = [];

  let listName = '';

  // ! создаем и возвращаем заголовок приложения
  function createAppTitle(title) {
    let appTitle = document.createElement('h2');
    appTitle.innerHTML = title;
    return appTitle;
  };


  // ! создаем и возвращаем форму для создания дела
  function createTodoItemForm() {
    let form = document.createElement('form');
    let input = document.createElement('input');
    let buttonWrapper = document.createElement('div');
    let button = document.createElement('button');


    form.classList.add('input-group', 'mb-3');
    input.classList.add('form-control');
    input.placeholder = 'Введите название нового дела';
    buttonWrapper.classList.add('input-group-append');
    button.classList.add('btn', 'btn-primary');
    button.textContent = 'Добавить дело';

    buttonWrapper.append(button);
    form.append(input);
    form.append(buttonWrapper);


    // * Этап 2. делаем у кнопки disabled при запуске программы
    button.disabled = true;

    // * убираем disabled у кнопки, если юзер что-то ввел в поле
    input.addEventListener('input', () => {
      if (input.value == '') {
        button.disabled = true;
      } else {
        button.disabled = false;
      };
    });


    return {
      form,
      input,
      button
    };
  };



  // ! создаем и возвращаем список элементов
  function createTodoList() {
    let list = document.createElement('ul');
    list.classList.add('list-group');
    return list;
  };


  // ! создаем дело
  function createTodoItem(obj) {
    let item = document.createElement('li');
    // * кнопки помещаем в элемент, который красиво покажет их в одной группе
    let buttonGroup = document.createElement('div');
    let doneButton = document.createElement('button');
    let deleteButton = document.createElement('button');

    // * устанавливаем стили для элемента списка, а также для размещения кнопок
    // * в его правой части при помощи flex
    item.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-center');
    item.textContent = obj.name;


    buttonGroup.classList.add('btn-group', 'btn-group-sm');
    doneButton.classList.add('btn', 'btn-success');
    doneButton.textContent = 'Готово';
    deleteButton.classList.add('btn', 'btn-danger');
    deleteButton.textContent = 'Удалить';

    if (obj.done == true) {
      item.classList.add('list-group-item-success');
    }

    // * вкладываем кнопки в отдельный элемент, чтобы они объеденились в один блок
    buttonGroup.append(doneButton);
    buttonGroup.append(deleteButton);
    item.append(buttonGroup);

    //* добавляем обработчики событий на кнопки
    doneButton.addEventListener('click', () => {
      item.classList.toggle('list-group-item-success');

      // //* меняем статус и в массиве, подстать done true / done false
      for (const listItem of arrItemsResult) {
        if (listItem.id == obj.id) {
          listItem.done = !listItem.done;
        }
      };

      saveList(arrItemsResult, listName);

      console.log(arrItemsResult);
    });


    deleteButton.addEventListener('click', () => {

      if (confirm('Вы уверены?')) {
        item.remove();

        for (i = 0; i < arrItemsResult.length; i++) {
          if (arrItemsResult[i].id == obj.id) {
            arrItemsResult.splice(i, 1);
          };
          console.log(arrItemsResult);
        };
        saveList(arrItemsResult, listName);
      };
    });


    // * приложению нужен доступ к самому элементу и кнопкам, чтобы обрабатывать события нажатия
    return {
      item,
      doneButton,
      deleteButton,
    };
  };


  // ! создание уникального id
  function getNewID(arr) {
    let max = 0;
    for (const item of arr) {
      if (item.id > max) {
        max = item.id;
      };
    };
    return max + 1;
  };


  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arrItemsResult));
  };


  // ! переводим localStorage из строки в объект
  function saveList(arr, keyName) {
    localStorage.setItem(keyName, JSON.stringify(arrItemsResult));
  };


  // ! инициализация программы
  function createTodoApp(container, title, keyName, defArray = []) {
    

    let todoAppTitle = createAppTitle(title);
    let todoItemForm = createTodoItemForm();
    let todoList = createTodoList();


    container.append(todoAppTitle);
    container.append(todoItemForm.form);
    container.append(todoList);

    listName = keyName;
    arrItemsResult = defArray;


    let localData = localStorage.getItem(listName);

    if (localData !== null && localData !== '') {
      arrItemsResult = JSON.parse(localData);
    };

    for (const itemList of arrItemsResult) {
      let todoItem = createTodoItem(itemList);
      todoList.append(todoItem.item);
    };


    // * браузер создает событие submit на форме по нажатию на Enter или на кнопку создания дела
    todoItemForm.form.addEventListener('submit', function (e) {
      // * эта строчка необходима, чтобы предотвратить стандартные действия браузера
      // * здесь мы не хотим, чтобы страница перезагружалась при отправке формы
      e.preventDefault();


      // * игнорируем создание элемента, если пользователь ничего не ввел в поле
      if (!todoItemForm.input.value) {
        return;
      };


      // * Этап 1. создаем объект, чтобы функция создания дела принимала объект, а не строку
      itemNameObj = {
        id: getNewID(arrItemsResult),
        name: todoItemForm.input.value,
        done: false,
      };


      // * получаем в переменную объект
      let todoItem = createTodoItem(itemNameObj);


      // * создаем и добавляем в список новое
      todoList.append(todoItem.item);


      // * Этап 3. пушим в массив каждое созданное дело в виде объекта
      arrItemsResult.push(itemNameObj);

      // * вызов функции сохранения в localStorage
      saveList(arrItemsResult, listName);

      console.log(arrItemsResult);

      // * обнуляем значение в поле, чтобы не пришлось стирать его вручную
      // * переводим кнопку в disabled
      todoItemForm.input.value = '';
      todoItemForm.button.disabled = true;
    });
  }

  window.createTodoApp = createTodoApp;
})();
