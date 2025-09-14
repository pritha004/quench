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

// Parse "HH:mm" → { hour, minute }
const parseTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
};

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

export async function scheduleDailyIntervalReminderNotifications(
  user: UserPreferences
) {
  if (!user.reminderEnabled) return;

  const wake = parseTime(user.wakeTime);
  const sleepTime = parseTime(user.sleepTime);

  let currentHour = wake.hour;
  let currentMinute = wake.minute;

  const ids: string[] = [];

  try {
    while (
      currentHour < sleepTime.hour ||
      (currentHour === sleepTime.hour && currentMinute <= sleepTime.minute)
    ) {
      const id = await Notifications.scheduleNotificationAsync({
        content: {
          title: "💧 Time to Hydrate!",
          body: "Take a sip of water 🥤",
          sound: true,
        },
        trigger: {
          hour: currentHour,
          minute: currentMinute,
          repeats: true,
        } as Notifications.CalendarTriggerInput,
      });

      ids.push(id);

      currentMinute += user.reminderInterval;
      while (currentMinute >= 60) {
        currentMinute -= 60;
        currentHour += 1;
      }
    }
    return ids;
  } catch (error) {
    console.log("Error scheduling reminder:", error);
    return undefined;
  }
}

export async function cancelReminderById(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
