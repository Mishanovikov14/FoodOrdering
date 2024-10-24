import { Alert } from "react-native";
import { supabase } from "./supabase";
import { initPaymentSheet, presentPaymentSheet } from "@stripe/stripe-react-native";

export const fetchingPaymentSheetParams = async (amount: number) => {
  const { data, error } = await supabase.functions.invoke("payment-sheet", {
    body: {
      amount,
    },
  });

  if (data) {
    return data;
  }

  Alert.alert("Error fetching payment sheet params");
  return {};
};

export const initialisePaymentSheet = async (amount: number) => {
  console.log("Initilise stripe", amount);

  const {paymentIntent, publishableKey} = await fetchingPaymentSheetParams(amount);

  if (!paymentIntent || !publishableKey) {
    return;
  }

  await initPaymentSheet({
    merchantDisplayName: "Test",
    paymentIntentClientSecret: paymentIntent,
    defaultBillingDetails: {
        name: "Jane Doe",
    }
  })
};

export const openPaymentSheet = async () => {
    const {error} = await presentPaymentSheet();

    if (error) {
        Alert.alert(error.message);
        return false;
    }

    return true;
}
