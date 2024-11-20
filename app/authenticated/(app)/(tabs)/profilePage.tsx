import HkButton from "@/components/HkButton";
import { useAuthSession } from "@/providers/authctx";
import { Link, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { deleteData } from "@/utils/local_storage"; // Import deleteData function

export default function ProfilePage() {
  const { user, signOut } = useAuthSession();
  const router = useRouter();

  const clearLocalStorage = async () => {
    await deleteData("posts");
    await deleteData("user");
    // Add any other keys you want to remove
    console.log("Local storage cleared");
  };

  return (
      <View className="flex-1 justify-center items-center bg-slate-600">
        <Text style={styles.textStyle}>Hei {user?.displayName}</Text>
        <Text style={styles.textStyle}>Brukernavn: {user?.email}</Text>

        <View style={{ paddingTop: 20 }}>
          {user ? (
              <>
                <Pressable
                    style={styles.logoutButton}
                    onPress={async () => {
                      signOut();
                    }}
                >
                  <Text style={styles.logoutButtonText}>Logg ut</Text>
                </Pressable>
                {/*testing clearing cache for phone*/}
                <Pressable
                    style={styles.clearButton}
                    onPress={clearLocalStorage}
                >
                  <Text style={styles.clearButtonText}>Clear Cache</Text>
                </Pressable>
              </>
          ) : (
              <Link asChild href={{ pathname: "./authenticated/authentication" }}>
                <Pressable style={styles.primaryButton}>
                  <Text style={{ color: "white" }}>Logg inn</Text>
                </Pressable>
              </Link>
          )}
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
    maxWidth: 20,
  },
  alertButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: "#D9021D",
  },
  logoutButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: "red",
    maxWidth: 100,
    margin: 10,
  },
  logoutButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: "blue",
    maxWidth: 100,
    margin: 10,
  },
  clearButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  textStyle: {
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
  },
});
