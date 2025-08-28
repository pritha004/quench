import AnalyticsCharts from "@/components/AnalyticsCharts";
import DailyAnalyticsChart from "@/components/DailyAnalyticsChart";
import { useAuth } from "@/context/auth-context";
import useFetch from "@/hooks/use-fetch";
import { getUserHydrationAll } from "@/lib/appwrite";
import { useEffect } from "react";
import { ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Analytics = () => {
  const { user } = useAuth();

  const { fn: getUserHydrationFn, data: userHydrationLogs } =
    useFetch(getUserHydrationAll);

  useEffect(() => {
    if (user?.userId) {
      getUserHydrationFn(user.userId);
    }
  }, [user?.userId]);

  return (
    <SafeAreaView className="bg-bg flex-1 ">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="m-2">
          <DailyAnalyticsChart
            data={
              userHydrationLogs?.map((log) => ({
                intake: log.amt_intake_ml,
                logged_at: log.logged_at,
              })) || []
            }
            maxVal={1}
          />
        </View>
        <View className="mx-2 my-8">
          <AnalyticsCharts
            data={
              userHydrationLogs?.map((log) => ({
                intake: log.amt_intake_ml,
                logged_at: log.logged_at,
              })) || []
            }
            dailyGoal={(user?.daily_goal_ml || 0) / 1000}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Analytics;
