import { Injectable } from '@angular/core';

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
    public platform: Platform
  ) {}

  initialize() {
    if (this.platform.is("capacitor")) {
      PushNotifications.requestPermissions().then(result => {
        if (result.receive === 'granted') {
          // Register with Apple / Google to receive push via APNS/FCM
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
        }
      );
  
      // Method called when tapping on a notification
      PushNotifications.addListener('pushNotificationActionPerformed',
        (notification: ActionPerformed) => {
          console.log('Push action performed en segundo plano: ' + JSON.stringify(notification));
        }
      );
  }

}
