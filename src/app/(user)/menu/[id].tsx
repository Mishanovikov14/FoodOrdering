import Button from "@/components/ui/Button";
import { defaultPizzaImage } from "@/constants/constants";
import { useCart } from "@/providers/CartProvider";
import { PizzaSize } from "@/constants/types";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import { Text, View, Image, StyleSheet, Pressable, ActivityIndicator } from "react-native";
import { useProduct } from "@/api/products";
import Loader from "@/components/ui/Loader";
import RemoteImage from "@/components/RemoteImage";

const sizes: PizzaSize[] = ["S", "M", "L", "XL"];

export default function ProductDetailsScreen() {
  const [selectedSize, setSelectedSize] = useState<PizzaSize>("M");

  const { onAddItem } = useCart();

  const router = useRouter();

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  function addToCartHandler() {
    if (!product) {
      return;
    }

    onAddItem(product, selectedSize);

    router.push("/cart");
  }

  const {data: product, error, isLoading} = useProduct(id);

  if (!product) {
    return <Text>Product not found</Text>
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />
      <RemoteImage
          path={product.image}
          fallback={defaultPizzaImage}
          style={styles.image}
        />
      <Text style={styles.sizeTitle}>Select size</Text>

      <View style={styles.sizes}>
        {sizes.map((size) => (
          <Pressable
            onPress={() => setSelectedSize(size)}
            key={size}
            style={[
              styles.size,
              {
                backgroundColor: selectedSize === size ? "gainsboro" : "white",
              },
            ]}
          >
            <Text
              style={[
                styles.sizeText,
                { color: selectedSize === size ? "black" : "grey" },
              ]}
            >
              {size}
            </Text>
          </Pressable>
        ))}
      </View>

      <Text style={styles.price}>Price ${product.price}</Text>

      <Button onPress={addToCartHandler} text="Add to cart"></Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "white",
  },

  image: {
    width: "100%",
    aspectRatio: 1,
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: "auto",
  },

  sizeTitle: {
    fontSize: 18,
  },

  sizes: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },

  size: {
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },

  sizeText: {
    fontSize: 20,
    fontWeight: "500",
  },
});
