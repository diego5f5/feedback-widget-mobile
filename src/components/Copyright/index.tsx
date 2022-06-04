import React from "react";
import { View, Text, Linking } from "react-native";

import { styles } from "./styles";

const Copyright = () => {
  return (
    <View>
      <Text style={styles.text}>
        Made with ♥ by{" "}
        <Text
          style={[styles.text, { textDecorationLine: "underline" }]}
          onPress={() => {
            Linking.openURL("https://github.com/diego5f5");
          }}
        >
          Diego
        </Text>
      </Text>
    </View>
  );
};

export default Copyright;
