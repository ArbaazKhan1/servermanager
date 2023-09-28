import { Status } from "../enum/status.enum";
import { Server } from "./server";

export interface CustomResponse {
    timeStamp: Date;
    statusCode: number;
    status: Status;
    reason: string;
    message: string;
    devMessage: string;
    data: {
        //The ? means it is optional and that we might not have that value
        servers?: Server[],
        server?: Server 
    };
}