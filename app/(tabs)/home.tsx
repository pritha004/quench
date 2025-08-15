import ActivityRings from "@/components/ActivityRing";
import CustomButton from "@/components/Button";
import FormField from "@/components/FormField";
import Popup from "@/components/Popup";
import { home } from "@/constants";
import { useAuth } from "@/context/auth-context";
import useFetch from "@/hooks/use-fetch";
import { getUserHydration, logHydration } from "@/lib/appwrite";
import { Plus } from "lucide-react-native";
import { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const { user } = useAuth();

  const [totalIntake, setTotalIntake] = useState(0);
  const [openCustomAdd, setOpenCustomAdd] = useState(false);
  const [customAddValue, setCustomAddValue] = useState<string | null>();

  const { fn: getUserHydrationFn, data: userHydrationLogs } =
    useFetch(getUserHydration);

  const { fn: logHydrationFn } = useFetch(logHydration);

  useEffect(() => {
    if (user?.userId) {
      getUserHydrationFn(user.userId);
      setTotalIntake(
        userHydrationLogs?.reduce((sum, obj) => sum + obj.amt_intake_ml, 0) || 0
      );
    }
  }, [user]);

  useEffect(() => {
    setTotalIntake(
      userHydrationLogs?.reduce((sum, obj) => sum + obj.amt_intake_ml, 0) || 0
    );
  }, [getUserHydrationFn]);

  const onSubmitAddHydration = async (values: any) => {
    try {
      await logHydrationFn(values);
      if (user?.userId) {
        await getUserHydrationFn(user.userId);
      }
    } catch (error) {
      console.error("Adding hydration log error:", error);
    }
  };

  return (
    <SafeAreaView className="bg-bg flex-1 p-4">
      <View className="flex-row items-center gap-4 py-4">
        <View className="h-20 w-20 bg-slate-50 rounded-full items-center justify-center">
          <Text className="text-black text-3xl">
            {user?.name
              .split(" ")
              .map((w) => w.charAt(0))
              .join("")}
          </Text>
        </View>
        <View>
          <Text className="text-xl text-textprimary font-inter">Hello</Text>
          <Text className="text-4xl text-textprimary font-extrabold font-raleway">
            {user?.name}
          </Text>
        </View>
      </View>
      <ScrollView showsVerticalScrollIndicator={false} className="my-2">
        <View className="flex-col bg-surface rounded-lg my-2">
          <Text className="p-4 border-b-[1px] border-gray-600 text-xl font-bold text-textprimary">
            Activity Ring
          </Text>
          <View className="flex-row gap-8 items-center p-4">
            <View className="py-2">
              <ActivityRings
                percentage={
                  user?.daily_goal_ml
                    ? (totalIntake / user?.daily_goal_ml) * 100
                    : 0
                }
              />
            </View>
            <View>
              <Text className="text-lg font-semibold font-inter text-textprimary">
                Hydration
              </Text>
              <Text className="text-2xl font-raleway font-bold text-accent">
                {totalIntake}/{user?.daily_goal_ml} ml
              </Text>
            </View>
          </View>
        </View>
        {user?.daily_goal_ml && totalIntake < user?.daily_goal_ml && (
          <View className="flex-col bg-surface rounded-lg my-2">
            <Text className="p-4 border-b-[1px] border-gray-600 text-xl font-bold text-textprimary">
              Another Gulp?
            </Text>
            <View className="flex-row flex-wrap gap-8 justify-start items-center p-4">
              {home.waterConsumedAmt.map(
                (op: { label: string; value: number }) => (
                  <CustomButton
                    key={op.value}
                    title={op.label}
                    containerStyles="min-h-[40px] bg-transparent border-accent border-2 rounded-full w-1/4"
                    textStyles="text-textprimary"
                    handlePress={() => {
                      onSubmitAddHydration({
                        userId: user?.userId,
                        amtIntake: op.value,
                        loggedAt: new Date(),
                      });
                    }}
                  />
                )
              )}
              <CustomButton
                handlePress={() => setOpenCustomAdd(true)}
                child={
                  <View className="bg-accent rounded-full p-3">
                    <Plus color={"black"} />
                  </View>
                }
              />
            </View>
          </View>
        )}
        {userHydrationLogs && userHydrationLogs.length > 0 && (
          <View className="flex-col bg-surface rounded-lg mt-2 mb-12">
            <Text className="p-4 border-b-[1px] border-gray-600 text-xl font-bold text-textprimary">
              Today’s Sips
            </Text>
            <View className="flex-row gap-8 items-center p-4">
              <View className="py-2">
                {userHydrationLogs?.map((rec) => (
                  <View
                    key={rec.logged_at}
                    className="w-full flex-row justify-between items-center p-2"
                  >
                    <Text className="text-xl  font-bold text-textprimary">
                      {rec.amt_intake_ml} ml
                    </Text>
                    <Text className="text-lg  font-bold text-textprimary">
                      {new Date(rec.logged_at).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}
      </ScrollView>
      {openCustomAdd && (
        <Popup
          open={openCustomAdd}
          setOpen={setOpenCustomAdd}
          child={
            <>
              <View className="flex-1 bg-black/80 justify-center items-center">
                <View className="bg-surface rounded-lg p-6 w-80 shadow-lg">
                  <Text className="text-textprimary text-xl font-bold">
                    Add Hydration Intake
                  </Text>
                  <FormField
                    title=""
                    value={customAddValue}
                    handleChangeText={(e: any) => setCustomAddValue(e)}
                    otherStyles="mb-4"
                  />
                  <View className="flex-row gap-2">
                    <CustomButton
                      handlePress={() => {
                        setOpenCustomAdd(false);
                      }}
                      title="Cancel"
                      containerStyles="w-1/2 bg-transparent border-2 border-accent"
                      textStyles="text-accent"
                    />
                    <CustomButton
                      handlePress={() => {
                        onSubmitAddHydration({
                          userId: user?.userId,
                          amtIntake: Number(customAddValue),
                          loggedAt: new Date(),
                        });
                        setCustomAddValue(null);
                        setOpenCustomAdd(false);
                      }}
                      title="Add"
                      containerStyles="w-1/2"
                    />
                  </View>
                </View>
              </View>
            </>
          }
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
