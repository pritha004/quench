import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import CustomButton from "./Button";

const { width, height } = Dimensions.get("window");

type DrawerProps = {
  visible: boolean;
  onClose: () => void;
};

export default function Drawer({ visible, onClose }: DrawerProps) {
  const slideAnim = useRef(new Animated.Value(width)).current;
  const navigation = useNavigation();

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
  }, [visible]);

  const navigateToScreen = (screen: string) => {
    onClose();
    setTimeout(() => {
      navigation.navigate(screen as never);
    }, 300);
  };

  const swipeDown = Gesture.Pan()
    .onUpdate((e) => {
      if (e.translationY > 100) {
        onClose();
      }
    })
    .runOnJS(true);

  return (
    <Modal transparent visible={visible} animationType="none">
      {/* Backdrop */}
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 bg-black/80" />
      </TouchableWithoutFeedback>

      {/* Drawer Content */}
      <GestureDetector gesture={swipeDown}>
        <Animated.View
          style={{
            transform: [{ translateX: slideAnim }],
            position: "absolute",
            top: 100,
            right: 0,
            height: height - 100,
            width: width,
          }}
          className="bg-bg rounded-tl-2xl rounded-tr-2xl p-5 shadow-lg"
        >
          <CustomButton
            containerStyles="items-end justify-between w-full bg-transparent"
            textStyles="text-textprimary text-accent font-bold text-xl"
            handlePress={() => navigateToScreen("profile")}
            title="Done"
          />
          <View className="">
            <Text className="my-2 text-textprimary text-3xl font-bold text-center">
              Personalise Quench
            </Text>
            <Text className="text-textsecondary text-lg text-center">
              This information ensures Quench data are as accurate as possible.
            </Text>
          </View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}
