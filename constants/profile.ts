const menus = [
  { label: "Health Details", id: "health_details" },
  { label: "Change Hydration Goals", id: "hydration_goal" },
  { label: "Reminders", id: "reminders" },
] as const;

const intervals = [
  { label: "Every 30 minutes", value: 30 },
  { label: "Every 1 hour", value: 60 },
  { label: "Every 1.5 hours", value: 90 },
  { label: "Every 2 hours", value: 120 },
];

export default {
  menus,
  intervals,
};
