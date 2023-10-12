import { Injectable } from '@angular/core';
import { NotifierService } from 'angular-notifier';

@Injectable({ providedIn: 'root' })
export class NotifactionService {
    private readonly notifier: NotifierService;

    constructor(notifierService: NotifierService) {
      this.notifier = notifierService;
    }

    onDefault(mes: string): void {
        this.notifier.notify(Type.DEFAULT, mes);
    }

    onSuccess(mes: string): void {
        this.notifier.notify(Type.SUCCESS, mes);
    }

    onInfo(mes: string): void {
        this.notifier.notify(Type.INFO, mes);
    }

    onWarning(mes: string): void {
        this.notifier.notify(Type.WARNING, mes);
    }

    onError(mes: string): void {
        this.notifier.notify(Type.ERROR, mes);
    }
}

enum Type {
    DEFAULT = 'default', 
    INFO = 'info', 
    SUCCESS = 'success', 
    WARNING = 'warning', 
    ERROR = 'error'
}