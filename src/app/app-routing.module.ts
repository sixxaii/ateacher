import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home';
import { LoginComponent } from './login';
import { AuthGuard } from './_helpers';
import { DocComponent } from './doc/doc.component';
import { ContestsComponent } from './contests/contests.component';
import { RegisterComponent } from './register';
import { TasksComponent, TaskComponent, TaskImportComponent, TaskResultsComponent } from './tasks';
import { ContestComponent, ResultsComponent, AddTaskComponent, AllContestsComponent, UserContestsComponent } from './contests';
import { GroupsComponent } from './groups';
import { GroupsCreateComponent } from './groups/create';
import { ContestsCreateComponent } from './contests/create';
import { GroupComponent } from './groups/group';
import { AddUserComponent } from './groups/add/add-user.component';
import { AddEntityComponent, AllCoursesComponent, ArticleComponent, CourseComponent, CoursesComponent, CoursesCreateComponent, LessonComponent, UserCoursesComponent } from './courses';

const coursesRoutes: Routes = [
    {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
    },
    { 
        path: 'all', 
        component: AllCoursesComponent
    },
    { 
        path: 'my', 
        component: UserCoursesComponent
    },
];

const contestsRoutes: Routes = [
    {
        path: '',
        redirectTo: 'all',
        pathMatch: 'full'
    },
    { 
        path: 'all', 
        component: AllContestsComponent
    },
    { 
        path: 'user/:id', 
        component: UserContestsComponent
    },
];

const routes: Routes = [
    { 
        path: 'doc', 
        component: DocComponent 
    },
    { 
        path: '', 
        component: HomeComponent, 
        data: { title: 'Главная' }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'login', 
        component: LoginComponent, 
        data: { title: 'Вход' } 
    },
    { 
        path: 'register', 
        component: RegisterComponent, 
        data: { title: 'Регистрация' } 
    },
    { 
        path: 'tasks', 
        component: TasksComponent, 
        data: { title: 'Банк задач', accessLevels: [3] }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'contests', 
        component: ContestsComponent, 
        canActivate: [AuthGuard],
        children: contestsRoutes
    },
    { 
        path: 'course/:cid/task/:tid', 
        component: TaskComponent, 
        data: { title: 'Просмотр задачи' }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'contest/:id', 
        component: ContestComponent, 
        data: { title: 'Просмотр соревнования' }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'contest/:id/results', 
        component: ResultsComponent, 
        data: { title: 'Результаты соревнования' }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'tasks/import', 
        component: TaskImportComponent, 
        data: { title: 'Импорт задачи', accessLevels: [3] }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'groups', 
        component: GroupsComponent, 
        data: { title: 'Группы', accessLevels: [3] }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'groups/create', 
        component: GroupsCreateComponent, 
        data: { title: 'Создание группы', accessLevels: [3] }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'group/:id', 
        component: GroupComponent, 
        data: { title: 'Просмотр группы' }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'course/:cid/task/:tid/results', 
        component: TaskResultsComponent, 
        data: { title: 'Попытки' }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'contests/create', 
        component: ContestsCreateComponent, 
        data: { title: 'Создание соревнования', accessLevel: 3 }, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'contest/:id/add', 
        component: AddTaskComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'group/:id/add', 
        component: AddUserComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'course/:id', 
        component: CourseComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'courses', 
        component: CoursesComponent, 
        canActivate: [AuthGuard],
        children: coursesRoutes
    },
    { 
        path: 'courses/create', 
        component: CoursesCreateComponent, 
        canActivate: [AuthGuard] 
    },
    { 
        path: 'course/:id/:tid/:lid/addElement', 
        component: AddEntityComponent, 
        canActivate: [AuthGuard] 
    },


    // otherwise redirect to home
    { path: '**', redirectTo: '' }
];



@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }