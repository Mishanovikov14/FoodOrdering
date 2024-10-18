import { View, FlatList, Text} from "react-native";

import ProductListItem from "@components/ProductListItem";
import { useProductList } from "@/api/products";
import Loader from "@/components/ui/Loader";

export default function MenuScreen() {
  const { data: products, error, isLoading } = useProductList();

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Text>Failed to fetch products</Text>;
  }

  return (
    <View>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <ProductListItem product={item} />}
        numColumns={2}
        contentContainerStyle={{ gap: 10, padding: 10 }}
        columnWrapperStyle={{ gap: 10 }}
      />
    </View>
  );
}
