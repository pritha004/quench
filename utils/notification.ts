import { UserPreferences } from "@/context/auth-context";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldShowList: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  let token: string | null = null;

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    return null;
  }

  try {
    const response = await Notifications.getExpoPushTokenAsync();
    token = response.data;

    if ((Platform.OS = "android")) {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
      });
    }

    return token;
  } catch (error) {
    console.log("Error getting push token", error);
  }
}

export async function scheduleReminderNotifications(user: UserPreferences) {
  if (!user.reminderEnabled) return;

  try {
    for (const time of user.reminders) {
      const [hours, minutes] = time.split(":").map(Number);
      const today = new Date();
      today.setHours(hours, minutes, 0, 0);

      if (today < new Date()) {
        today.setDate(today.getDate() + 1);
      }

      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "",
          body: "",
          sound: "default",
          priority: Notifications.AndroidNotificationPriority.HIGH,
        },
        trigger: {
          hour: hours,
          minute: minutes,
          repeats: true,
        } as Notifications.CalendarTriggerInput,
      });

      return id;
    }
  } catch (error) {
    console.log("Error scheduling reminder:", error);
    return undefined;
  }
}

export async function cancelReminder(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
