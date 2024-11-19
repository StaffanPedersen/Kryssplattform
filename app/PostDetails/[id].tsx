import { useRouter } from "expo-router";
import { Pressable, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import { useEffect, useState } from "react";
import { Stack, useLocalSearchParams } from "expo-router";
import PublicPost from "@/components/PublicPost";
import { PostData } from "@/utils/postData";
import * as postApi from "@/api/postApi";
import { getPostFromLocalById } from "@/utils/local_storage";

const PostDetails = () => {
    const router = useRouter();
    const { id } = useLocalSearchParams();
    const [post, setPost] = useState<PostData | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPostData = async () => {
        const post = await getPostFromLocalById(id as string);
        if (post) {
            setPost(post);
        }
    };

    const fetchPostFromBackend = async () => {
        try {
            const backendPost = await postApi.getPostById(id as string);
            if (backendPost) {
                setPost(backendPost);
            }
        } catch (error) {
            console.error("Failed to fetch post data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPostFromBackend();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Stack.Screen
                options={{
                    headerTitle: (props) => <Text>Post Details</Text>,
                }}
            />
            <Pressable onPress={() => router.back()} style={styles.returnButton}>
                <Text style={styles.returnButtonText}>Return</Text>
            </Pressable>
            {loading ? (
                <ActivityIndicator size="large" color="#0000ff" />
            ) : (
                post && <PublicPost postData={post} resizeMode="contain" />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    returnButton: {
        padding: 10,
        backgroundColor: "#007bff",
        borderRadius: 5,
        margin: 10,
    },
    returnButtonText: {
        color: "white",
        textAlign: "center",
    },
});

export default PostDetails;
