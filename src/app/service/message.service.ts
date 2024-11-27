import {Injectable} from '@angular/core';
import {ToastController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  constructor(private toastController: ToastController) {
  }

  async showMessage(message: string, color: string, duration: number = 3000,) {
    const toast = await this.toastController.create({
      message,
      duration,
      position: 'bottom',
      color,
    });
    await toast.present();
  }
}
