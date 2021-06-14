import { Component, OnInit } from '@angular/core';
import { Task } from '@/_models';

import { TaskService } from '@/_services';

import './tasks.component.less';

@Component({ 
    templateUrl: 'tasks.component.html',
    styleUrls: ['./tasks.component.less']
})
export class TasksComponent implements OnInit {
    public filter = {
        q: '',
        tags: undefined,
        page: undefined
    };
    private tasks: Task[];

    constructor(private taskService: TaskService) {
        
    }

    ngOnInit() {
        setTimeout(() => {
            this.getTasks();
        }, 500);
    }

    getTasks() {
       // this.taskService.getTasks(this.filter.tags).subscribe(tasks => this.tasks = tasks);
       this.tasks = [
            new Task({
                id: 1,
                name: "Задача 1", 
                legend: "Пробная задача",
                complexity: 3,
                timeLimit: 2,
                memoryLimit: 1,
                input: "",
                output: "",
                tags: []
            }),
            new Task({
                id: 2,
                name: "Задача 2", 
                legend: "Пробная задача",
                complexity: 3,
                timeLimit: 2,
                memoryLimit: 1,
                input: "",
                output: "",
                tags: []
            }),
            new Task({
                id: 3,
                name: "Задача 3", 
                legend: "Пробная задача",
                complexity: 3,
                timeLimit: 2,
                memoryLimit: 1,
                input: "",
                output: "",
                tags: []
            })
       ];
    }

    search() {
        this.tasks.filter((val) => {
            return val.name.toLowerCase().indexOf(this.filter.q) > -1;
         });
    }
}
