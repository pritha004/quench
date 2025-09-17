import CustomButton from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Drawer from "@/components/Drawer";
import Dropdown from "@/components/Dropdown";
import TimePicker from "@/components/TimePicker";
import { profile } from "@/constants";
import { UserPreferences, useAuth } from "@/context/auth-context";
import useFetch from "@/hooks/use-fetch";
import { logout, updateUserDetails } from "@/lib/appwrite";
import { router, useNavigation } from "expo-router";
import { ChevronRight, MinusIcon, PlusIcon } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Switch, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuType = (typeof profile.menus)[number]["id"];

type HealthDetailsFormData = {
  dob: Date | null;
  gender: string | null;
  weight_kg: number | null;
  height_cm: number | null;
  daily_goal_ml: number;
  reminderEnabled: boolean;
  reminderInterval: number;
  wakeTime: string | null;
  sleepTime: string | null;
};

const Profile = () => {
  const { user, setUser, getUser } = useAuth();
  const navigation = useNavigation();
  const [drawerVisible, setDrawerVisible] = useState<{
    id: MenuType | null;
    visible: boolean;
  }>({
    id: null,
    visible: false,
  });

  const logoutHandler = async () => {
    try {
      const result: any = await logout();
      setUser(null);
      await getUser();
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error?.message);
    }
  };

  const { fn: updateUserFn, data: userData } = useFetch(updateUserDetails);

  const [healthDetailsFormData, setHealthDetailsFormData] =
    useState<HealthDetailsFormData>({
      dob: user?.dob ? new Date(user?.dob) : null,
      gender: user?.gender || null,
      weight_kg: user?.weight_kg || null,
      height_cm: user?.height_cm || null,
      daily_goal_ml: user?.daily_goal_ml || 2500,
      reminderEnabled: user?.reminderEnabled || false,
      reminderInterval: user?.reminderInterval || 0,
      wakeTime: user?.wakeTime || null,
      sleepTime: user?.sleepTime || null,
    });

  const onSubmitHealthDetails = async (values: any) => {
    try {
      await updateUserFn(user, {
        ...values,
      });

      setUser((prev: UserPreferences | null): UserPreferences | null => {
        if (!prev) return null;
        return { ...prev, ...userData };
      });
      await getUser();
    } catch (error) {
      console.error("Profile completion error:", error);
    }
  };

  const toggleSwitch = async () => {
    setHealthDetailsFormData((prev) => ({
      ...prev,
      reminderEnabled: !healthDetailsFormData.reminderEnabled,
    }));
    await onSubmitHealthDetails({
      ...healthDetailsFormData,
      reminderEnabled: !healthDetailsFormData.reminderEnabled,
    });
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
        {profile.menus.map((menu) => (
          <CustomButton
            key={menu.id}
            containerStyles="bg-surface items-start w-full"
            textStyles="text-textprimary px-4"
            handlePress={() => {
              setDrawerVisible({
                id: menu.id,
                visible: true,
              });
            }}
            child={
              <View className="flex-row w-full justify-between items-center px-4">
                <Text className={`text-textprimary text-xl font-bold`}>
                  {menu.label}
                </Text>
                <ChevronRight color={"#E0E6E9"} />
              </View>
            }
          />
        ))}
      </View>
      <CustomButton
        title="Logout"
        handlePress={logoutHandler}
        containerStyles="mt-7"
      />
      <Drawer
        visible={drawerVisible.visible}
        onClose={() =>
          setDrawerVisible({
            id: null,
            visible: false,
          })
        }
        drawerContent={
          drawerVisible.id === "health_details" ? (
            <>
              <View>
                <Text className="my-4 text-textprimary text-3xl font-bold text-center">
                  Personalise Quench
                </Text>
                <Text className="my-2 text-textsecondary text-lg text-center">
                  This information ensures Quench data are as accurate as
                  possible.
                </Text>
                <View className="my-4">
                  <DatePicker
                    title="Date of Birth"
                    value={healthDetailsFormData.dob}
                    onChange={(date) =>
                      setHealthDetailsFormData((prev) => ({
                        ...prev,
                        dob: date,
                      }))
                    }
                  />
                  <Dropdown
                    value={healthDetailsFormData.gender}
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                    title="Gender"
                    onChange={(value) =>
                      setHealthDetailsFormData((prev) => ({
                        ...prev,
                        gender: value,
                      }))
                    }
                  />
                  <Dropdown
                    value={healthDetailsFormData.weight_kg}
                    options={Array.from({ length: 300 }, (_, i) => ({
                      label: `${i.toString()} kg`,
                      value: i,
                    }))}
                    title="Weight"
                    onChange={(value) =>
                      setHealthDetailsFormData((prev) => ({
                        ...prev,
                        weight_kg: value,
                      }))
                    }
                  />
                  <Dropdown
                    value={healthDetailsFormData.height_cm}
                    options={Array.from({ length: 300 }, (_, i) => {
                      const num = i + 30;
                      return {
                        label: `${num.toString()} cm`,
                        value: num,
                      };
                    })}
                    title="Height"
                    onChange={(value) =>
                      setHealthDetailsFormData((prev) => ({
                        ...prev,
                        height_cm: value,
                      }))
                    }
                  />
                </View>
              </View>
              <View>
                <CustomButton
                  handlePress={() => {
                    onSubmitHealthDetails(healthDetailsFormData);
                    setDrawerVisible({
                      id: null,
                      visible: false,
                    });
                    setTimeout(() => {
                      navigation.navigate("profile" as never);
                    }, 300);
                  }}
                  title="Done"
                />
              </View>
            </>
          ) : drawerVisible.id === "hydration_goal" ? (
            <>
              <View>
                <Text className="my-4 text-textprimary text-3xl font-bold text-center">
                  Daily Hydration Goal
                </Text>
                <Text className="my-2 text-textsecondary text-lg text-center">
                  Set a daily hydration target that works for you.
                </Text>
                <View className="my-32">
                  <View className=" flex-row justify-center items-center gap-8">
                    <CustomButton
                      child={
                        <View className="bg-accent rounded-full p-4">
                          <MinusIcon color={"black"} size={32} />
                        </View>
                      }
                      handlePress={() =>
                        setHealthDetailsFormData((prev) => ({
                          ...prev,
                          daily_goal_ml:
                            healthDetailsFormData.daily_goal_ml - 100,
                        }))
                      }
                      containerStyles=""
                    />
                    <Text className="text-textprimary font-bold text-5xl">
                      {healthDetailsFormData.daily_goal_ml}
                    </Text>
                    <CustomButton
                      child={
                        <View className="bg-accent rounded-full p-4">
                          <PlusIcon color={"black"} size={32} />
                        </View>
                      }
                      handlePress={() =>
                        setHealthDetailsFormData((prev) => ({
                          ...prev,
                          daily_goal_ml:
                            healthDetailsFormData.daily_goal_ml + 100,
                        }))
                      }
                      containerStyles=""
                    />
                  </View>
                  <View className="flex-row justify-center my-4">
                    <Text className="text-textprimary uppercase font-bold text-2xl">
                      millilitres/day
                    </Text>
                  </View>
                </View>
              </View>
              <View>
                <CustomButton
                  handlePress={() => {
                    onSubmitHealthDetails(healthDetailsFormData);
                    setDrawerVisible({
                      id: null,
                      visible: false,
                    });
                    setTimeout(() => {
                      navigation.navigate("profile" as never);
                    }, 300);
                  }}
                  title="Change Hydration Goal"
                />
              </View>
            </>
          ) : drawerVisible.id === "reminders" ? (
            <View className="h-full flex-col justify-between">
              <View>
                <Text className="my-4 text-textprimary text-3xl font-bold text-center">
                  Reminders
                </Text>
                <Text className="my-2 text-textsecondary text-lg text-center">
                  Stay on Track with Gentle Nudges
                </Text>
                <View className="my-4">
                  <View className="bg-surface w-full rounded-xl min-h-[62px] justify-center items-center mb-4">
                    <View className="flex-row w-full justify-between items-center px-4">
                      <Text className={`text-textprimary text-xl font-bold`}>
                        Reminder
                      </Text>
                      <Switch
                        onValueChange={() => {
                          toggleSwitch();
                        }}
                        value={healthDetailsFormData?.reminderEnabled}
                        trackColor={{ false: "", true: "#82D4C9" }}
                      />
                    </View>
                  </View>
                  {healthDetailsFormData?.reminderEnabled && (
                    <>
                      <TimePicker
                        title="Wake Up"
                        value={healthDetailsFormData.wakeTime}
                        onChange={(time) =>
                          setHealthDetailsFormData((prev) => ({
                            ...prev,
                            wakeTime: time,
                          }))
                        }
                      />
                      <TimePicker
                        title="Sleep"
                        value={healthDetailsFormData.sleepTime}
                        onChange={(time) =>
                          setHealthDetailsFormData((prev) => ({
                            ...prev,
                            sleepTime: time,
                          }))
                        }
                      />
                      <Dropdown
                        value={healthDetailsFormData.reminderInterval}
                        options={profile.intervals}
                        title="Set Interval"
                        onChange={(value) =>
                          setHealthDetailsFormData((prev) => ({
                            ...prev,
                            reminderInterval: value,
                          }))
                        }
                      />
                      <View>
                        <CustomButton
                          handlePress={() => {
                            onSubmitHealthDetails(healthDetailsFormData);
                            setDrawerVisible({
                              id: null,
                              visible: false,
                            });
                            setTimeout(() => {
                              navigation.navigate("profile" as never);
                            }, 300);
                          }}
                          title="Done"
                        />
                      </View>
                    </>
                  )}
                </View>
              </View>
            </View>
          ) : (
            <></>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
