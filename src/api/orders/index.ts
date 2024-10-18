import { InsertTables, UpdateTables } from "@/constants/types";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/providers/AuthProvider";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAdminOrderList = ({ archived = false }) => {
  const statuses = archived ? ["Delivered"] : ["New", "Cooking", "Delivering"];

  return useQuery({
    queryKey: ["orders", { archived }],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .in("status", statuses)
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useUserOrderList = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ["orders", { userId: id }],
    queryFn: async () => {
      if (id) {
        const { data, error } = await supabase
          .from("orders")
          .select("*")
          .eq("user_id", id)
          .order("created_at", { ascending: false });

        if (error) {
          throw new Error(error.message);
        }

        return data;
      } else {
        return null;
      }
    },
  });
};

export const useOrderDetails = (id: number) => {
  return useQuery({
    queryKey: ["orders", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select("*, order_items(*, products(*))")
        .eq("id", id)
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return data;
    },
  });
};

export const useInsertOrder = () => {
  const queryClient = useQueryClient();

  const { session } = useAuth();
  const id = session?.user.id;

  return useMutation({
    async mutationFn(data: InsertTables<"orders">) {
      const { error, data: newOrder } = await supabase
        .from("orders")
        .insert({ ...data, user_id: id })
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return newOrder;
    },

    async onSuccess() {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
    },

    onError(error) {
      console.log(error);
    },
  });
};

export const useUpdateOrder = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn({
      id,
      updatedFields,
    }: {
      id: number;
      updatedFields: UpdateTables<"orders">;
    }) {
      const { error, data: updatedOrder } = await supabase
        .from("orders")
        .update(updatedFields)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return updatedOrder;
    },

    async onSuccess(_, { id }) {
      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      await queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },

    onError(error) {
      console.log(error);
    },
  });
};
