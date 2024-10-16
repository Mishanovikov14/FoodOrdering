import { withLayoutContext } from "expo-router";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet } from "react-native";

const TopTab = withLayoutContext(createMaterialTopTabNavigator().Navigator);

export default function OrderListNavigator() {
  return (
    <SafeAreaView edges={["top"]} style={styles.container}>
      <TopTab> 
        <TopTab.Screen name="index" options={{title: "Active"}}/>
        <TopTab.Screen name="archive"/>
      </TopTab>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});
