import { Tabs } from "expo-router";
import { ChartNoAxesCombined, CircleUser, House } from "lucide-react-native";
import { View } from "react-native";

const TabIcon = ({ focused, icon, title, color }: any) => {
  const Icon = icon;
  return (
    <>
      {/* {focused ? (
        <View className="flex w-full flex-1 min-w-[112px] min-h-16 mt-4 justify-center items-center rounded-full overflow-hidden">
          <Icon color={color} />
          <Text className="text-white text-base font-semibold ml-2">
            {title}
          </Text>
        </View>
      ) : (
        <View className="size-full justify-center items-center mt-4 rounded-full">
          <Icon color={color} />
        </View>
      )} */}

      <View className="size-full justify-center items-center mt-4 rounded-full">
        <Icon color={color} />
      </View>
    </>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarItemStyle: {
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        },
        tabBarStyle: {
          backgroundColor: "#021024",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#021024",
        },
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "#5483B3",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <>
              <TabIcon
                focused={focused}
                icon={House}
                title="Home"
                color={color}
              />
            </>
          ),
        }}
      />

      <Tabs.Screen
        name="analytics"
        options={{
          title: "Analytics",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <>
              <TabIcon
                focused={focused}
                icon={ChartNoAxesCombined}
                title="Analytics"
                color={color}
              />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ focused, color }) => (
            <>
              <TabIcon
                focused={focused}
                icon={CircleUser}
                title="Profile"
                color={color}
              />
            </>
          ),
        }}
      />
    </Tabs>
  );
}
