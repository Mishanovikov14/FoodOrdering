import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import { useTranslation } from "react-i18next";
import { View, StyleSheet } from "react-native";

const ProfileScreen = () => {
  const { i18n } = useTranslation();

  function changeLanguage() {
    if (i18n.language === "en") {
      i18n.changeLanguage("uk");
    } else {
      i18n.changeLanguage("en");
    }
  }

  return (
    <View style={styles.container}>
      <Button text="Change Language" onPress={changeLanguage} />

      {/* <Button
        text="Sign out"
        onPress={async () => await supabase.auth.signOut()}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 40,
    paddingVertical: 20,
  },
});

export default ProfileScreen;
