import React from "react";
import { Modal, View } from "react-native";

type Props = {
  open: boolean;
  setOpen: (open: boolean) => void;
  child: React.ReactNode;
};

const Popup = ({ open, setOpen, child }: Props) => {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100">
      <Modal
        transparent
        animationType="fade"
        visible={open}
        onRequestClose={() => setOpen(false)}
      >
        {child}
      </Modal>
    </View>
  );
};

export default Popup;
