class ToDoList {
  constructor() {
    this.inputEL = document.getElementById("date-input");
    this.addTaskInput = document.getElementById("add-input");
    this.addingFormEl = document.getElementById("adding-form");
  }

  init() {
    this.attachEvents();
  }

  attachEvents() {
    this.addingFormEl.addEventListener("submit", this.addTask.bind(this));
  }

  addTask(e) {
    e.preventDefault();
    console.log(123);

    const task = { text: "DSOADOASD", completed: false };
    const dateId = this.inputEL.value.split("-");
    const tasksStorage = localStorage.getItem("Tasks");

    if (!tasksStorage.getItem("Tasks")) {
      const obj = {
        [dateId]: [task],
      };
      tasksStorage.setItem("Tasks", obj);
      return;
    }

    if (tasksStorage[dateId]) {
      tasksStorage[dateId].push(task);
    } else {
      tasksStorage[dateId] = [task];
    }

    localStorage.setItem("Tasks", tasksStorage);
  }
}

export default new ToDoList();
