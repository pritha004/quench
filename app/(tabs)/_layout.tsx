import { Tabs } from "expo-router";
import { ChartNoAxesCombined, CircleUser, House } from "lucide-react-native";
import { View } from "react-native";

const TabIcon = ({ focused, icon, title, color }: any) => {
  const Icon = icon;
  return (
    <>
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
          backgroundColor: "#2b2b2b",
          borderRadius: 50,
          marginHorizontal: 20,
          marginBottom: 36,
          height: 52,
          position: "absolute",
          overflow: "hidden",
          borderWidth: 1,
          borderColor: "#021024",
        },
        tabBarActiveTintColor: "#82D4C9",
        tabBarInactiveTintColor: "#ffffff",
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
