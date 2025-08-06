import React, { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Modal,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("window");

type DrawerProps = {
  visible: boolean;
  onClose: () => void;
  drawerContent: React.ReactNode;
};

export default function Drawer({
  visible,
  onClose,
  drawerContent,
}: DrawerProps) {
  const slideAnim = useRef(new Animated.Value(width)).current;

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
          <View>{drawerContent}</View>
        </Animated.View>
      </GestureDetector>
    </Modal>
  );
}
