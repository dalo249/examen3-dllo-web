export class StandardResponseDto<T>{
    statusCode: number;
    message: string;
    data?: T 

    constructor (data: T, message = 'ok', statusCode = 200 ){
        this.data = data;
        this.message = message;
        this.statusCode = statusCode;
    }
}