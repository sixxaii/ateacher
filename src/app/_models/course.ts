import { Theme } from "./theme";

export class Course {
    id: number;
    name: string;
    courseThemes: Theme[];
    description: string;
    owner: string;

    public constructor(init?:Partial<Course>) {
        Object.assign(this, init);
    }
}