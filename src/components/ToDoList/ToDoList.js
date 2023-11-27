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
    const formData = new FormData(e.target);
    const inputValue = formData.get("add-task-input");

    const task = {
      id: crypto.randomUUID(),
      text: inputValue,
      completed: false,
    };

    const dateId = this.inputEL.value.split("-").join("");
    const tasksStorage = JSON.parse(localStorage.getItem("Tasks"));

    if (!tasksStorage) {
      console.log(dateId);
      const obj = {
        [dateId]: [task],
      };
      localStorage.setItem("Tasks", JSON.stringify(obj));
      return;
    }

    if (tasksStorage[dateId]) {
      tasksStorage[dateId].push(task);
    } else {
      tasksStorage[dateId] = [task];
    }

    localStorage.setItem("Tasks", JSON.stringify(tasksStorage));
  }
}

export default new ToDoList();
