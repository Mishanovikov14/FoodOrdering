import { CartItem, Product } from "@/constants/types";
import { randomUUID } from "expo-crypto";
import { PropsWithChildren, createContext, useContext, useState } from "react";

type CartType = {
  items: CartItem[];
  onAddItem: (product: Product, size: CartItem["size"]) => void;
  onUpdateQuantity: (itemId: string, amount: -1 | 1) => void;
  total: number;
};

const CartContext = createContext<CartType>({
  items: [],
  onAddItem: () => {},
  onUpdateQuantity: () => {},
  total: 0
});

export default function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItemHandler(product: Product, size: CartItem["size"]) {
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

  const total = items.reduce((sum, item) => sum += item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        onAddItem: addItemHandler,
        onUpdateQuantity: updateQuantity,
        total
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
