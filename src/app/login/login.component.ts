import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '@/_services';
import { IDs, ErrorInterceptor }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';
import { User } from '@/_models';

@Component({ 
    templateUrl: 'login.component.html',
    styleUrls: ['login.component.less']
})
export class LoginComponent implements OnInit, OnDestroy {
    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
        private wsservice: WebSocketService,
        private errorInterceptor: ErrorInterceptor
    ) { 
        // redirect to home if already logged in
        if (this.authenticationService.currentUserValue) { 
            //this.authenticationService.getUserInfo();
            // this.authenticationService.getUserInfo(this.authenticationService.currentUserValue.username).subscribe((fullInfo) => {
            //     console.log('GET USER INFO');
            //     let user = new User({
            //         id: fullInfo.id,
            //         token: this.authenticationService.currentUserValue.accessToken,
            //         username: this.authenticationService.currentUserValue.username,
            //         accessLevel: fullInfo.accessLevel,
            //         lastname: fullInfo.lastname,
            //         firstname: fullInfo.firstname,
            //         middlename: fullInfo.middlename
            //     });
    
            //     this.authenticationService.setUser(user);
            // });
            this.router.navigate(['/']);
        }
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        // get return url from route parameters or default to '/'
        this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() { return this.loginForm.controls; }

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.username.value, this.f.password.value);

        this.wsservice.on<any>(IDs.authentication.login)
            .subscribe((msg) => {
                console.log('login', msg);
                this.loading = false;
                if (!msg['code']) {
                    this.authenticationService.setUser(msg, this.f.username.value);
                    this.router.navigate([this.returnUrl]);
                }
                else {
                    this.error = this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    ngOnDestroy() {
        this.wsservice.close();
    }
}