import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import Colors from "../constants/Colors";
import { defaultPizzaImage } from "../constants/constants";
import { Tables } from "@/constants/database.types";
import RemoteImage from "./RemoteImage";

type OrderItemListItemProps = {
  item: { products: Tables<"products"> } & Tables<"order_items">;
};

const OrderItemListItem = ({ item }: OrderItemListItemProps) => {
  return (
    <View style={styles.container}>
      <RemoteImage
        path={item.products.image}
        fallback={defaultPizzaImage}
        style={styles.image}
        resizeMode="contain"
      />
      <View style={styles.descriptionContainer}>
        <Text style={styles.title}>{item.products.name}</Text>
        <View style={styles.subtitleContainer}>
          <Text style={styles.price}>${item.products.price.toFixed(2)}</Text>
          <Text>Size: {item.size}</Text>
        </View>
      </View>
      <View style={styles.quantitySelector}>
        <Text style={styles.quantity}>{item.quantity}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 5,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  descriptionContainer: {
    flex: 1,
  },

  image: {
    width: 75,
    aspectRatio: 1,
    alignSelf: "center",
    marginRight: 10,
  },
  title: {
    fontWeight: "500",
    fontSize: 16,
    marginBottom: 5,
  },
  subtitleContainer: {
    flexDirection: "row",
    gap: 5,
  },
  quantitySelector: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  quantity: {
    fontWeight: "500",
    fontSize: 18,
  },
  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },
});

export default OrderItemListItem;
