import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Image,
  FlatList,
} from "react-native";
import { useAuthSession } from "@/providers/authctx";
import { Link } from "expo-router";
import { deleteData } from "@/utils/local_storage";
import { getAllPosts } from "@/api/postApi"; // Import the function to get all posts

interface PostData {
  id: string;
  authorId: string;
  imageURL: string;
  title: string;
  likes: string[];
}

export default function ProfilePage() {
  const { user, signOut } = useAuthSession();
  const [userPosts, setUserPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchUserPosts = async () => {
      if (user) {
        const allPosts = await getAllPosts();
        const filteredPosts = allPosts.filter(
            (post) => post.authorId === user.uid
        );
        setUserPosts(filteredPosts);
      }
    };
    fetchUserPosts();
  }, [user]);

  const clearLocalStorage = async () => {
    await deleteData("posts");
    await deleteData("user");
    console.log("Local storage cleared");
  };

  const renderItem = ({ item }: { item: PostData }) => (
      <Link href={`/authenticated/postDetails/${item.id}`}>
        <View style={styles.postItem}>
          <Image source={{ uri: item.imageURL }} style={styles.postImage} />
          <Text style={styles.postTitle}>{item.title}</Text>
          <Text style={styles.likesCount}>{item.likes.length} likes</Text>
        </View>
      </Link>
  );

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
                {/*<Pressable style={styles.clearButton} onPress={clearLocalStorage}>*/}
                {/*  <Text style={styles.clearButtonText}>Clear Cache</Text>*/}
                {/*</Pressable>*/}
                <Text style={styles.postsTitle}>My posts</Text>
                <FlatList
                    data={userPosts}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    style={styles.postList}
                />
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
  postsTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
  },
  postList: {
    marginTop: 20,
    marginLeft: 20,
  },
  postItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  postImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  postTitle: {
    fontSize: 16,
    flex: 1,
  },
  likesCount: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
});
