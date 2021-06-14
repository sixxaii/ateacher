import { Component, OnInit, Compiler, OnChanges, AfterViewInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router'
import { Task, TaskRun, TaskCompiler, Error } from '@/_models';
import { TaskService } from '@/_services';
import './task.component.less';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';


@Component({ 
    templateUrl: 'task.component.html',
    styleUrls: ['./task.component.less']
})
export class TaskComponent implements OnInit, OnDestroy {
    public pageTitle: string;
    private task: Task;
    private taskId: number;
    private courseId: number;

    private runs: TaskRun[];
    private runsPagedConfig;

    public compilers: TaskCompiler[];
    private compilerId: number;

    fileToUpload: File = null;
    mathJaxObject;

    message = '';

    constructor(
        private taskService: TaskService,
        private route: ActivatedRoute,
        private wsservice: WebSocketService
    ) 
    {
        
    }

    ngOnInit() {
        var script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.6/MathJax.js?config=TeX-AMS_CHTML-full";
        document.getElementsByTagName("head")[0].appendChild(script);
        this.mathJaxObject = window['MathJax'];
        console.log(this.mathJaxObject);

        this.taskId = this.route.snapshot.params.tid;
        this.courseId = this.route.snapshot.params.cid;

        if (this.route.toString().includes('task')) {
            this.getRequestedTask(this.taskId);
            this.getCompilers();
        }
    }

    getRequestedTask(id: number) {
        this.taskService.getTask(id);

        this.wsservice.on<any>(IDs.task.get)
            .subscribe((msg) => {
                if (!msg['code']) {
                    let task = msg;
                    this.task = new Task({
                        id: task.id,
                        name: task.name || "Нет названия", 
                        legend: task.legend,
                        complexity: task.complexity,
                        timeLimit: task["time_limit"] / 1000,
                        memoryLimit: task["memory_limit"] / 1024 / 1024,
                        input: task.input,
                        output: task.output,
                        tags: task.tags || []
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    getCompilers() {
        this.taskService.getCompilers();

        this.wsservice.on<any>(IDs.task.compilers.list)
            .subscribe((msg) => {
                if (!msg['code']) {
                    let compilers = msg;
                    this.compilers = compilers.map(item => {
                        return new TaskCompiler({
                            id: item.id,
                            name: item['display_name']
                        });
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    ngAfterViewInit(){
        this.mathJaxObject.Hub.Config({
            showMathMenu: false,
            tex2jax: { inlineMath: [["\\(", "\\)"]],displayMath:[["$$", "$$"]] },
            menuSettings: { zoom: "Double-Click", zscale: "150%" },
            CommonHTML: { linebreaks: { automatic: true } },
            "HTML-CSS": { linebreaks: { automatic: true } },
            SVG: { linebreaks: { automatic: true } }
        });
        let angObj = this;
        setTimeout(() => {
            angObj.mathJaxObject['Hub'].Queue(["Typeset", angObj.mathJaxObject.Hub]);
        },1000)
    }

    setFileData(files: FileList) {
        this.fileToUpload = files.item(0);
    }

    setCompiler(id) {
        this.compilerId = id;
        console.log('compiler', id);
    }

    handleFileInput(compilerId) {
        console.log('hh', compilerId);
        let message = this.taskService.postFile(this.taskId, this.fileToUpload, compilerId, this.courseId);
        this.message = 'Решение отправлено';
        // if (message == requestStatus.success) {
        //     this.message = 'Решение отправлено';
        // } else {
        //     this.message = 'Ошибка при отправке';
        // }
    }

    onSubmit() {
        this.handleFileInput(this.compilerId);
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}
