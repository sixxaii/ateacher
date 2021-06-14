import { Task } from "./task";
import { Article } from "./article";

export class Lesson {
    id: number;
    name: string;
    lessonArticles: Article[];
    lessonTasks: Task[];

    public constructor(init?:Partial<Lesson>) {
        Object.assign(this, init);
    }
}