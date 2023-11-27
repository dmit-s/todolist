class DateForm {
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
    this.inputEL = document.getElementById("date-input");
    this.labelEl = document.getElementById("date-label");
  }

  init() {
    this.attachEvents();
    this.changeDate(this.inputEL);
  }

  attachEvents() {
    this.inputEL.addEventListener("change", this.changeDate.bind(this));
    this.labelEl.addEventListener("click", () => {
      this.inputEL.showPicker();
    });
  }

  formatDate(date) {
    const dd = date.getDate();
    const mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();

    return `${yyyy}-${mm}-${dd}`;
  }

  changeDate(e) {
    const target = e.target;
    let date = target ? new Date(target.value) : new Date(e.value);

    if (isNaN(date)) {
      date = new Date();
      this.inputEL.value = this.formatDate(date);
    }

    const dayWeek = date.getDay();
    const dayNumber = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();

    this.labelEl.innerText = `${DateForm.days[dayWeek]}, ${DateForm.months[month]} ${dayNumber}`;

    // const splited = this.inputEL.value.split('-');
    // const dateObj = {
    //     day: splited[2],
    //     month: splited[1],
    //     year: splited[0]
    // }
  }
}

export default new DateForm();
