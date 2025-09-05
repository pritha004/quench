import AnalyticsCharts from "@/components/AnalyticsCharts";
import Card from "@/components/Card";
import DailyAnalyticsChart from "@/components/DailyAnalyticsChart";
import { useAuth } from "@/context/auth-context";
import useFetch from "@/hooks/use-fetch";
import { getUserHydrationAll } from "@/lib/appwrite";
import { Flame } from "lucide-react-native";
import { useEffect } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function calculateCardStats(
  logs: { intake: number; logged_at: string }[],
  goal: number,
  type: "daily_average" | "goal_completion_percentage" | "streak"
): number {
  const dailyTotals: Record<any, number> = {};

  logs.forEach((log) => {
    const date = new Date(log.logged_at).toISOString().split("T")[0];

    if (!dailyTotals[date]) {
      dailyTotals[date] = 0;
    }

    dailyTotals[date] += log.intake;
  });

  const totalDays = Object.keys(dailyTotals).length;
  const totalIntake = Object.values(dailyTotals).reduce(
    (sum, val) => sum + val,
    0
  );

  const averageIntake = totalDays ? totalIntake / totalDays : 0;
  const daysGoalMet = Object.values(dailyTotals).filter(
    (intake) => intake >= goal
  ).length;

  const goalCompletionRate = totalDays ? (daysGoalMet / totalDays) * 100 : 0;

  const today = new Date();
  let streak = 0;

  for (let i = 0; ; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = date.toISOString().split("T")[0];

    const intake = dailyTotals[dateStr] || 0;

    if (intake >= goal) {
      streak++;
    } else {
      break;
    }
  }

  if (type === "daily_average") {
    return averageIntake;
  } else if (type === "goal_completion_percentage") {
    return goalCompletionRate;
  } else if (type === "streak") {
    return streak;
  } else {
    return 0;
  }
}

const Analytics = () => {
  const { user } = useAuth();

  const { fn: getUserHydrationFn, data: userHydrationLogs } =
    useFetch(getUserHydrationAll);

  useEffect(() => {
    if (user?.userId) {
      getUserHydrationFn(user.userId);
    }
  }, [user?.total_intake_ml]);

  return (
    <SafeAreaView className="bg-bg flex-1 ">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="flex-row justify-around mx-2 mt-8">
          <Card
            classes="w-[120] h-[120] m-2 p-2"
            title="Avg Daily Intake"
            value={`${(
              calculateCardStats(
                userHydrationLogs?.map((log) => ({
                  intake: log.amt_intake_ml,
                  logged_at: log.logged_at,
                })) || [],
                user?.daily_goal_ml || 2000,
                "daily_average"
              ) / 1000
            ).toFixed(1)}L`}
          />

          <Card
            classes="w-[120] h-[120] m-2 p-2"
            title={
              <>
                <Text>Current Streak</Text>
                <Flame fill={"#000"} />
              </>
            }
            value={`${calculateCardStats(
              userHydrationLogs?.map((log) => ({
                intake: log.amt_intake_ml,
                logged_at: log.logged_at,
              })) || [],
              user?.daily_goal_ml || 2000,
              "streak"
            )}`}
          />
          <Card
            classes="w-[120] h-[120] m-2 p-2"
            title="Goal Completion"
            value={`${calculateCardStats(
              userHydrationLogs?.map((log) => ({
                intake: log.amt_intake_ml,
                logged_at: log.logged_at,
              })) || [],
              user?.daily_goal_ml || 2000,
              "goal_completion_percentage"
            ).toFixed(0)}%`}
          />
        </View>
        <View className="mx-2">
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
        <View className="mx-2 mt-4 mb-14">
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
