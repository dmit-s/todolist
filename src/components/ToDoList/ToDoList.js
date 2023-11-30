export class ToDoList {
  constructor() {
    this.inputEL = document.getElementById("date-input");
    this.addTaskInput = document.getElementById("add-input");
    this.addingFormEl = document.getElementById("adding-form");
    this.tasksList = document.getElementById("tasks-list");
    this.refreshBtn = document.getElementById("refresh-tasks-btn");
    this.selectEl = document.getElementById("tasks-select");
    this.addingFormMessageEl = document.getElementById('adding-form-message');

  }

  init() {
    this.attachEvents();
    // this.renderTasks();
    this.setInitialSelect();
  }

  attachEvents() {
    this.addingFormEl.addEventListener("submit", this.addTask.bind(this));
    this.refreshBtn.addEventListener("click", this.refresh.bind(this));
    this.selectEl.addEventListener("change", this.filterTasks.bind(this));
  }

  addTask(e) {
    e.preventDefault();
    this.addingFormMessageEl.innerText = '';
    const formData = new FormData(e.target);
    const inputValue = formData.get("add-task-input");
    if (inputValue.trim().length === 0) {

      this.addingFormMessageEl.innerText = 'Enter something...'
      return;
    };

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
      };
    } else if (tasksStorage[dateId]) {
      tasksStorage[dateId].push(task);
    } else {
      tasksStorage[dateId] = [task];
    }

    localStorage.setItem("Tasks", JSON.stringify(tasksStorage));
    this.renderTasks();
    e.target.reset();
  }

  removeTask(e) {
    const btnEl = e.target.closest("#trash-btn");
    const taskItemEl = btnEl.parentElement.parentElement;
    const currentDateId = this.inputEL.value.split("-").join("");
    const tasksStorage = JSON.parse(localStorage.getItem("Tasks"));

    const filteredTasks = tasksStorage[currentDateId].filter(
      (t) => t.id !== taskItemEl.dataset.id
    );
    tasksStorage[currentDateId] = filteredTasks;
    localStorage.setItem("Tasks", JSON.stringify(tasksStorage));
    taskItemEl.remove();
  }

  completeTask(e) {
    const btnEl = e.target.closest("#complete-btn");
    const taskItemEl = btnEl.parentElement.parentElement;
    const currentDateId = this.inputEL.value.split("-").join("");
    const tasksStorage = JSON.parse(localStorage.getItem("Tasks"));

    const findTask = tasksStorage[currentDateId].find(
      (t) => t.id == taskItemEl.dataset.id
    );

    if (findTask.completed) {
      findTask.completed = false;
      taskItemEl.classList.remove("checked");
    } else {
      findTask.completed = true;
      taskItemEl.classList.add("checked");
    }

    localStorage.setItem("Tasks", JSON.stringify(tasksStorage));
  }

  taskEdit(e) {
    if(e.type === 'keyup'){
      if(e.key !== 'Enter') return;
    }
    const target = e.target;
    const taskItemEl = e.target.parentElement;
    if(e.type === 'blur'){
      taskItemEl.classList.remove("focused");
    }
    const tasksStorage = JSON.parse(localStorage.getItem("Tasks"));
    const dateId = this.inputEL.value.split("-").join("");
    const findTask = tasksStorage[dateId].find(
      (t) => t.id == taskItemEl.dataset.id
    );

    if(target.value.trim() === ''){
      target.value = findTask.text;
      return;
    }
    findTask.text = target.value;
    localStorage.setItem("Tasks", JSON.stringify(tasksStorage));
  }

  createMarkup(tasks) {
    return tasks.map((t) => {
      const { id, text, completed } = t;

      return `
        <div id="task-item"  data-id=${id} class="tasks-list__item ${
        completed && "checked"
      }">
          <input id="task-input" class="tasks-list__item-input" type="text" value=${text} />
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
    });
  }

  attachTasksEvents() {
    const completeBtns = document.querySelectorAll("#complete-btn");
    const trashBtns = document.querySelectorAll("#trash-btn");
    const tasksInputs = document.querySelectorAll("#task-input");

    tasksInputs.forEach((item) =>
      item.addEventListener("focus", (e) => {
        const taskItemEl = e.target.parentElement;
        taskItemEl.classList.add("focused");
      })
    );
    tasksInputs.forEach((item) =>
      // item.addEventListener("blur", (e) => {
      //   this.taskEdit.bind(this);
        // const taskItemEl = e.target.parentElement;
        // taskItemEl.classList.remove("focused");
      // })
      item.addEventListener("blur", this.taskEdit.bind(this))
    );
    tasksInputs.forEach((item) =>
      item.addEventListener("keyup", this.taskEdit.bind(this))
    );
    trashBtns.forEach((btn) =>
      btn.addEventListener("click", this.removeTask.bind(this))
    );
    completeBtns.forEach((btn) =>
      btn.addEventListener("click", this.completeTask.bind(this))
    );
  }

  setInitialSelect() {
    const select = localStorage.getItem("Select");
    if (select) {
      this.selectEl.value = select;
    }
    this.filterTasks();
  }

  filterTasks() {
    const selectedValue = this.selectEl.value;
    localStorage.setItem("Select", selectedValue);
    if (selectedValue !== "all") {
      this.addTaskInput.setAttribute("disabled", true);
    } else {
      this.addTaskInput.removeAttribute("disabled");
    }
    const tasksStorage = JSON.parse(localStorage.getItem("Tasks"));
    const dateId = this.inputEL.value.split("-").join("");
    if (!tasksStorage || !tasksStorage[dateId]) return this.clearTasksList();
    let filteredTasks = [];

    switch (selectedValue) {
      case "unfinished":
        filteredTasks = tasksStorage[dateId].filter((t) => !t.completed);
        break;
      case "completed":
        filteredTasks = tasksStorage[dateId].filter((t) => t.completed);
        break;
      case "all":
        filteredTasks = tasksStorage[dateId];
        break;
    }

    this.renderTasks(filteredTasks);
  }

  renderTasks(filteredTasks) {
    this.clearTasksList();
    if (filteredTasks) {
      const markup = this.createMarkup(filteredTasks);
      this.tasksList.insertAdjacentHTML("beforeend", markup.join(""));

      this.attachTasksEvents();
      return;
    }

    const tasks = JSON.parse(localStorage.getItem("Tasks"));
    if (!tasks) return;
    const currentDate = this.inputEL.value; //*
    const todayTasks = tasks[currentDate.split("-").join("")];

    if (!todayTasks) {
      console.log("not found");
      return;
    }

    const markup = this.createMarkup(todayTasks);
    this.tasksList.insertAdjacentHTML("beforeend", markup.join(""));

    this.attachTasksEvents();
  }

  clearTasksList() {
    const listEl = document.getElementById("tasks-list");
    listEl.innerHTML = ``;
  }

  refresh() {
    localStorage.removeItem("Tasks");
    this.renderTasks();
  }
}

export default new ToDoList();
