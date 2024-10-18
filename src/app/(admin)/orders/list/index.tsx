import { useAdminOrderList } from "@/api/orders";
import { useInsertOrderListener } from "@/api/orders/subscriptions";
import OrderListItem from "@/components/OrderListItem";
import Loader from "@/components/ui/Loader";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { FlatList, Text } from "react-native";

export default function OrdersScreen() {
  const {
    data: orders,
    error,
    isLoading,
  } = useAdminOrderList({ archived: false });

  useInsertOrderListener();

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
      contentContainerStyle={{
        gap: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
      }}
    />
  );
}
