import {
  eachDayOfInterval,
  endOfISOWeek,
  endOfMonth,
  format,
  parseISO,
  startOfDay,
  startOfISOWeek,
  startOfMonth,
} from "date-fns";
import React, { useEffect, useState } from "react";
import { Dimensions, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";

const noOfSections = 6;
const screenWidth = Dimensions.get("window").width;

type Props = {
  data: { intake: number; logged_at: string }[];
  dailyGoal: number;
};

const aggregateIntake = (
  data: { intake: number; logged_at: string }[],
  startDate: Date,
  endDate: Date,
  isWeekly = false
) => {
  const datesInRange = eachDayOfInterval({
    start: startOfDay(startDate),
    end: startOfDay(endDate),
  });

  const dailyIntakeMap: Record<string, number> = {};

  datesInRange?.forEach((date) => {
    const key = format(date, "yyyy-MM-dd");
    dailyIntakeMap[key] = 0;
  });

  data?.forEach(({ logged_at, intake }) => {
    const logDate = format(parseISO(logged_at), "yyyy-MM-dd");
    if (dailyIntakeMap.hasOwnProperty(logDate)) {
      dailyIntakeMap[logDate] += intake;
    }
  });

  return Object.entries(dailyIntakeMap).map(([date, intakeMl], index) => {
    const dateObj = parseISO(date);

    return {
      value: +(intakeMl / 1000).toFixed(2),
      label: isWeekly
        ? format(dateObj, "EEE")
        : index % 7 === 0
          ? dateObj.getDate().toString()
          : "",
    };
  });
};

export default function AnalyticsCharts({ data, dailyGoal }: Props) {
  const [viewMode, setViewMode] = useState("Weekly");
  const [maxValue, setMaxValue] = useState(dailyGoal);
  const today = new Date();

  // Weekly
  const startOfWeek = startOfISOWeek(today);
  const endOfWeek = endOfISOWeek(today);
  const weeklyData = aggregateIntake(data, startOfWeek, endOfWeek, true);

  // Monthly
  const startOfThisMonth = startOfMonth(today);
  const endOfThisMonth = endOfMonth(today);
  const monthlyData = aggregateIntake(
    data,
    startOfThisMonth,
    endOfThisMonth,
    false
  );

  useEffect(() => {
    if (viewMode === "Weekly") {
      setMaxValue(
        Math.max(Math.max(...weeklyData.map((item) => item.value)), dailyGoal)
      );
    } else {
      setMaxValue(
        Math.max(Math.max(...monthlyData.map((item) => item.value)), dailyGoal)
      );
    }
  }, [viewMode, dailyGoal, weeklyData, monthlyData]);

  const yAxisLabels = Array.from({ length: noOfSections + 1 }, (_, i) => {
    const value = ((maxValue / noOfSections) * i).toFixed(1);
    return `${value}L`;
  });

  return (
    <>
      <View className="flex-row justify-center bg-surface mx-2 rounded-md mb-6">
        {[
          { label: "Weekly Stats", id: "Weekly" },
          { label: "Monthly Stats", id: "Monthly" },
        ].map((mode) => (
          <TouchableOpacity
            key={mode.id}
            onPress={() => setViewMode(mode.id)}
            className={`px-5 py-2 rounded-md border w-1/2 ${
              viewMode === mode.id
                ? "bg-accent border-accent"
                : "border-transparent"
            }`}
          >
            <Text
              className={`font-semibold text-center ${
                viewMode === mode.id ? "" : "text-accent"
              }`}
            >
              {mode.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
      <View className="py-4 rounded-md">
        <BarChart
          data={viewMode === "Weekly" ? weeklyData : monthlyData}
          width={screenWidth}
          height={240}
          initialSpacing={viewMode === "Weekly" ? 10 : 4}
          barWidth={viewMode === "Weekly" ? 22 : 10.5}
          maxValue={maxValue}
          noOfSections={noOfSections}
          spacing={viewMode === "Weekly" ? 32 : 2}
          yAxisTextStyle={{ color: "#fff", fontSize: 10, textAlign: "center" }}
          yAxisLabelTexts={yAxisLabels}
          xAxisLabelTextStyle={{
            color: "#fff",
            fontSize: 10,
            textAlign: "center",
          }}
          xAxisTextNumberOfLines={1}
          frontColor="#82D4C9"
          hideRules
          xAxisColor={"#d2d6d6"}
          yAxisColor={"#d2d6d6"}
        />
      </View>
    </>
  );
}
