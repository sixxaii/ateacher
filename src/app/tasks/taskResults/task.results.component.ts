import { Component, OnInit, OnDestroy } from '@angular/core';
import { Task, TaskRun } from '@/_models';
import { TaskService } from '@/_services';
import { ActivatedRoute } from '@angular/router';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: 'task.results.component.html',
    styleUrls: ['task.results.component.less']
})
export class TaskResultsComponent implements OnInit, OnDestroy {
    private runs: TaskRun[];
    private taskId: number;
    private courseId: number;

    constructor(private taskService: TaskService,
                private route: ActivatedRoute,
                private wsservice: WebSocketService) {
        
    }

    ngOnInit() {
        this.taskId = this.route.snapshot.params.tid;
        this.courseId = this.route.snapshot.params.cid;

        this.getRuns(this.taskId, this.courseId);
    }

    getRuns(tid: number, cid: number) {
        this.taskService.getRuns(tid, cid);

        this.wsservice.on<any>(IDs.task.runs.get)
            .subscribe((msg) => {
                console.log('task test results', msg);
                if (!msg['code']) {
                    let runs = msg;
                    this.runs = runs.map(item => {
                        return new TaskRun({
                            id: item.id,
                            testsCount: item.passed_count,
                            result: item.result
                        });
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}
