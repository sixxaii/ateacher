import { Component, OnInit } from '@angular/core';
import { Course, User, Theme, Lesson, Article, Task, Link, TaskListItem } from '@/_models';
import { AuthenticationService, TaskService } from '@/_services';
import { CourseService } from '@/_services/course.service';
import { ActivatedRoute } from '@angular/router';
import { IDs }  from '@/_helpers';
import { WebSocketService } from '@/_services/websocket';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormBuilder, Validators } from '@angular/forms';


@Component({ 
    templateUrl: 'course.component.html',
    styleUrls: ['./course.component.less'] 
})
export class CourseComponent implements OnInit {
    private course: Course;
    private courseId: number;
    private tasks: Task[];

    currentUser: User;

    addThemeForm = this.formBuilder.group({
        themeName: ['', Validators.required]
    });

    addLessonForm = this.formBuilder.group({
        lessonName: ['', Validators.required]
    });

    themeIdForLesson: number;

    submitted = false;
    lessonSubmitted = false;

    get addThemeFormControls() { return this.addThemeForm.controls; }
    get addLessonFormControls() { return this.addLessonForm.controls; }

    constructor(private courseService: CourseService,
        private route: ActivatedRoute,
        private taskService: TaskService,
        private authenticationService: AuthenticationService,
        private wsservice: WebSocketService,
        private formBuilder: FormBuilder,
        private modalService: NgbModal) { 
            this.currentUser = this.authenticationService.currentUserValue;
        }

    ngOnInit() {
        this.courseId = this.route.snapshot.params.id;
        console.log(this.courseId);

        this.getRequestedCourse();
        this.getTasks();
    }

    addTheme() {
        this.submitted = true;

        if (this.addThemeForm.invalid) {
            return;
        }
        
        let name = this.addThemeFormControls.themeName.value;

        console.log('theme name', name);
        this.courseService.addTheme(this.courseId, name);
        setTimeout(function() {
            window.location.reload()
        }, 200);
    }

    addLesson() {
        this.lessonSubmitted = true;

        if (this.addLessonForm.invalid) {
            return;
        }
        
        let name = this.addLessonFormControls.lessonName.value;

        this.courseService.addLesson(this.themeIdForLesson, name);
        setTimeout(function() {
            window.location.reload()
        }, 200);
        // window.location.reload();
    }

    addEntity(entity) {
        
    }

    getThemeId(event) {
        this.themeIdForLesson = event.target.getAttribute('data-themeId');
    }
      

    getRequestedCourse() {
        this.courseService.getCourse(this.courseId);

        this.wsservice.on<any>(IDs.courses.get)
            .subscribe((msg) => {
                console.log('course get', msg);
                if (!msg['code']) {
                    let course = msg;
                    this.course = new Course({
                        id: course.id,
                        name: course.name || "Нет названия", 
                        courseThemes: course.themes.map((theme) => {
                            return new Theme({
                                id: theme.id,
                                name: theme.name,
                                themeLessons: theme.blocks.map((block) => {
                                    // return new Lesson({
                                    //     id: block.id,
                                    //     lessonArticles: block.entities.map((entity) => {
                                    //         return new Article({
                                    //             id: entity.id,

                                    //         })
                                    //     })
                                    // })
                                    return this.mapThemeLessons(block)
                                })
                            });
                        }) || []
                    });
                    console.log(this.course);
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    getTasks() {
        this.taskService.getTasks();

        this.wsservice.on<any>(IDs.task.list)
            .subscribe((msg) => {
                if (!msg['code']) {
                    let tasks = msg;
                    this.tasks = tasks.map(task => {
                        return new TaskListItem({
                            id: task.id,
                            name: task.name || "Нет названия"
                        });
                    });
                }
                else {
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    mapThemeLessons(block) {
        let articles = [];
        let tasks = [];

        block.entities.forEach(entity => {
            if (entity.type == 'task') {
                let task = new Task({
                    id: entity.task.id,
                    entityId: entity.id,
                    name: entity.task.name
                });
                tasks.push(task);
            }
            else if (entity.type == 'text') {
                let article = new Article({
                    id: entity.id,
                    name: entity.article.name
                });
                articles.push(article);
            }
            else if (entity.type == 'link') {
                let link = new Link({
                    id: entity.id,
                    url: entity.link
                });
                articles.push(link);
            }
        });

        return new Lesson({
            id: block.id,
            name: block.name,
            lessonArticles: articles,
            lessonTasks: tasks
        });
    }

    countTasks(theme) {
        let count = 0;

        theme.themeLessons.forEach(lesson => {
            count += lesson.lessonTasks.length;
        });

        return count;
    }

    isAdmin() {
        console.log('level', this.currentUser.accessLevel);
        if (this.currentUser.accessLevel < 4) {
            return false;
        }
        return true;
    }

    removeTheme(theme) {
        let ind = this.course.courseThemes.indexOf(theme);
        this.course.courseThemes.splice(ind, 1);

        let id = theme.id;
        this.courseService.removeTheme(this.courseId, id);

        this.wsservice.on<any>(IDs.courses.removeTheme)
            .subscribe((msg) => {
                console.log('remove theme', msg);
                if (!msg['code']) {
                   
                }
                else {
                   
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    removeLesson(theme, lesson) {
        let themeInd = this.course.courseThemes.indexOf(theme);
        let lessonInd = theme.themeLessons.indexOf(lesson);
        this.course.courseThemes[themeInd].themeLessons.splice(lessonInd, 1);

        let tid = theme.id;
        let lid = lesson.id;
        this.courseService.removeLesson(tid, lid);

        this.wsservice.on<any>(IDs.courses.removeLesson)
            .subscribe((msg) => {
                console.log('remove theme', msg);
                if (!msg['code']) {
                   
                }
                else {
                   
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }

    removeEntity(theme, lesson, entity) {
        let themeInd = this.course.courseThemes.indexOf(theme);
        let lessonInd = theme.themeLessons.indexOf(lesson);
        let entityInd = theme.themeLessons[lessonInd].lessonTasks.indexOf(entity);
        this.course.courseThemes[themeInd].themeLessons[lessonInd].lessonTasks.splice(entityInd, 1);

        let tid = theme.id;
        let lid = lesson.id;
        let eid = entity.entityId;
        this.courseService.removeEntity(tid, lid, eid);

        this.wsservice.on<any>(IDs.courses.removeEntity)
            .subscribe((msg) => {
                console.log('remove entity', msg);
                if (!msg['code']) {
                   
                }
                else {
                   
                    //this.errorInterceptor.interceptError(msg['code']);
                }
            });
    }
}
