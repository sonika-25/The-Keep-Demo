import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from "react-native";

export type DialogItem = {
  label: string;
  onPress?: () => void;
};

type DialogBoxProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  items: DialogItem[];
};

export default function DialogBox({
  visible,
  onClose,
  title,
  items,
}: DialogBoxProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <Pressable style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeText}>×</Text>
          </Pressable>

          <Text style={styles.title}>{title}</Text>

          <ScrollView>
            {items.map((item) => (
              <Pressable
                key={item.label}
                style={styles.row}
                onPress={item.onPress}
              >
                <Text style={styles.rowText}>{item.label}</Text>
                <Text style={styles.arrow}>→</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },

  dialog: {
    width: "85%",
    maxHeight: "65%",
    backgroundColor: "#ffffff",
    borderRadius: 4,
    paddingVertical: 25,
    paddingHorizontal: 18,
  },

  closeButton: {
    position: "absolute",
    width:20,
    height:60,
    top: 10,
    right: 12,
    zIndex: 2,
  },

  closeText: {
    fontSize: 28,
    color: "#333",
  },

  title: {
    fontSize: 18,
    textAlign: "center",
    marginBottom: 18,
    color: "#000000",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.08)",
    paddingVertical: 14,
  },

  rowText: {
    fontSize: 14,
    color: "#222",
  },

  arrow: {
    fontSize: 24,
    color: "#555",
  },
});