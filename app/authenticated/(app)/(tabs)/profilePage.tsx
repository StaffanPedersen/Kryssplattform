import HkButton from "@/components/HkButton";
import { useAuthSession } from "@/providers/authctx";
import { Link, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";

export default function ProfilePage() {
  const { user, signOut } = useAuthSession();
  const router = useRouter();

  return (
      <View className="flex-1 justify-center items-center bg-slate-600">
        <Text style={styles.textStyle}>Hei {user?.displayName}</Text>
        <Text style={styles.textStyle}>Brukernavn: {user?.email}</Text>

        <View style={{ paddingTop: 20 }}>
          {user ? (
              <Pressable
                  className="bg-red-500"
                  onPress={async () => {
                    signOut();
                  }}
              >
                <Text className="italic font-bold">Logg ut</Text>
              </Pressable>
          ) : (
              <Link asChild href={{ pathname: "/authentication" }}>
                <Pressable style={styles.primaryButton}>
                  <Text style={{ color: "white" }}>Logg inn</Text>
                </Pressable>
              </Link>
          )}
          <HkButton italic theme="primary" title="Knapp!" onPress={() => {}} />
          <HkButton bold theme="alert" title="Knapp!" onPress={() => {}} />
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  primaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: "#0096C7",
  },
  alertButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: "#D9021D",
  },
  textStyle: {
    fontSize: 20,
  },
});
