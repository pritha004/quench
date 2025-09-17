import { UserPreferences } from "@/context/auth-context";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldPlaySound: true,
    shouldShowList: true,
    shouldSetBadge: true,
  }),
});

const parseTime = (time: string) => {
  const [hour, minute] = time.split(":").map(Number);
  return { hour, minute };
};

async function requestNotificationPermission() {
  const { status } = await Notifications.requestPermissionsAsync();
  return status === "granted";
}

function getHydrationSchedule(user: UserPreferences) {
  const now = new Date();
  const schedule = [];

  const wakeTime = parseTime(user.wakeTime);
  const sleepTime = parseTime(user.sleepTime);

  const startTime = new Date();
  startTime.setHours(wakeTime.hour, wakeTime.minute, 0, 0);

  const endTime = new Date();
  endTime.setHours(sleepTime.hour, sleepTime.minute, 0, 0);

  let currentTime = new Date(startTime);

  while (currentTime <= endTime) {
    if (currentTime > now) {
      schedule.push(new Date(currentTime));
    }
    currentTime = new Date(
      currentTime.getTime() + user.reminderInterval * 60 * 1000
    );
  }

  return schedule;
}

export async function scheduleHydrationReminders(user: UserPreferences) {
  const hasPermission = await requestNotificationPermission();
  if (!hasPermission) return;

  const times = getHydrationSchedule(user);

  for (const time of times) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "💧 Time to hydrate!",
        body: "Drink a glass of water to stay on track.",
        sound: true,
      },
      trigger: { type: "date", date: time },
    });
  }
}

export async function cancelReminderById(id: string) {
  await Notifications.cancelScheduledNotificationAsync(id);
}

export async function cancelAllReminders() {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
