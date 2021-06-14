import { Lesson } from "./lesson";

export class Theme {
    id: number;
    name: string;
    themeLessons: Lesson[];

    public constructor(init?:Partial<Theme>) {
        Object.assign(this, init);
    }
}