import React, { useEffect, useState } from "react";
import { View, FlatList, RefreshControl, Platform, StyleSheet, Text } from "react-native";
import { getAllPosts } from "@/api/postApi";
import PublicPost from "../components/PublicPost";
import { PostData } from "@/utils/postData";
import { useAuthSession } from "@/providers/authctx";
import { useRouter, Link } from "expo-router";
import HkButton from "../components/HkButton";
import '../global.css';
import { getData, storeData } from "@/utils/local_storage";

const TopBanner = () => (
    <View style={[styles.banner, Platform.OS !== 'web' && styles.fullWidth]}>
        <Text style={styles.bannerText}>ArtVista</Text>
    </View>
);

const BottomBanner = ({ onLoginPress }: { onLoginPress: () => void }) => (
    <View style={[styles.banner, Platform.OS !== 'web' && styles.fullWidth]}>
        <View style={styles.loginButton}>
            <HkButton
                title="Login"
                onPress={onLoginPress}
                theme="primary"
            />
        </View>
    </View>
);

const Welcome = () => {
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

    return (
        <View style={Platform.OS === 'web' ? styles.container_web : styles.container}>
            <TopBanner />
            <FlatList
                style={{
                    width: "100%",
                    paddingHorizontal: 20,
                }}
                data={posts}
                keyExtractor={(item: PostData) => item.id}
                renderItem={({ item }) => (
                    <Link href={{ pathname: `./PostDetails/[id]`, params: { id: item.id } }}>
                        <PublicPost postData={item} resizeMode="cover" />
                    </Link>
                )}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={fetchPosts} />
                }
            />
            {!user && (
                <BottomBanner onLoginPress={() => {
                    console.log("Navigating to authentication page");
                    router.push("./authenticated/authentication/");
                }} />
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
        flex: 1,
        width: "100%",
        paddingHorizontal: 20,
    },
    banner: {
        backgroundColor: "#b67272",
        padding: 10,
        alignItems: "center",
    },
    fullWidth: {
        width: "100%",
    },
    bannerText: {
        color: "white",
        fontSize: 16,
    },
    loginButton: {
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: "#007bff",
        borderRadius: 5,
    },
});

export default Welcome;
