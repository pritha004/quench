import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { twMerge } from "tailwind-merge";

type Props = {
  classes: string;
  title: string | ReactNode;
  value: string | number;
};

const Card = ({ classes, title, value }: Props) => {
  return (
    <View className={twMerge(`bg-accent rounded`, classes)}>
      <Text className="text-4xl font-raleway font-bold text-center my-4">
        {value}
      </Text>
      <Text className="text-md font-inter font-semibold text-center">
        {title}
      </Text>
    </View>
  );
};

export default Card;
