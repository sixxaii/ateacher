export class Shared {
    public constructor(init?:Partial<object>) {
        Object.assign(this, init);
    }
}