import Colors from "@/constants/Colors";
import { defaultPizzaImage } from "@/constants/constants";
import products from "@assets/data/products";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Href, Link, Stack, useLocalSearchParams} from "expo-router";
import { Text, View, Image, StyleSheet, Pressable } from "react-native";

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams();

  const product = products.find((el) => el.id.toString() === id);

  if (!product) {
    return <Text>Product not found</Text>;
  }

  const link = `/(admin)/menu/create?id=${id}` as Href;

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

      <Image
        source={{ uri: product.image || defaultPizzaImage }}
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
