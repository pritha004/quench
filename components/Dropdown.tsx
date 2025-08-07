import React, { useEffect, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CustomButton from "./Button";

type Option<T> = {
  label: string;
  value: T;
};

type DropdownProps<T> = {
  value: T | null;
  onChange: (val: T) => void;
  options: Option<T>[];
  title?: string;
};

const Dropdown = <T extends string | number>({
  value,
  onChange,
  options,
  title = "Select",
}: DropdownProps<T>) => {
  const [showPicker, setShowPicker] = useState(false);

  const selectedLabel =
    options.find((item) => item.value === value)?.label || "Select";

  const renderOption = ({ item }: { item: Option<T> }) => (
    <TouchableOpacity
      className="py-4 px-4 items-center border-b border-textsecondary"
      onPress={() => {
        onChange(item.value);
        setShowPicker(false);
      }}
    >
      <Text className={`text-lg font-bold text-textprimary`}>{item.label}</Text>
    </TouchableOpacity>
  );

  const cancelSelection = () => {
    setShowPicker(false);
  };

  const listRef = useRef<FlatList>(null);

  useEffect(() => {
    if (showPicker) {
      const index = options.findIndex((item) => item.value === value);
      if (index >= 0 && listRef.current) {
        setTimeout(() => {
          listRef.current?.scrollToIndex({ index, animated: true });
        }, 100);
      }
    }
  }, [showPicker, value, options]);

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
              {selectedLabel}
            </Text>
          </View>
        }
      />

      {Platform.OS === "ios" && showPicker && (
        <Modal
          transparent
          animationType="slide"
          visible={showPicker}
          onRequestClose={cancelSelection}
        >
          <View className="flex-1 justify-end bg-black/40">
            <View className="bg-surface text-textprimary rounded-t-xl px-4 py-8">
              <View className="flex-row justify-start mb-2">
                <TouchableOpacity onPress={cancelSelection}>
                  <Text className="text-accent font-semibold">Cancel</Text>
                </TouchableOpacity>
              </View>
              <View className="items-center">
                <FlatList
                  ref={listRef}
                  showsVerticalScrollIndicator={false}
                  data={options}
                  keyExtractor={(item) => item.value.toString()}
                  renderItem={renderOption}
                  style={{ maxHeight: 250 }}
                  getItemLayout={(_, index) => ({
                    length: 50,
                    offset: 52 * index,
                    index,
                  })}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}

      {Platform.OS === "android" && showPicker && (
        <View className="border border-gray-300 rounded-md mt-2 bg-white z-10">
          {options.map((item) => (
            <TouchableOpacity
              key={item.value}
              className="py-3 px-4 border-b border-gray-200"
              onPress={() => {
                onChange(item.value);
                setShowPicker(false);
              }}
            >
              <Text className="text-base text-gray-800">{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

export default Dropdown;
