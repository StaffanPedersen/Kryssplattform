import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { getAllPosts } from "../api/postApi";
import Post from "../components/Post";
import { PostData } from "../utils/postData";
import { useAuthSession } from "../providers/authctx";
import { useRouter } from "expo-router";
import HkButton from "../components/HkButton";
import '../global.css';
import { getData, storeData } from "@/utils/local_storage";

const Index = () => {
    const { user } = useAuthSession();
    const router = useRouter();
    const [posts, setPosts] = useState<PostData[]>([]);
    const [refreshing, setRefreshing] = useState<boolean>(false);

    useEffect(() => {
        if (user) {
            router.replace("/authenticated/(app)/(tabs)");
        }
    }, [user]);

    const fetchPosts = async () => {
        setRefreshing(true);
        const fetchedPosts = await getAllPosts();
        const localPosts = await getData("posts");
        const parsedLocalPosts: PostData[] = localPosts ? JSON.parse(localPosts) : [];

        const allPosts = [...fetchedPosts, ...parsedLocalPosts];
        const uniquePosts = Array.from(new Set(allPosts.map(post => post.id)))
            .map(id => allPosts.find(post => post.id === id))
            .filter((post): post is PostData => post !== undefined);

        setPosts(uniquePosts);
        setRefreshing(false);
        storeData("posts", JSON.stringify(uniquePosts));
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const toggleLike = (id: string) => {
        if (user) {
            // Implement the logic to toggle like
        } else {
            console.log("User must be logged in to like posts");
        }
    };

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item: PostData) => item.id} // Ensure unique keys
                renderItem={({ item }) => (
                    <Post postData={item} toggleLike={toggleLike} disabled={!user} />
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />
                }
            />
            {!user && (
                <HkButton
                    title="Login"
                    onPress={() => {
                        console.log("Navigating to authentication page");
                        router.push("/authentication");
                    }}
                    theme="primary"
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },

    container_web: {
        maxWidth: 1200,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
});

export default Index;
