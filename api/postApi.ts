// Code from lecture or modified code from lecture
import { PostData } from "@/utils/postData";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDoc,
  getDocs,
  orderBy,
  query,
  QueryDocumentSnapshot,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { db, getDownloadUrl } from "@/firebaseConfig";
import { uploadImageToFirebase } from "./imageApi";''
import {deleteData, getData, storeData} from "@/utils/local_storage";

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
export const getPaginatedPosts = async (
    getFromDoc: QueryDocumentSnapshot<DocumentData> | null
) => {
  if (getFromDoc) {
    const next = query(
        collection(db, "posts"),
        orderBy("title", "desc"),
        startAfter(getFromDoc)
    );
    const querySnapshots = await getDocs(next);

    const last = querySnapshots.docs[querySnapshots.docs.length - 1];
    const result = querySnapshots.docs.map((doc) => {
      console.log(doc.data());
      return { ...doc.data(), id: doc.id } as PostData;
    });
    return { result, last };
  }
  const first = query(
      collection(db, "posts"),
      orderBy("title", "desc")
  );
  const querySnapshots = await getDocs(first);

  const last = querySnapshots.docs[querySnapshots.docs.length - 1];
  const result = querySnapshots.docs.map((doc) => {
    console.log(doc.data());
    return { ...doc.data(), id: doc.id } as PostData;
  });
  return { result, last };
};

export const getPostById = async (id: string) => {
  const specificPost = await getDoc(doc(db, "posts", id));
  console.log("post by spesific id", specificPost.data());
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
