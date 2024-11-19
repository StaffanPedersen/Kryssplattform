import {
    StyleSheet,
    View,
    Text,
    Pressable,
    FlatList,
    Modal,
    RefreshControl,
    TextInput,
    ActivityIndicator,
} from "react-native";

import { useEffect, useRef, useState } from "react";
import { Stack } from "expo-router";
import { getData, storeData } from "@/utils/local_storage";
import PostForm from "@/components/PostForm";
import UpsertUser from "@/components/UpsertUser";
import '../../../../global.css';

import { PostData } from "@/utils/postData";
import Post from "@/components/Post";
import Spacer from "@/components/Spacer";
import { useAuthSession } from "@/providers/authctx";
import * as postApi from "@/api/postApi";
import { DocumentData, QueryDocumentSnapshot } from "firebase/firestore";

export default function Index() {
    const [posts, setPosts] = useState<PostData[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUpsertUserModalOpen, setIsUpsertUserModalOpen] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [searchString, setSearchString] = useState("");
    const [loadingMore, setLoadingMore] = useState(false);

    const { userNameSession, signOut } = useAuthSession();

    const lastDocRef = useRef<QueryDocumentSnapshot<DocumentData, DocumentData> | null>(null);

    const getPostsFromLocal = async () => {
        const posts = await getData("posts");
        if (posts) {
            setPosts(JSON.parse(posts));
        }
    };

    const getPostsFromBackend = async (isLoadMore = false) => {
        setRefreshing(true);
        const { result: newPosts, last: lastDoc } = await postApi.getPaginatedPosts(
            lastDocRef.current
        );
        lastDocRef.current = lastDoc;

        const combinedPosts = [...posts, ...newPosts];

        const uniquePosts = Array.from(new Set(combinedPosts.map(post => post.id)))
            .map(id => combinedPosts.find(post => post.id === id))
            .filter((post): post is PostData => post !== undefined);

        setPosts(uniquePosts);
        setRefreshing(false);
    };

    useEffect(() => {
        const loadPosts = async () => {
            await getPostsFromLocal();
            await getPostsFromBackend();
        };
        loadPosts();
    }, []);

    const filterPosts = (posts: PostData[], searchString: string) => {
        if (!searchString) return posts;
        return posts.filter(post =>
                post.title.toLowerCase().includes(searchString.toLowerCase())
            // Ensure 'content' is a valid property or remove this line
            // post.content.toLowerCase().includes(searchString.toLowerCase())
        );
    };

    const filteredPosts = filterPosts(posts, searchString);

    return (
        <View style={styles.titleContainer}>
            <Stack.Screen
                options={{
                    headerRight: () => (
                        <Pressable
                            style={{ paddingRight: 6 }}
                            onPress={() => setIsModalOpen(true)}
                        >
                            <Text>Nytt innlegg</Text>
                        </Pressable>
                    ),
                }}
            />
            <Modal visible={isUpsertUserModalOpen} animationType="slide">
                <UpsertUser
                    closeModal={() => setIsUpsertUserModalOpen(false)}
                    createUserName={(name) => {
                        storeData("user", name);
                        setIsUpsertUserModalOpen(false);
                    }}
                />
            </Modal>
            <Modal visible={isModalOpen} animationType="slide">
                <PostForm
                    addNewPost={async () => {
                        await getPostsFromBackend();
                        setIsModalOpen(false);
                    }}
                    closeModal={() => setIsModalOpen(false)}
                />
            </Modal>
            <View
                style={{
                    width: "100%",
                    paddingHorizontal: 20,
                }}
            >
                <TextInput
                    style={{
                        borderWidth: 1,
                        padding: 10,
                        marginTop: 2,
                        borderRadius: 5,
                        width: "100%",
                    }}
                    value={searchString}
                    onChangeText={(text) => setSearchString(text)}
                />
            </View>
            <FlatList
                style={{
                    width: "100%",
                    paddingHorizontal: 20,
                }}
                data={filteredPosts}
                ListHeaderComponent={() => <Spacer height={10} />}
                ListFooterComponent={() => (
                    loadingMore ? <ActivityIndicator size="large" color="#0000ff" /> : <Spacer height={50} />
                )}
                ItemSeparatorComponent={() => <Spacer height={8} />}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={getPostsFromBackend}
                    />
                }
                onEndReached={() => getPostsFromBackend(true)}
                onEndReachedThreshold={0.5}
                renderItem={({ item }) => (
                    <Post
                        postData={item}
                        toggleLike={(id) => {
                            const tempPosts = posts.map((tempPost) => {
                                if (tempPost.id === id) {
                                    return { ...tempPost, isLiked: !tempPost.isLiked };
                                }
                                return tempPost;
                            });
                            setPosts(tempPosts);
                            storeData("posts", JSON.stringify(tempPosts));
                        }}
                    />
                )}
                keyExtractor={(item) => item.id}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    titleContainer: {
        alignItems: "center",
        justifyContent: "center",
        flex: 1,
    },
    textFieldContainer: {
        width: "100%",
        flexDirection: "column",
        gap: 10,
        paddingHorizontal: 20,
    },
    textfield: {
        borderWidth: 1,
    },
    stepContainer: {
        gap: 8,
        marginBottom: 8,
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: "absolute",
    },
    container_web: {
        maxWidth: 1200,
        alignSelf: 'center',
        paddingHorizontal: 20,
    },
});
