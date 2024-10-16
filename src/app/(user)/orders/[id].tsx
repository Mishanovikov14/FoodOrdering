import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import orders from "@assets/data/orders";
import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Text, FlatList, View, StyleSheet } from "react-native";

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();

  const order = orders.find((order) => order.id.toString() === id);

  if (!order) {
    return <Text>Order not found</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${id}` }} />
      <OrderListItem order={order} />

      <FlatList
        data={order.order_items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <OrderItemListItem item={item} />}
        contentContainerStyle={{ gap: 10 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    gap: 20,
  },
});
