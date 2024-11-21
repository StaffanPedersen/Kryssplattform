import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { PostData } from '@/utils/postData';
import * as postApi from '@/api/postApi';

interface PostContextProps {
    posts: PostData[];
    updatePost: (updatedPost: PostData) => void;
    fetchPosts: () => Promise<void>;
    addPost: (newPost: PostData) => void;
}

const PostContext = createContext<PostContextProps | undefined>(undefined);

interface PostProviderProps {
    children: ReactNode;
}

export const PostProvider: React.FC<PostProviderProps> = ({ children }) => {
    const [posts, setPosts] = useState<PostData[]>([]);

    const fetchPosts = async () => {
        const fetchedPosts = await postApi.getAllPosts();
        setPosts(fetchedPosts);
    };

    const updatePost = (updatedPost: PostData) => {
        setPosts((prevPosts) =>
            prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post))
        );
    };

    const addPost = (newPost: PostData) => {
        setPosts((prevPosts) => [newPost, ...prevPosts]);
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    return (
        <PostContext.Provider value={{ posts, updatePost, fetchPosts, addPost }}>
            {children}
        </PostContext.Provider>
    );
};

export const usePosts = () => {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error('usePosts must be used within a PostProvider');
    }
    return context;
};
