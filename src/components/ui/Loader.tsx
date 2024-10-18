import Colors from "@/constants/Colors";
import { View, ActivityIndicator, StyleSheet } from "react-native";

export default function Loader() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={"large"} color={Colors.light.tint} />
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
