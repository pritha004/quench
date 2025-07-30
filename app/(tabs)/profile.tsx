import CustomButton from "@/components/Button";
import { useAuth } from "@/context/auth-context";
import { logout } from "@/lib/appwrite";
import { router } from "expo-router";
import { Alert, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { setUser } = useAuth();

  const submit = async () => {
    try {
      const result: any = await logout();
      setUser(null);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error?.message);
    }
  };

  return (
    <SafeAreaView className="bg-bg flex-1">
      <Text className="text-lg font-bold text-white">Profile</Text>
      <CustomButton
        title="Logout"
        handlePress={submit}
        containerStyles="mt-7"
      />
    </SafeAreaView>
  );
};

export default Profile;
