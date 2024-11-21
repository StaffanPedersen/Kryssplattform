import React, { useEffect, useState, useCallback } from "react";
import { View, Text, Pressable, StyleSheet, Image, FlatList } from "react-native";
import { useAuthSession } from "@/providers/authctx";
import { Link } from "expo-router";
import { usePosts } from "@/providers/postctx";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useFocusEffect } from "@react-navigation/native";
import { PostData } from "@/utils/postData";
import * as postApi from "@/api/postApi";

const ProfilePage = () => {
  const { user, signOut } = useAuthSession();
  const { posts, fetchPosts } = usePosts();
  const [userPosts, setUserPosts] = useState<PostData[]>([]);

  const fetchUserPosts = useCallback(async () => {
    if (user) {
      await fetchPosts(); // Fetch the latest posts from the backend
      const filteredPosts = posts.filter((post) => post.authorId === user.uid);
      setUserPosts(filteredPosts);
    }
  }, [posts, user, fetchPosts]);

  useFocusEffect(
      useCallback(() => {
        fetchUserPosts();
      }, [fetchUserPosts])
  );

  const renderItem = ({ item }: { item: PostData }) => (
      <Link href={`/authenticated/postDetails/${item.id}`}>
        <View style={styles.postItem}>
          <Image source={{ uri: item.imageURL }} style={styles.postImage} />
          <Text style={styles.postTitle}>{item.title}</Text>
          <View style={styles.likesAndRating}>
            <Text style={styles.likesCount}>{item.likes.length} likes</Text>
            <View style={styles.ratingContainer}>
              <AntDesign name="star" size={16} color="#FFD700" />
              <Text style={styles.ratingText}>{item.averageRating?.toFixed(1) ?? "0.0"}</Text>
            </View>
          </View>
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
};

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
  likesAndRating: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  ratingText: {
    fontSize: 16,
    marginLeft: 5,
  },
});

export default ProfilePage;
