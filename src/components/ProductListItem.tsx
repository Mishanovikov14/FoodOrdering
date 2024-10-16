import { Image, Pressable, StyleSheet, Text } from "react-native";

import Colors from "../constants/Colors";
import { Product } from "../constants/types";
import { Href, Link, useSegments } from "expo-router";
import { defaultPizzaImage } from "@/constants/constants";

type ProductListItemProps = {
  product: Product;
};

export default function ProductListItem({ product }: ProductListItemProps) {
  const segments = useSegments();
  const myLink = `/${segments[0]}/menu/${product.id}` as Href;

  return (
    <Link href={myLink} asChild>
      <Pressable style={styles.container}>
        <Image
          source={{ uri: product.image || defaultPizzaImage }}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>{product.name}</Text>
        <Text style={styles.price}>${product.price}</Text>
      </Pressable>
    </Link>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 10,
    borderRadius: 20,
    maxWidth: "50%",
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginVertical: 10,
  },

  price: {
    color: Colors.light.tint,
    fontWeight: "bold",
  },

  image: {
    width: "100%",
    aspectRatio: 1,
  },
});
