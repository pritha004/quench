import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "./Button";

type TimePickerProps = {
  title: string;
  value: string | null;
  onChange: (time: string | null) => void;
};

const TimePicker = ({ title, value, onChange }: TimePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date>(
    value
      ? new Date(
          0,
          0,
          0,
          parseInt(value.split(":")[0]),
          parseInt(value.split(":")[1])
        )
      : new Date()
  );

  const handleTempChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempTime(selectedDate);
    }
  };

  const confirmDate = () => {
    onChange(
      `${tempTime?.getHours().toString().padStart(2, "0")}:${tempTime
        ?.getMinutes()
        .toString()
        .padStart(2, "0")}`
    );
    setShowPicker(false);
  };

  const cancelPicker = () => {
    setShowPicker(false);
  };

  const formattedDate = value ? value : "Select";

  return (
    <View className="mb-4">
      <CustomButton
        containerStyles="bg-surface items-start w-full"
        textStyles="text-textprimary px-4"
        handlePress={() => setShowPicker(true)}
        child={
          <View className="flex-row w-full justify-between items-center px-4">
            <Text className={`text-textprimary text-xl font-bold`}>
              {title}
            </Text>
            <Text className={`text-textprimary text-xl font-bold`}>
              {formattedDate}
            </Text>
          </View>
        }
      />

      {showPicker && (
        <Modal
          transparent
          animationType="slide"
          visible={showPicker}
          onRequestClose={cancelPicker}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-surface text-textprimary rounded-t-xl px-4 py-8">
              <View className="flex-row justify-between mb-2">
                <TouchableOpacity onPress={cancelPicker}>
                  <Text className="text-accent font-semibold">Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={confirmDate}>
                  <Text className="text-accent font-semibold">Done</Text>
                </TouchableOpacity>
              </View>
              <View className="items-center">
                <DateTimePicker
                  value={tempTime}
                  mode="time"
                  display="spinner"
                  onChange={handleTempChange}
                  themeVariant="dark"
                  style={{ height: 200 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default TimePicker;
