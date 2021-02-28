export class AppError{
    mensage: string;
    statusCode: number;

    constructor(mensage: string, statusCode = 400){
        this.mensage = mensage;
        this.statusCode = statusCode;
    }
}