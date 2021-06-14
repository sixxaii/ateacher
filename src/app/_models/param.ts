export class Param {
    name: string;
    description: string;
    type: string;
    required: boolean;

    public constructor(init?:Partial<Param>) {
        Object.assign(this, init);
    }
}