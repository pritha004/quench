import CustomButton from "@/components/Button";
import Drawer from "@/components/Drawer";
import { useAuth } from "@/context/auth-context";
import { logout } from "@/lib/appwrite";
import { router } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Profile = () => {
  const { user, setUser } = useAuth();
  const [drawerVisible, setDrawerVisible] = useState(false);

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
    <SafeAreaView className="bg-bg flex-1 p-4">
      <View className="flex-row  items-center gap-4 py-4">
        <View className="h-20 w-20 bg-slate-50 rounded-full items-center justify-center">
          <Text className="text-black text-3xl">
            {user?.name
              .split(" ")
              .map((w) => w.charAt(0))
              .join("")}
          </Text>
        </View>
        <View>
          <Text className="text-4xl text-textprimary font-extrabold font-raleway">
            {user?.name}
          </Text>
          <Text className="text-lg text-textprimary font-semibold font-raleway lowercase">
            {user?.email}
          </Text>
        </View>
      </View>
      <View className="flex-col gap-4 py-4">
        <CustomButton
          containerStyles="bg-surface items-start w-full"
          textStyles="text-textprimary px-4"
          handlePress={() => {
            setDrawerVisible(true);
          }}
          child={
            <View className="flex-row w-full justify-between items-center px-4">
              <Text className={`text-textprimary text-xl font-bold`}>
                Health Details
              </Text>

              <ChevronRight color={"#E0E6E9"} />
            </View>
          }
        />
        <CustomButton
          containerStyles="bg-surface items-start w-full"
          textStyles="text-textprimary px-4"
          handlePress={() => {}}
          child={
            <View className="flex-row w-full justify-between items-center px-4">
              <Text className={`text-textprimary text-xl font-bold`}>
                Change Hydration Goals
              </Text>

              <ChevronRight color={"#E0E6E9"} />
            </View>
          }
        />
      </View>
      <CustomButton
        title="Logout"
        handlePress={submit}
        containerStyles="mt-7"
      />
      <Drawer visible={drawerVisible} onClose={() => setDrawerVisible(false)} />
    </SafeAreaView>
  );
};

export default Profile;
