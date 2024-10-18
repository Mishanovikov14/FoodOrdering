import { View, ActivityIndicator } from "react-native";
import React from "react";
import Button from "../components/ui/Button";
import { Href, Link, Redirect } from "expo-router";
import { useAuth } from "@/providers/AuthProvider";
import { supabase } from "@/lib/supabase";
import Loader from "@/components/ui/Loader";

const index = () => {
  const { session, loading, isAdmin } = useAuth();

  const signInLink = "/sign-in" as Href;

  if (loading) {
    return <Loader />
  }

  if (!session) {
    return <Redirect href={"/sign-in"} />
  }

  if (!isAdmin) {
    return <Redirect href={"/(user)"} />
  }

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
      <Link href={"/(user)"} asChild>
        <Button text="User" />
      </Link>
      <Link href={"/(admin)"} asChild>
        <Button text="Admin" />
      </Link>

      <Button onPress={() => supabase.auth.signOut()} text="Sign Out"/>
    </View>
  );
};

export default index;
