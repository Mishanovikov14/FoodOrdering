import Button from "@/components/Button";
import CartListItem from "@/components/CartListItem";
import { useCart } from "@/providers/CartProvider";
import { StatusBar } from "expo-status-bar";
import { View, Platform, FlatList, StyleSheet, Text } from "react-native";

export default function CartScreen() {
  const { items, total } = useCart();

  return (
    <View style={styles.mainContainer}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <CartListItem cartItem={item} />}
        contentContainerStyle={{ gap: 10 }}
      />

      <Text style={styles.totalText}>Total: ${total}</Text>
      <Button text="Checkout" />
      <StatusBar style={Platform.OS === "ios" ? "light" : "auto"} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
  },

  totalText: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: "500",
    color: "white"
  }
});
