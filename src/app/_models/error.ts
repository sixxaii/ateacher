import { errorMessage } from "@/_helpers";

export class Error {
    code: number;
    message: string;

    public constructor(init?:Partial<Error>) {
        Object.assign(this, init);
        this.message = errorMessage[this.code] ? errorMessage[this.code] : this.message;
        console.log('mes', this.message);
    }
}