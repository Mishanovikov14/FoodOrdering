import Colors from "@/constants/Colors";
import { View, ActivityIndicator, StyleSheet, Text } from "react-native";
import Button from "./Button";

export default function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={Colors.light.tint} />
      <Text testID="test">Hello Kalle!</Text>
      <Button text="start" onPress={() => {}}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
