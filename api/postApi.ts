import { PostData } from "@/utils/postData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, getDownloadUrl } from "@/firebaseConfig";
import { uploadImageToFirebase } from "./imageApi";
import { deleteData, getData, storeData } from "@/utils/local_storage";

export const createPost = async (post: PostData) => {
  try {
    const firebaseImage = await uploadImageToFirebase(post.imageURL);
    if (firebaseImage === "ERROR") {
      return;
    }
    const postImageDownloadUrl = await getDownloadUrl(firebaseImage);
    const postWithImageData: PostData = {
      ...post,
      imageURL: postImageDownloadUrl,
      authorId: post.authorId,
    };
    const docRef = await addDoc(collection(db, "posts"), postWithImageData);
    console.log("Document written with ID:", docRef.id);
  } catch (e) {
    console.log("Error adding document", e);
  }
};

export const getAllPosts = async () => {
  const queryResult = await getDocs(collection(db, "posts"));
  return queryResult.docs.map((doc) => {
    return { ...doc.data(), id: doc.id } as PostData;
  });
};

export const getPostById = async (id: string) => {
  const specificPost = await getDoc(doc(db, "posts", id));
  console.log("post by specific id", specificPost.data());
  return {
    ...specificPost.data(),
    id: specificPost.id,
  } as PostData;
};

export const deletePost = async (id: string, userId: string) => {
  try {
    const postRef = doc(db, "posts", id);
    const post = await getDoc(postRef);
    if (post.exists() && post.data()?.authorId === userId) {
      await deleteDoc(postRef);
      await deleteData(id);
      const localPosts = await getData("posts");
      const parsedLocalPosts: PostData[] = localPosts ? JSON.parse(localPosts) : [];
      const updatedLocalPosts = parsedLocalPosts.filter(post => post.id !== id);
      storeData("posts", JSON.stringify(updatedLocalPosts));
      console.log("Document successfully deleted!");
    } else {
      console.error("Error: User is not authorized to delete this post");
    }
  } catch (e) {
    console.error("Error removing document: ", e);
  }
};

export const toggleLikePost = async (id: string, userId: string) => {
  const postRef = doc(db, "posts", id);
  const post = await getDoc(postRef);
  if (post.data()?.likes) {
    const likes = post.data()!.likes;
    if (likes.includes(userId)) {
      await updateDoc(postRef, {
        likes: likes.filter((like: string) => like !== userId),
      });
    } else {
      await updateDoc(postRef, {
        likes: [...likes, userId],
      });
    }
  } else {
    await updateDoc(postRef, {
      likes: [userId],
    });
  }
};

export const ratePost = async (postId: string, rating: number, userId: string): Promise<PostData> => {
  const postRef = doc(db, "posts", postId);
  const postDoc = await getDoc(postRef);

  if (postDoc.exists()) {
    const postData = postDoc.data() as PostData;

    // Check if the user has already rated the post
    if (postData.userRating && postData.userRating[userId]) {
      throw new Error("User has already rated this post");
    }

    const newRatingsCount = (postData.ratingsCount ?? 0) + 1;
    const newAverageRating = ((postData.averageRating ?? 0) * (postData.ratingsCount ?? 0) + rating) / newRatingsCount;

    await updateDoc(postRef, {
      averageRating: newAverageRating,
      ratingsCount: newRatingsCount,
      [`userRating.${userId}`]: rating, // Store the user's rating
    });

    return { ...postData, averageRating: newAverageRating, ratingsCount: newRatingsCount, userRating: { ...postData.userRating, [userId]: rating } };
  } else {
    throw new Error("Post not found");
  }
};

export const getSortedPosts = async (isRising: boolean) => {
  try {
    const querySnapshot = await getDocs(
        query(
            collection(db, "posts"),
            orderBy("title", isRising ? "asc" : "desc")
        )
    );
    return querySnapshot.docs.map((doc) => {
      console.log(doc.data());
      return { ...doc.data(), id: doc.id } as PostData;
    });
  } catch (error) {
    console.log("Error getting sorted data: ", error);
    return [];
  }
};

export const getSearchedPosts = async (searchString: string) => {
  try {
    const endString = searchString + "\uf8ff";
    const querySnapshot = await getDocs(
        query(
            collection(db, "posts"),
            where("title", ">=", searchString),
            where("title", "<=", endString)
        )
    );
    return querySnapshot.docs.map((doc) => {
      console.log(doc.data());
      return { ...doc.data(), id: doc.id } as PostData;
    });
  } catch (error) {
    console.log("Error getting sorted data: ", error);
    return [];
  }
};

export const getLocalSearchedPosts = async (searchString: string) => {
  const queryResult = await getDocs(collection(db, "posts"));
  return queryResult.docs
      .map((doc) => {
        console.log(doc.data());
        return { ...doc.data(), id: doc.id } as PostData;
      })
      .filter(
          (post) =>
              post.title &&
              post.title.toLowerCase().includes(searchString.toLowerCase())
      );
};
