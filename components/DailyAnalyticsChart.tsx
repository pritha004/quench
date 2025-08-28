import { format, isSameDay, parseISO } from "date-fns";
import React, { useEffect, useState } from "react";
import { Dimensions, Text, View } from "react-native";
import { LineChart } from "react-native-gifted-charts";

const noOfSections = 4;
const screenWidth = Dimensions.get("window").width;

type Props = {
  data: { intake: number; logged_at: string }[];
  maxVal: number;
};

export const aggregateHourlyIntake = (
  data: { intake: number; logged_at: string }[],
  selectedDate: Date
) => {
  const hourlyIntakeMap: Record<number, number> = {};
  for (let hour = 0; hour < 24; hour++) {
    hourlyIntakeMap[hour] = 0;
  }

  data.forEach(({ logged_at, intake }) => {
    const logDate = parseISO(logged_at);
    if (isSameDay(logDate, selectedDate)) {
      const hour = logDate.getHours();
      hourlyIntakeMap[hour] += intake;
    }
  });

  return Object.entries(hourlyIntakeMap).map(([hourStr, intakeMl]) => {
    const hour = parseInt(hourStr, 10);
    const label = [0, 6, 12, 18].includes(hour)
      ? format(new Date().setHours(hour, 0, 0, 0), "haaa").toUpperCase()
      : "";

    return {
      value: +(intakeMl / 1000).toFixed(2),
      label,
      hideDataPoint: +(intakeMl / 1000).toFixed(2) === 0,
    };
  });
};

export default function DailyAnalyticsChart({ data, maxVal }: Props) {
  const [maxValue, setMaxValue] = useState(maxVal);
  const hourlyData = aggregateHourlyIntake(data, new Date());

  useEffect(() => {
    setMaxValue(
      Math.max(Math.max(...hourlyData.map((item) => item.value)), maxVal)
    );
  }, [hourlyData]);

  const yAxisLabels = Array.from({ length: noOfSections + 1 }, (_, i) => {
    const value = ((maxValue / noOfSections) * i).toFixed(1);
    return `${value}L`;
  });

  return (
    <>
      <View className="py-4 rounded-md m-2">
        <Text className="my-8 text-textprimary font-bold text-lg">
          Sip Stats Today
        </Text>
        <LineChart
          data={hourlyData}
          width={screenWidth}
          height={160}
          maxValue={maxValue}
          noOfSections={noOfSections}
          spacing={16}
          yAxisTextStyle={{ color: "#fff", fontSize: 10, textAlign: "center" }}
          yAxisLabelTexts={yAxisLabels}
          xAxisLabelTextStyle={{
            color: "#fff",
            fontSize: 10,
            textAlign: "center",
          }}
          xAxisTextNumberOfLines={1}
          hideRules
          xAxisColor={"#d2d6d6"}
          yAxisColor={"#d2d6d6"}
          initialSpacing={4}
          color1="#abd6d6"
          dataPointsColor1="#82D4C9"
          dataPointsRadius1={5}
          adjustToWidth={true}
          rotateLabel={true}
          labelsExtraHeight={20}
          xAxisLabelsVerticalShift={10}
        />
      </View>
    </>
  );
}
