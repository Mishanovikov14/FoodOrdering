import Button from "@/components/Button";
import { StyleSheet, Text, TextInput, View, Image, Alert } from "react-native";
import { useState } from "react";
import { defaultPizzaImage } from "@/constants/constants";
import Colors from "@/constants/Colors";
import * as ImagePicker from "expo-image-picker";
import { Stack, useLocalSearchParams } from "expo-router";

export default function CreateProductScreen() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [errors, setErrors] = useState("");
  const [image, setImage] = useState<string | null>(null);

  const { id } = useLocalSearchParams();
  const isUpdating = !!id;

  function createHandler() {
    if (validateInput()) {
      console.warn("create product " + name + " " + price);

      resetFields();
    }
  }

  function updateHandler() {
    if (validateInput()) {
      console.warn("Update product " + name + " " + price);

      resetFields();
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
    console.warn("Deleted");
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

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{ title: isUpdating ? "Update Product" : "Create Product" }}
      />
      <Image
        source={{ uri: image || defaultPizzaImage }}
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
