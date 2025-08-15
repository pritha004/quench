import React from "react";
import { View } from "react-native";
import Svg, { Circle, Path } from "react-native-svg";

type Props = {
  percentage: number;
  radius?: number;
  strokeWidth?: number;
  color?: string;
  backgroundColor?: string;
  overflowColor?: string;
};

const ActivityRing = ({
  percentage = 0,
  radius = 60,
  strokeWidth = 28,
  color = "#3AAFA9",
  backgroundColor = "#b2d3d6",
  overflowColor = "#68d6d0",
}: Props) => {
  const polarToCartesian = (
    cx: number,
    cy: number,
    r: number,
    angle: number
  ) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return {
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad),
    };
  };

  const minArc = 0.01;
  const clampedPercentage = Math.min(percentage, 100);
  const visualPercentage = clampedPercentage <= 0 ? minArc : clampedPercentage;

  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - visualPercentage / 100);

  const size = (radius + strokeWidth / 2) * 2;
  const center = size / 2;

  const startAngle = 0;
  const arrowPosition = polarToCartesian(center, center, radius, startAngle);

  const hasOverflow = percentage > 100;
  const overflow = hasOverflow ? (percentage - 100) % 100 : 0;
  const overflowDashOffset = circumference * (1 - overflow / 100);
  const lapCount = Math.floor(percentage / 100);

  return (
    <View className="items-center justify-center">
      <Svg width={size} height={size}>
        {/* Background Circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={backgroundColor}
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Main Progress Ring */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
          rotation="-90"
          origin={`${center}, ${center}`}
          fill="none"
        />

        {/* Overflow Ring (if >100%) */}
        {hasOverflow && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={overflowColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={overflowDashOffset}
            rotation="-90"
            origin={`${center}, ${center}`}
            fill="none"
          />
        )}

        <Path
          d="m2.828 15.555 7.777-7.779L2.828 0 0 2.828l4.949 4.948L0 12.727l2.828 2.828z"
          fill={"#000"}
          scale={0.8}
          transform={`translate(${arrowPosition.x + 13}, ${arrowPosition.y - 6}) rotate(0, 0, 0)`}
        />
      </Svg>
    </View>
  );
};

export default ActivityRing;
