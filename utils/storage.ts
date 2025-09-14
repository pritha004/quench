import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "WATER_REMINDERS";

export type Reminder = {
  enabled: boolean;
  ids: string[];
};

export const saveReminders = async (reminders: Reminder | null) => {
  try {
    if (reminders) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  } catch (err) {
    console.error("Error saving reminders", err);
  }
};

export const loadReminders = async (): Promise<Reminder | null> => {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (err) {
    console.error("Error loading reminders", err);
    return null;
  }
};
