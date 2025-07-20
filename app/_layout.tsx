import { Stack } from "expo-router";
import { useEffect } from "react";
import { pushNotificationService } from "../services/PushNotification";

export default function RootLayout() {
  useEffect(() => {
    pushNotificationService.createChannel('default-channel-id', 'Default Channel');
  }, []);

  return <Stack />;
}
