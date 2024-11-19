import { View, Text, Image, StyleSheet } from "react-native";
import { PostData } from "@/utils/postData";

type PublicPostProps = {
    postData: PostData;
    resizeMode: "cover" | "contain";
};

export default function PublicPost({ postData, resizeMode }: PublicPostProps) {
    return (
        <View style={styles.postContainer}>
            <Image style={styles.postImage} source={{ uri: postData.imageURL }} resizeMode={resizeMode} />
            <View style={styles.textContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.postTitle}>{postData.title}</Text>
                </View>
                <Text style={styles.postContent}>{postData.description}</Text>
                <View style={styles.bottomContainer}>
                    <Text style={styles.postHashtags}>{postData.hashtags}</Text>
                    <Text style={styles.authorText}>{postData.author}</Text>
                    <View
                        style={{
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                        }}
                    />
                </View>
            </View>
        </View>
    );
}

// components/PublicPost.tsx
const styles = StyleSheet.create({
    postContainer: {
        backgroundColor: "white",
        shadowOffset: { width: 0, height: 6 },
        shadowColor: "black",
        shadowOpacity: 0.05,
        shadowRadius: 8,
        borderRadius: 10,
        flex: 1,
        margin: 10,
        width: "100%",
    },
    postImage: {
        height: 250,
        width: "100%",
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
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
