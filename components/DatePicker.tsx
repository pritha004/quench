import DateTimePicker from "@react-native-community/datetimepicker";
import React, { useState } from "react";
import { Modal, Platform, Text, TouchableOpacity, View } from "react-native";
import CustomButton from "./Button";

type DatePickerProps = {
  title: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
};

const DatePicker = ({ title, value, onChange }: DatePickerProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date | null>(value);

  const handleTempChange = (_event: any, selectedDate?: Date) => {
    if (selectedDate) {
      setTempDate(selectedDate);
    }
  };

  const confirmDate = () => {
    onChange(tempDate);
    setShowPicker(false);
  };

  const cancelPicker = () => {
    setTempDate(value);
    setShowPicker(false);
  };

  const formattedDate = value ? value.toLocaleDateString() : "Select";

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

      {Platform.OS === "ios" && showPicker && (
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
                  value={tempDate || new Date()}
                  mode="date"
                  display="spinner"
                  onChange={handleTempChange}
                  maximumDate={new Date()}
                  themeVariant="dark"
                  style={{ height: 200 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === "android" && showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode="date"
          display="default"
          onChange={(_event, selectedDate) => {
            setShowPicker(false);
            if (selectedDate) {
              onChange(selectedDate);
            }
          }}
          maximumDate={new Date()}
          themeVariant="dark"
        />
      )}
    </View>
  );
};

export default DatePicker;
