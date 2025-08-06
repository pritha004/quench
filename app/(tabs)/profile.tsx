import CustomButton from "@/components/Button";
import DatePicker from "@/components/DatePicker";
import Drawer from "@/components/Drawer";
import Dropdown from "@/components/Dropdown";
import { profile } from "@/constants";
import { useAuth } from "@/context/auth-context";
import { logout } from "@/lib/appwrite";
import { router, useNavigation } from "expo-router";
import { ChevronRight } from "lucide-react-native";
import React, { useState } from "react";
import { Alert, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type MenuType = (typeof profile.menus)[number]["id"];

const Profile = () => {
  const { user, setUser } = useAuth();
  const navigation = useNavigation();
  const [drawerVisible, setDrawerVisible] = useState<{
    id: MenuType | null;
    visible: boolean;
  }>({
    id: null,
    visible: false,
  });

  const submit = async () => {
    try {
      const result: any = await logout();
      setUser(null);
      router.replace("/");
    } catch (error: any) {
      Alert.alert("Error", error?.message);
    }
  };

  const [dob, setDob] = useState<Date>(new Date(2000, 0, 1));

  const [gender, setGender] = useState<string>("");

  const [weight, setWeight] = useState<number>(0);

  const [height, setHeight] = useState<number>(100);

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
        handlePress={submit}
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
                    value={dob}
                    onChange={setDob}
                  />
                  <Dropdown
                    value={gender}
                    onChange={setGender}
                    options={[
                      { label: "Male", value: "male" },
                      { label: "Female", value: "female" },
                      { label: "Other", value: "other" },
                    ]}
                    title="Gender"
                  />
                  <Dropdown
                    value={weight}
                    onChange={setWeight}
                    options={Array.from({ length: 300 }, (_, i) => ({
                      label: `${i.toString()} kg`,
                      value: i,
                    }))}
                    title="Weight"
                  />
                  <Dropdown
                    value={height}
                    onChange={setHeight}
                    options={Array.from({ length: 300 }, (_, i) => {
                      const num = i + 30;
                      return {
                        label: `${num.toString()} cm`,
                        value: num,
                      };
                    })}
                    title="Height"
                  />
                </View>
              </View>
              <View>
                <CustomButton
                  handlePress={() => {
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
          ) : (
            <></>
          )
        }
      />
    </SafeAreaView>
  );
};

export default Profile;
