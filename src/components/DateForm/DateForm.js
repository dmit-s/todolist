import { ToDoList } from '../ToDoList/ToDoList.js';


class DateForm extends ToDoList {
  static days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  static months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  constructor() {
    super();
    this.inputEL = document.getElementById("date-input");
    this.labelEl = document.getElementById("date-label");
  }

  init() {
    this.attachEvents();
    this.setInitialDate();
  }

  attachEvents() {
    this.inputEL.addEventListener("change", this.changeDate.bind(this));
    this.labelEl.addEventListener("click", () => {
      this.inputEL.showPicker();
    });
  }

  formatDate(date) {
    const dd = new Intl.NumberFormat("en", { minimumIntegerDigits: 2 }).format(
      date.getDate()
    );
    const mm = new Intl.NumberFormat("en", { minimumIntegerDigits: 2 }).format(
      date.getMonth() + 1
    );
    const yyyy = date.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  }

  setInitialDate() {
    const savedDate = localStorage.getItem("Current Date");
    if (savedDate) {
      this.inputEL.value = savedDate;
      this.updateDate(new Date(savedDate));
    } else {
      this.changeDate();
    }
  }

  changeDate() {
    let date = isNaN(new Date(this.inputEL.value))
      ? new Date()
      : new Date(this.inputEL.value);
    const formattedDate = this.formatDate(date);
    console.log(formattedDate);
    this.inputEL.value = formattedDate;

    localStorage.setItem("Current Date", formattedDate);

    this.updateDate(date);
    this.renderTasks();
  }

  updateDate(date) {
    const dayWeek = date.getDay();
    const dayNumber = date.getDate();
    const month = date.getMonth();

    this.labelEl.innerText = `${DateForm.days[dayWeek]}, ${DateForm.months[month]} ${dayNumber}`;
  }
}

export default new DateForm();
