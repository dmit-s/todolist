class ToDoList{
    constructor(){
        this.inputEL = document.getElementById('date-input');
    }

    addTask(){
        const task = {text: 'DSOADOASD', completed: false}
        const dateId = this.inputEL.value.split('-'); 
        const tasksStorage = localStorage.getItem('Tasks');

        if(!tasksStorage.getItem('Tasks')){
            const obj = {
                [dateId]: [task]
            }
            tasksStorage.setItem('Tasks', obj);
            return;
        }

        if(tasksStorage[dateId]){
            tasksStorage[dateId].push(task);
        } else {
            tasksStorage[dateId] = [task];
        }

        localStorage.setItem('Tasks', tasksStorage);
    }
}