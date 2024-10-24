import Button from "@/components/ui/Button";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import { defaultPizzaImage } from "@/constants/constants";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import * as FileSystem from "expo-file-system";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import {
  useDeleteProduct,
  useInsertProduct,
  useProduct,
  useUpdateProduct,
} from "@/api/products";
import Loader from "@/components/ui/Loader";
import { randomUUID } from "expo-crypto";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import RemoteImage from "@/components/RemoteImage";

export default function CreateProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [image, setImage] = useState<string | null>(null);

  const { id: idString } = useLocalSearchParams();
  const id = parseFloat(
    typeof idString === "string" ? idString : idString?.[0]
  );

  const isUpdating = !!idString;

  const router = useRouter();

  const { mutate: insertProduct, isPending: isCreating } = useInsertProduct();
  const { mutate: updateProduct, isPending: isCurrentlyUpdating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: isDeleting } = useDeleteProduct();

  const { data: updatingProduct } = useProduct(id);

  useEffect(() => {
    if (updatingProduct) {
      setName(updatingProduct.name);
      setPrice(updatingProduct.price.toString());
      setImage(updatingProduct.image);
    }
  }, [updatingProduct]);

  if (isLoading || isCreating || isCurrentlyUpdating || isDeleting) {
    return <Loader />;
  }

  async function createHandler() {
    if (validateInput()) {
      setIsLoading(true);

      const imagePath = await uploadImage();

      setIsLoading(false);

      insertProduct(
        { name, price: parseFloat(price), image: imagePath },
        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
        }
      );
    }
  }

  async function updateHandler() {
    if (validateInput()) {
      setIsLoading(true);

      const imagePath = await uploadImage();

      setIsLoading(false);

      updateProduct(
        { id, name, price: parseFloat(price), image: imagePath },
        {
          onSuccess: () => {
            resetFields();
            router.back();
          },
        }
      );
    }
  }

  function resetFields() {
    setName("");
    setPrice("");
  }

  function validateInput() {
    setErrors("");

    if (!name) {
      setErrors("Name is required");

      return false;
    }

    if (!price) {
      setErrors("Price is required");

      return false;
    }

    if (isNaN(parseFloat(price))) {
      setErrors("Price is not a number");

      return false;
    }

    return true;
  }

  function submitHandler() {
    if (isUpdating) {
      updateHandler();
    } else {
      createHandler();
    }
  }

  function onDelete() {
    deleteProduct(id, {
      onSuccess: () => {
        router.replace("/(admin)");
      },
    });
  }

  function deleteHandler() {
    Alert.alert("Confirm", "Are you sure you want to delete this product?", [
      {
        text: "Cancel",
      },
      {
        text: "Delete",
        style: "destructive",
        onPress: onDelete,
      },
    ]);
  }

  async function pickImage() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  async function uploadImage() {
    if (!image?.startsWith("file://")) {
      return;
    }

    const base64 = await FileSystem.readAsStringAsync(image, {
      encoding: "base64",
    });
    const filePath = `${randomUUID()}.png`;
    const contentType = "image/png";
    const { data, error } = await supabase.storage
      .from("product-images")
      .upload(filePath, decode(base64), { contentType });
    if (data) {
      return data.path;
    }
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />
      <RemoteImage
        path={image}
        fallback={defaultPizzaImage}
        style={styles.image}
      />
      <Text onPress={pickImage} style={styles.textButton}>
        Select Image
      </Text>

      <Text style={styles.label}>Name</Text>
      <TextInput
        value={name}
        onChangeText={setName}
        style={styles.input}
        placeholder="Name"
      />

      <Text style={styles.label}>Price ($)</Text>
      <TextInput
        value={price}
        onChangeText={setPrice}
        style={styles.input}
        placeholder="$9.99"
        keyboardType="numeric"
      />

      <Text style={styles.error}>{errors}</Text>
      <Button onPress={submitHandler} text={isUpdating ? "Update" : "Create"} />
      {isUpdating && (
        <Text onPress={deleteHandler} style={styles.textButton}>
          Delete
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 10,
  },

  input: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 10,
    marginTop: 5,
    marginBottom: 20,
  },

  label: {
    color: "grey",
    fontSize: 16,
  },

  image: {
    width: "50%",
    aspectRatio: 1,
    alignSelf: "center",
  },

  error: {
    color: "red",
    fontSize: 16,
  },

  textButton: {
    alignSelf: "center",
    fontWeight: "bold",
    color: Colors.light.tint,
    marginVertical: 10,
  },
});
