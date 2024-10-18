import { Text } from "@/components/Themed";
import Button from "@/components/ui/Button";
import { supabase } from "@/lib/supabase";
import {View} from "react-native";

export default function ProfileScreen() {
    return (
        <View>
            <Text>Profile</Text>
            <Button onPress={async () => await supabase.auth.signOut()} text="Logout"/>
        </View>
    );
} 