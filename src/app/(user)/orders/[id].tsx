import { useOrderDetails } from "@/api/orders";
import { useUpdateOrderListener } from "@/api/orders/subscriptions";
import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import Loader from "@/components/ui/Loader";
import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { Text, FlatList, View, StyleSheet } from "react-native";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const {data: order, error, isLoading} = useOrderDetails(id);

  useUpdateOrderListener(id);

  if (!order) {
    return <Text>Order not found</Text>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Text>Failed to fetch</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${id}` }} />
      <OrderListItem order={order} />

      <FlatList
        data={order.order_items}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => item ? <Text>Item not found</Text> : <OrderItemListItem item={item} />}
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
