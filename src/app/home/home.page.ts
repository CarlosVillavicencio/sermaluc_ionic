import { Component } from '@angular/core';
import { DataService, Task } from '../services/data.service';
import { AlertController, ModalController } from '@ionic/angular';
import { ModalPage } from '../modal/modal.page';
import { NotificationsService } from '../services/notifications.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: Task[] = [];

  constructor(
    private dataService: DataService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private notificationsService: NotificationsService
  ) {
    this.dataService.getTasks().subscribe(res => {
      console.log(res);
      this.tasks = res
    });
    this.notificationsService.initialize();
  }

  async openTask(task: Task) {
    const modal = await this.modalCtrl.create({
      component: ModalPage,
      componentProps: { id: task.id },
      breakpoints: [0, 0.5, 0.8],
      initialBreakpoint: 0.5
    });
    await modal.present();
  }

  async addTask() {
    const alert = await this.alertCtrl.create({
      header: 'Agregar Tarea',
      inputs: [
        {
          name: 'title',
          placeholder: 'Mi tarea',
          type: 'text'
        },
        {
          name: 'text',
          placeholder: 'Descripción de mi tarea',
          type: 'textarea'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'Cancel'
        },
        {
          text: 'Add',
          handler: (res) => {
            this.dataService.addTask({title: res.title, text: res.text});
          }
        }
      ]
    });
    await alert.present();
  }
}
