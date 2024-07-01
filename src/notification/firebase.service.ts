import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import * as firebase from 'firebase-admin';
import * as serviceAccountKey from './serviceAccountKey.json'

@Injectable()
export class FirebaseService  implements OnModuleInit  {
    private static firebaseApp: firebase.app.App;
    onModuleInit() {
        if (!FirebaseService.firebaseApp) {
          FirebaseService.firebaseApp = firebase.initializeApp({
            credential: firebase.credential.cert(serviceAccountKey as firebase.ServiceAccount),
          });
        }
      }
    async sendNotification(
        token: string,
        notification: firebase.messaging.NotificationMessagePayload,
        data?: firebase.messaging.DataMessagePayload,
      ) {
        const message: firebase.messaging.Message = {
          notification,
          data,
          token,
        };
    
        return await firebase.messaging().send(message);
      }

}
