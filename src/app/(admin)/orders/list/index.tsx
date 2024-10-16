import OrderListItem from "@/components/OrderListItem";
import orders from "@assets/data/orders";
import { FlatList } from "react-native";

export default function OrdersScreen() {
  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{gap: 10, paddingHorizontal: 20, paddingVertical: 10}}
    />
  );
}
