import { useInsertOrderItems } from "@/api/order-items";
import { useInsertOrder } from "@/api/orders";
import { CartItem, Tables } from "@/constants/types";
import { randomUUID } from "expo-crypto";
import { useRouter } from "expo-router";
import { PropsWithChildren, createContext, useContext, useState } from "react";
import { initialisePaymentSheet, openPaymentSheet } from "@/lib/stripe";

type CartType = {
  items: CartItem[];
  onAddItem: (product: Tables<"products">, size: CartItem["size"]) => void;
  onUpdateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
  onCheckout: () => void;
};

const CartContext = createContext<CartType>({
  items: [],
  onAddItem: () => {},
  onUpdateQuantity: () => {},
  total: 0,
  onCheckout: () => {},
});

export default function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);

  const { mutate: insertOrder } = useInsertOrder();
  const { mutate: insertOrderItems } = useInsertOrderItems();

  const router = useRouter();

  function addItemHandler(product: Tables<"products">, size: CartItem["size"]) {
    const existingItem = items.find(
      (item) => item.product === product && item.size === size
    );

    if (existingItem) {
      updateQuantity(existingItem.id, 1);
    } else {
      const newCartItem: CartItem = {
        id: randomUUID(),
        product,
        product_id: product.id,
        size,
        quantity: 1,
      };

      setItems((prevState) => [newCartItem, ...prevState]);
    }
  }

  function updateQuantity(itemId: string, amount: -1 | 1) {
    const updatedItem = items
      .map((item) =>
        item.id !== itemId
          ? item
          : { ...item, quantity: item.quantity + amount }
      )
      .filter((item) => item.quantity > 0);

    setItems(updatedItem);
  }

  function clearCart() {
    setItems([]);
  }

  async function checkoutHandler() {
    // await initialisePaymentSheet(Math.floor(total * 100));
    // const payed = await openPaymentSheet();

    // if (!payed) {
    //   return;
    // }

    insertOrder(
      {
        total,
      },
      {
        onSuccess: saveOrderItems,
      }
    );
  }

  function saveOrderItems(orderData: Tables<"orders">) {
    const orderItems = items.map((cartItem) => ({
      order_id: orderData.id,
      product_id: cartItem.product_id,
      quantity: cartItem.quantity,
      size: cartItem.size,
    }));

    insertOrderItems(orderItems, {
      onSuccess: () => {
        clearCart();
        router.push(`/(user)/orders/${orderData.id}`);
      },
    });
  }

  const total = items.reduce(
    (sum, item) => (sum += item.product.price * item.quantity),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        onAddItem: addItemHandler,
        onUpdateQuantity: updateQuantity,
        total,
        onCheckout: checkoutHandler,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
