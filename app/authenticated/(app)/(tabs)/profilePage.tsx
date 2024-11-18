import HkButton from "@/components/HkButton";
import { useAuthSession } from "@/providers/authctx";
import { Link, useRouter } from "expo-router";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import { usePostContext } from "@/providers/PostContext";

export default function ProfilePage() {
  const { user, signOut } = useAuthSession();
  const { posts, fetchPosts } = usePostContext();
  const router = useRouter();
  const [postCount, setPostCount] = useState(0);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    if (user) {
      const userPosts = posts.filter(post => post.authorId === user.uid);
      setPostCount(userPosts.length);
      const totalLikes = userPosts.reduce((sum, post) => sum + (post.likes?.length || 0), 0);
      setLikeCount(totalLikes);
    }
  }, [posts, user]);

  return (
      <View className="flex-1 justify-center items-center bg-slate-600">
        <Text style={styles.textStyle}>Hei {user?.displayName}</Text>
        <Text style={styles.textStyle}>Epost: {user?.email}</Text>

        <View style={{ paddingTop: 20 }}>
          {user ? (
              <Pressable style={styles.logoutButton} onPress={async () => signOut()}>
                <Text style={styles.logoutButtonText}>Logg ut</Text>
              </Pressable>
          ) : (
              <Link asChild href={{ pathname: "/authentication" }}>
                <Pressable style={styles.primaryButton}>
                  <Text style={{ color: "white" }}>Logg inn</Text>
                </Pressable>
              </Link>
          )}
        </View>
        {user && (
            <View style={styles.statsContainer}>
              <Text style={styles.statsText}>Antall innlegg: {postCount}</Text>
              <Text style={styles.statsText}>Antall likes: {likeCount}</Text>
            </View>
        )}
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
  textStyle: {
    fontSize: 20,
    marginLeft: 10,
    marginTop: 10,
  },
  statsContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  statsText: {
    fontSize: 16,
    color: "black",
  },
});