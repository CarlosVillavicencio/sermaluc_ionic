import { Component, Input, OnInit } from '@angular/core';
import { DataService, Task } from '../services/data.service';
import { ModalController, ToastController } from '@ionic/angular';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.page.html',
  styleUrls: ['./modal.page.scss'],
})
export class ModalPage implements OnInit {
  @Input() id: string = '';
  task: Task = { id: '', title: '', text: '' };
  
  constructor(
    private dataService: DataService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) { }

  ngOnInit() {
    this.dataService.getTaskById(this.id).subscribe(res => {
      this.task = res
    });
  }

  async updateTask() {
    this.dataService.updateTask(this.task);
    const toast = await this.toastCtrl.create({
      message: 'Tarea Actualizada!',
      duration: 1000
    });
    await toast.present();
  }
  async deleteTask() {
    await this.dataService.deleteTask(this.task);
    this.modalCtrl.dismiss();
  }

}
