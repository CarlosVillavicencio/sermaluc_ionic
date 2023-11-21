import { Component } from '@angular/core';
import { DataService, Task } from '../services/data.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  tasks: Task[] = [];

  constructor(
    private dataService: DataService,
    private alertCtrl: AlertController
  ) {
    this.dataService.getTasks().subscribe(res => {
      console.log(res);
      this.tasks = res
    });
  }

  openTask(task: Task) {
    //
  }

  async addTask() {
    const alert = await this.alertCtrl.create({
      header: 'Agregar Tarea'
    })
  }
}
