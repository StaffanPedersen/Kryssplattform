import AsyncStorage from "@react-native-async-storage/async-storage";

// Code from lecture or modified code from lecture

export const storeData = async (key: string, data: string) => {
  try {
    await AsyncStorage.setItem(key, data);
  } catch (e) {
  }
};

export const getData = async (key: string) => {
  try {
    const data = await AsyncStorage.getItem(key);
    if (data !== null) {
      console.log(data);
      return data;
    }
  } catch (e) {
    // console.error(e);
  }
};

export const deleteData = async (key: string) => {
  try {
    await AsyncStorage.removeItem(key);
  } catch (e) {
    console.error(e);
  }
};

export const getPostFromLocalById = async (id: string) => {
  try {
    const posts = await AsyncStorage.getItem("posts");
    if (posts !== null) {
      const parsedPosts = JSON.parse(posts);
      const post = parsedPosts.find((post: any) => post.id === id);
      return post;
    }
  } catch (e) {

  }
};

