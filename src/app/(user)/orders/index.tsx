import { useUserOrderList } from "@/api/orders";
import OrderListItem from "@/components/OrderListItem";
import Loader from "@/components/ui/Loader";
import { FlatList, Text } from "react-native";

export default function OrdersScreen() {
  const { data: orders, error, isLoading } = useUserOrderList();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Text>Failed to fetch</Text>;
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => <OrderListItem order={item} />}
      contentContainerStyle={{gap: 10, paddingHorizontal: 20, paddingVertical: 10}}
    />
  );
}
