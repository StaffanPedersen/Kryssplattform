import React, { createContext, useContext, useEffect, useState } from "react";
import { PostData } from "@/utils/postData";
import { getAllPosts, toggleLikePost } from "@/api/postApi";

type PostContextType = {
    posts: PostData[];
    toggleLike: (id: string) => void;
    fetchPosts: () => void;
};

const PostContext = createContext<PostContextType | undefined>(undefined);

export const usePostContext = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePostContext must be used within a PostProvider");
    }
    return context;
};

export const PostProvider: React.FC<{ children: React.ReactNode, user: any }> = ({ children, user }) => {
    const [posts, setPosts] = useState<PostData[]>([]);

    const fetchPosts = async () => {
        const fetchedPosts = await getAllPosts();
        setPosts(fetchedPosts);
    };

    const toggleLike = async (id: string) => {
        console.log(`Toggling like for post with id: ${id} by user: ${user?.uid}`);
        await toggleLikePost(id, user?.uid ?? "");
        fetchPosts();
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <PostContext.Provider value={{ posts, toggleLike, fetchPosts }}>
            {children}
        </PostContext.Provider>
    );
};