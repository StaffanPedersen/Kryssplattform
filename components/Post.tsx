import { View, Text, Image, StyleSheet, Pressable } from "react-native";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Link } from "expo-router";
import { PostData } from "@/utils/postData";
import { useAuthSession } from "@/providers/authctx";
import { usePostContext } from "@/providers/PostContext";
import { useState } from "react";

type PostProps = {
    postData: PostData;
    disabled?: boolean;
};

export default function Post({ postData, disabled }: PostProps) {
    const { user } = useAuthSession();
    const { toggleLike } = usePostContext();

    const [isLiked, setIsLiked] = useState(
        postData.likes?.includes(user?.uid ?? "") ?? false
    );

    const [numLikes, setNumLikes] = useState(postData.likes?.length ?? 0);

    const handleLikeToggle = async () => {
        if (!disabled) {
            if (isLiked) {
                setNumLikes(numLikes - 1);
                setIsLiked(false);
            } else {
                setNumLikes(numLikes + 1);
                setIsLiked(true);
            }
            await toggleLike(postData.id);
        }
    };

    return (
        <Link href={`/authenticated/postDetails/${postData.id}`} asChild>
            <Pressable>
                <View style={styles.postContainer}>
                    <Image style={styles.postImage} source={{ uri: postData.imageURL }} />
                    <View style={styles.textContainer}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.postTitle}>{postData.title}</Text>
                            <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
                                <Text>{numLikes}</Text>
                                <Pressable onPress={handleLikeToggle} disabled={disabled}>
                                    <AntDesign name="smileo" size={24} color={isLiked ? "#23C9FF" : "gray"} />
                                </Pressable>
                            </View>
                        </View>
                        <Text style={styles.postContent}>{postData.description}</Text>
                        <View style={styles.bottomContainer}>
                            <Text style={styles.postHashtags}>{postData.hashtags}</Text>
                            <Text style={styles.authorText}>{postData.author}</Text>
                        </View>
                    </View>
                </View>
            </Pressable>
        </Link>
    );
}

const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "white",
        shadowOffset: { width: 0, height: 6 },
        shadowColor: "black",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderRadius: 10,
    },
    postImage: {
        height: 250,
        width: "100%",
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        resizeMode: "cover",
    },
    textContainer: {
        paddingHorizontal: 10,
        paddingTop: 16,
    },
    titleContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    postTitle: {
        fontSize: 20,
        fontWeight: "bold",
    },
    postContent: {
        fontSize: 14,
        paddingTop: 6,
        color: "gray",
    },
    bottomContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingBottom: 10,
    },
    postHashtags: {
        paddingTop: 16,
        fontSize: 12,
        color: "gray",
    },
    authorText: {
        fontSize: 12,
        color: "gray",
        textDecorationLine: "underline",
    },
});