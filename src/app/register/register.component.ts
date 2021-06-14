import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Error } from '@/_models';
import { AuthenticationService, AlertService } from '@/_services';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';

@Component({ 
    templateUrl: 'register.component.html',
    styleUrls: ['register.component.less']
 })
export class RegisterComponent implements OnInit, OnDestroy {
    registerForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    message = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private alertService: AlertService,
        private wsservice: WebSocketService
    ) { 
        if (this.authenticationService.currentUserValue) { 
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.registerForm = this.formBuilder.group({
            username: ['', Validators.required],
            email: ['', Validators.required],
            password: ['', Validators.required],
            firstname: ['', Validators.required],
            lastname: ['', Validators.required],
            middlename: ['', Validators.required],
        });

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    get f() { return this.registerForm.controls; }

    onSubmit() {
        this.submitted = true;

        if (this.registerForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.register(this.registerForm.value);

        this.wsservice.on<any>(IDs.authentication.register)
            .subscribe((msg) => {
                console.log('register', msg);
                this.loading = false;
                if (!msg['code']) {
                    this.message = 'Вы зарегистрированы';
                }
                else {
                    this.message = msg['message'];
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}