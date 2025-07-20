import PushNotification from 'react-native-push-notification';
import { Platform } from 'react-native';

class PushNotificationService {
  constructor() {
    this.configure();
  }

  configure = () => {
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
      },
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },
      popInitialNotification: true,
      requestPermissions: Platform.OS === 'ios',
    });
  };

  createChannel = (channelId: string, channelName: string) => {
    PushNotification.createChannel(
      {
        channelId: channelId,
        channelName: channelName,
        channelDescription: 'A channel to categorise your notifications',
        soundName: 'default',
        importance: 4,
        vibrate: true,
      },
      (created) => console.log(`createChannel returned '${created}'`)
    );
  };

  localNotification = (title: string, message: string) => {
    PushNotification.localNotification({
      channelId: 'default-channel-id',
      title: title,
      message: message,
      playSound: true,
      soundName: 'default',
    });
  };

  localNotificationSchedule = (title: string, message: string, date: Date) => {
    PushNotification.localNotificationSchedule({
      channelId: 'default-channel-id',
      title: title,
      message: message,
      date: date,
      allowWhileIdle: false,
    });
  };
}

export const pushNotificationService = new PushNotificationService();
