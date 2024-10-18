import { useProduct } from "@/api/products";
import RemoteImage from "@/components/RemoteImage";
import Loader from "@/components/ui/Loader";
import Colors from "@/constants/Colors";
import { defaultPizzaImage } from "@/constants/constants";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Href, Link, Stack, useLocalSearchParams } from "expo-router";
import { Text, View, Image, StyleSheet, Pressable } from "react-native";

export default function ProductDetailsScreen() {
  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(typeof idString === "string" ? idString : idString[0]);

  const link = `/(admin)/menu/create?id=${id}` as Href;

  const { data: product, error, isLoading } = useProduct(id);

  if (!product) {
    return <Text>Product not found</Text>;
  }

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: product.name,
          headerRight: () => (
            <Link href={link} asChild>
              <Pressable>
                {({ pressed }) => (
                  <FontAwesome
                    name="pencil"
                    size={25}
                    color={Colors.light.tint}
                    style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                  />
                )}
              </Pressable>
            </Link>
          ),
        }}
      />

      <RemoteImage
        path={product.image}
        fallback={defaultPizzaImage}
        style={styles.image}
      />

      <Text style={styles.title}>{product.name}</Text>
      <Text style={styles.price}>Price ${product.price}</Text>
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

  title: {
    fontSize: 20,
    fontWeight: "bold",
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
  },
});
