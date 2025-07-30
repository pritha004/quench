import React from "react";
import { Text, TouchableOpacity } from "react-native";

type Props = {
  title?: string;
  child?: any;
  handlePress: () => void;
  containerStyles?: string;
  textStyles?: string;
  isLoading?: boolean;
};

const CustomButton = ({
  title,
  child,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}: Props) => {
  return (
    <TouchableOpacity
      className={`${child ? "" : "bg-accent w-full"} rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${isLoading ? "opacity-50" : ""}`}
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
    >
      {title && (
        <Text className={`text-black font-bold text-lg ${textStyles}`}>
          {title}
        </Text>
      )}
      {child}
    </TouchableOpacity>
  );
};

export default CustomButton;
