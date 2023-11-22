import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LocalNotifications, ActionPerformed as LocalActionPerformed } from '@capacitor/local-notifications';
import { Task } from '../services/data.service';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';
import { Platform } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(
    public platform: Platform,
    private router: Router,
  ) { }

  initialize() {
    if (this.platform.is("capacitor")) {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          console.log("permisos concedidos")
          PushNotifications.register();
          this.addListeners();
        } else {
          // Show some error
        }
      });
    } else {
      console.log("no estamos en movil")
    }
  }

  addListeners() {
    // On success, we should be able to receive notifications
    PushNotifications.addListener('registration',
      (token: Token) => {
        console.log('Push registration success, token: ' + token.value);
        console.log('guardar el token');
      }
    );

    // Some issue with our setup and push will not work
    PushNotifications.addListener('registrationError',
      (error: any) => {
        console.log('Error on registration: ' + JSON.stringify(error));
      }
    );

    // Show us the notification payload if the app is open on our device
    PushNotifications.addListener('pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
        LocalNotifications.schedule({
          notifications: [
            {
              title: notification.title ? notification.title : "",
              body:  notification.body ? notification.body : "",
              id: 1,
              extra: {
                data: notification.data
              }
            }
          ]
        });
      }
    );

    // Method called when tapping on a notification
    PushNotifications.addListener('pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed en segundo plano: ' + JSON.stringify(notification));
        this.router.navigate(['/home']);
      }
    );

    LocalNotifications.addListener('localNotificationActionPerformed', (notification: LocalActionPerformed) => {
      console.log('Push action performed en primer plano: ' + JSON.stringify(notification));
      this.router.navigate(['/home']);
    });
  }

  async cancelAllLocalNotifications() {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      LocalNotifications.cancel({ notifications: pending.notifications });
    }
  }

  async scheduleNewNotifications(tasks: Task[]) {
    const pending = await LocalNotifications.getPending();
    if (pending.notifications.length > 0) {
      LocalNotifications.cancel({ notifications: pending.notifications }).then(()=> {
        this.scheduleNewNotificationsCreate(tasks);
      });
    } else {
      this.scheduleNewNotificationsCreate(tasks);
    }
  }

  async scheduleNewNotificationsCreate(tasks: Task[]) {
    var idToTask = 0;

      tasks.forEach(tarea => {
        
        idToTask++;

        const notificationTime = new Date(tarea.fechaYHora);

        LocalNotifications.schedule({
          notifications: [
            {
              title: tarea.title,
              body: tarea.text,
              id: idToTask, // un identificador único para la notificación
              schedule: { at: notificationTime } // especifica la fecha y hora
            }
          ]
        });
  
        console.log(`tarea creada id: ${idToTask} hora ${tarea.fechaYHora.toString()}`);
      });
  }

}
