import { Status } from "../enum/status.enum";

export interface Server {
    id: number;
    ipAdress: string;
    name: string;
    memory: string;
    type: string;
    imgUrl: string;
    status: Status;
}