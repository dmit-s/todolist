export class ToDoList {
  constructor() {
    this.inputEL = document.getElementById("date-input");
    this.addTaskInput = document.getElementById("add-input");
    this.addingFormEl = document.getElementById("adding-form");
    this.tasksList = document.getElementById("tasks-list");
    this.refreshBtn = document.getElementById('refresh-tasks-btn');
 
  }

  init() {
    this.attachEvents();
    this.renderTasks();

  }

  attachEvents() {
    this.addingFormEl.addEventListener("submit", this.addTask.bind(this));
    this.refreshBtn.addEventListener('click', this.refresh.bind(this));
  }

  addTask(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputValue = formData.get("add-task-input");

    const task = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
    };
    const dateId = this.inputEL.value.split("-").join("");
    let tasksStorage = JSON.parse(localStorage.getItem("Tasks"));
    
    if (!tasksStorage) {
      tasksStorage = {
        [dateId]: [task],
      }
    } else if(tasksStorage[dateId]){
      tasksStorage[dateId].push(task);
    } else {
      tasksStorage[dateId] = [task];
    }

    localStorage.setItem("Tasks", JSON.stringify(tasksStorage));
    this.renderTasks();
    e.target.reset();
  }

  removeTask(e){
    const btnEl = e.target.closest('#trash-btn');
    const taskItemEl = btnEl.parentElement.parentElement;
    const currentDateId = this.inputEL.value.split("-").join("");
    const tasksStorage = JSON.parse(localStorage.getItem('Tasks'));

  
    const filteredTasks = tasksStorage[currentDateId].filter(t => t.id !== taskItemEl.dataset.id);
    tasksStorage[currentDateId] = filteredTasks;
    localStorage.setItem('Tasks', JSON.stringify(tasksStorage));
    taskItemEl.remove();
  }

  completeTask(e){
    const btnEl = e.target.closest('#complete-btn');
    const taskItemEl = btnEl.parentElement.parentElement;
    const currentDateId = this.inputEL.value.split("-").join("");
    const tasksStorage = JSON.parse(localStorage.getItem('Tasks'));

    const findTask = tasksStorage[currentDateId].find(t => t.id == taskItemEl.dataset.id);

    if(findTask.completed){
      findTask.completed = false;
      taskItemEl.classList.remove('checked');
    } else{
      findTask.completed = true;
      taskItemEl.classList.add('checked');
    }

    localStorage.setItem('Tasks', JSON.stringify(tasksStorage));
  }

  createMarkup(tasks){
    return tasks.map(t => {
      const {id, text, completed} = t;
    
      return `
        <div id="task-item"  data-id=${id} class="tasks-list__item ${completed && 'checked'}">
          <input class="tasks-list__item-input" type="text" value=${text} />
          <div class="tasks-list__item-buttons-wrapper">
            <button id="complete-btn" class="tasks-list__item-complete-btn">
              <i class="fa-solid fa-circle-check"></i>
              <i class="fa-regular fa-circle"></i>
            </button>
            <button id="trash-btn" class="tasks-list__item-trash-btn">
              <i class="fa-solid fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    })
  }

  attachTasksEvents(){
    const completeBtns = document.querySelectorAll('#complete-btn');
    const trashBtns = document.querySelectorAll('#trash-btn');

    trashBtns.forEach(btn => btn.addEventListener('click', this.removeTask.bind(this)));
    completeBtns.forEach(btn => btn.addEventListener('click', this.completeTask.bind(this)))
  }

  renderTasks(){
    this.clearTasksList();
    const tasks = JSON.parse(localStorage.getItem('Tasks'));
    if(!tasks) return;
    const currentDate = this.inputEL.value; //*
    const todayTasks = tasks[currentDate.split('-').join('')];


    if(!todayTasks) {
      console.log('not found');
      return;
    };

    const markup = this.createMarkup(todayTasks);
    this.tasksList.insertAdjacentHTML('beforeend', markup.join(''));

    this.attachTasksEvents();
  }

  clearTasksList(){
    const listEl = document.getElementById('tasks-list');
    listEl.innerHTML = ``;
  }

  refresh(){
    localStorage.removeItem('Tasks');
    this.renderTasks();
  }
}

export default new ToDoList();