import { useOrderDetails, useUpdateOrder } from "@/api/orders";
import OrderItemListItem from "@/components/OrderItemListItem";
import OrderListItem from "@/components/OrderListItem";
import { Text } from "@/components/Themed";
import Loader from "@/components/ui/Loader";
import Colors from "@/constants/Colors";
import { OrderStatusList } from "@/constants/types";
import { Stack } from "expo-router";
import { useLocalSearchParams } from "expo-router";
import { FlatList, View, StyleSheet, Pressable } from "react-native";

export default function OrderDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const {data: order, error, isLoading} = useOrderDetails(id);

  const {mutate: updateOrder, isPending: isCurrentlyUpdating} = useUpdateOrder();

  function statusUpdateHandler(status: string) {
    updateOrder({id: id, updatedFields: {status}});
  } 

  if (isLoading || isCurrentlyUpdating) {
    return <Loader />;
  }

  if (error || !order) {
    return <Text>Failed to fetch</Text>;
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
        ListFooterComponent={() => (
          <>
            <Text style={styles.statusTitle}>Status</Text>
            <View style={styles.statusesContainer}>
              {OrderStatusList.map((status) => (
                <Pressable
                  key={status}
                  onPress={() => statusUpdateHandler(status)}
                  style={[styles.status,  order.status === status && {backgroundColor: Colors.light.tint}]}
                >
                  <Text
                    style={[styles.statusText, order.status === status && {color: "white"}]}
                  >
                    {status}
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
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
  statusesContainer: { flexDirection: "row", gap: 5 },

  statusTitle: { fontWeight: "bold" },
  status: {
    borderColor: Colors.light.tint,
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
    marginVertical: 10,
    backgroundColor: "transparent"
  },

  statusText: {
    color: Colors.light.tint
  }
});
