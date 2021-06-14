import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { JwtInterceptor, ErrorInterceptor, FilterPipe } from './_helpers';
import { HomeComponent } from './home';
import { LoginComponent } from './login';;
import { DocComponent } from './doc/doc.component'
import { RegisterComponent } from './register';
import { AlertComponent } from './_components';
import { ContestsComponent, ContestComponent, ResultsComponent, AddTaskComponent, AllContestsComponent } from './contests';
import { TasksComponent, TaskComponent, TaskImportComponent, TaskResultsComponent } from './tasks';
import { GroupsComponent, AddUserComponent, GroupsCreateComponent, GroupComponent } from './groups';
import { ContestsCreateComponent } from './contests/create';

import { WebsocketModule } from './_services/websocket';
import { environment } from '../environments/environment';
import { AddEntityComponent, AllCoursesComponent, ArticleComponent, CourseComponent, CoursesComponent, CoursesCreateComponent, LessonComponent, UserCoursesComponent } from './courses';;
import { NgbModule } from '@ng-bootstrap/ng-bootstrap'

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        ReactiveFormsModule,
        HttpClientModule,
        AppRoutingModule,
        FormsModule,
        WebsocketModule.config({
            url: environment.ws
        })
,
        NgbModule    ],
    declarations: [
        AppComponent,
        HomeComponent,
        LoginComponent,
        DocComponent,
        ContestsComponent,
        ContestComponent,
        ResultsComponent,
        FilterPipe,
        RegisterComponent,
        AlertComponent,
        TasksComponent,
        TaskComponent,
        TaskImportComponent,
        TaskResultsComponent,
        GroupsComponent,
        GroupsCreateComponent,
        GroupComponent,
        ContestsCreateComponent,
        AddTaskComponent,
        AddUserComponent,
        CourseComponent,
        LessonComponent,
        ArticleComponent,
        CoursesComponent,
        AllContestsComponent,
        CourseComponent,
        CoursesCreateComponent,
        AllCoursesComponent,
        UserCoursesComponent,
        AddEntityComponent
       ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }