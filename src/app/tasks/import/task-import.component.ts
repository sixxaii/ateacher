import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IDs }  from '@/_helpers';
import { AlertService, AuthenticationService, TaskService } from '@/_services';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: 'task-import.component.html',
    styleUrls: ['task-import.component.less']
})
export class TaskImportComponent implements OnInit, OnDestroy {
    importForm: FormGroup;
    loading = false;
    submitted = false;

    message = '';

    constructor(
        private taskService: TaskService,
        private formBuilder: FormBuilder,
        private alertService: AlertService,
        private wsservice: WebSocketService
    ) {

    }

    ngOnInit() {
        this.importForm = this.formBuilder.group({
            taskId: ['', Validators.required],
            login: [[''], Validators.required],
            password: ['', Validators.required]
        });
    }

    // convenience getter for easy access to form fields
    get f() { return this.importForm.controls; }

    onSubmit() {
        this.submitted = true;

        // reset alerts on submit
        this.alertService.clear();

        // stop here if form is invalid
        if (this.importForm.invalid) {
            return;
        }

        this.loading = true;
        this.taskService.importTask(this.importForm.value);
        this.wsservice.on<any>(IDs.task.import)
            .subscribe((msg) => {
                this.loading = false;
                if (!msg['code']) {
                    this.message = 'Задача импортирована';
                }
                else {
                    this.message = 'Ошибка при импорте';
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}
