import DateFormInstance from "./src/components/DateForm/DateForm.js";
import ToDoList from "./src/components/ToDoList/ToDoList.js";


class App{
    constructor(){
        this.init();
    }

    init(){
        DateFormInstance.init();
        ToDoList.init();
    }
}

new App();