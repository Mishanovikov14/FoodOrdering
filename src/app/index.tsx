import { View } from "react-native";
import React from "react";
import Button from "../components/ui/Button";
import { Link, Redirect, Stack } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import Loader from "@/components/ui/Loader";

const index = () => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!session) {
    return <Redirect href={"/sign-in"} />;
  }

  if (profile?.group !== "ADMIN") {
    return <Redirect href={"/(user)"} />;
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Stack.Screen
        options={{
          title: "Admin panel",
        }}
      />

      <Link href={"/(user)"} asChild>
        <Button text="Log in as User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Log in as Admin" />
      </Link>

      <Button
        onPress={async () => await supabase.auth.signOut()}
        text="Sign Out"
      />
    </View>
  );
};

export default index;
