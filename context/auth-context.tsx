import { createContext, useContext, useEffect, useState } from "react";
import { Models } from "react-native-appwrite";
import { getCurrentUser } from "../lib/appwrite";

export type UserPreferences = Models.User<Models.Preferences> & {
  dob: Date | null;
  gender: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  daily_goal_ml: number | null;
  total_intake_ml: number;
  userId: string;
  reminderEnabled: boolean;
  reminderInterval: number;
  wakeTime: string;
  sleepTime: string;
};

type AuthContextType = {
  user: UserPreferences | null;
  isLoadingUser: boolean;
  setUser: (
    user:
      | UserPreferences
      | null
      | ((prev: UserPreferences | null) => UserPreferences | null)
  ) => void;
  getUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserPreferences | null>(null);

  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true);

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    setIsLoadingUser(true);
    try {
      const session: any = await getCurrentUser();
      setUser(session);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoadingUser(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, isLoadingUser, getUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be inside of the AuthProvider.");
  }

  return context;
}
