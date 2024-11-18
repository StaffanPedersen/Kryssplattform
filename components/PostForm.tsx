import { PostData } from "@/utils/postData";
import { useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  TextInput,
  Text,
  View,
  Image,
  Modal,
  ScrollView,
} from "react-native";
import { EvilIcons } from "@expo/vector-icons";
import SelectImageModal from "./SelectImageModal";

import * as Location from "expo-location";
import * as postApi from "@/api/postApi";
import { useAuthSession } from "@/providers/authctx";
import { LocationObjectCoords } from "expo-location";
import {uuidv4} from "@firebase/util";

type PostFormProps = {
  addNewPost: (newPost?: PostData) => void;
  closeModal: () => void;
};

export default function PostForm({ addNewPost, closeModal }: PostFormProps) {
  const [titleText, setTitleText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [hashtagText, setHashtagText] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const { userNameSession, user } = useAuthSession();

  const [statusText, setStatusText] = useState<string | null>(null);
  const [location, setLocation] = useState<Location.LocationGeocodedAddress | null>(null);

  const postCoordinatesData = useRef<Location.LocationObjectCoords | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setStatusText("Permission to access location was denied");
        return;
      }
      setStatusText(null); // Clear any previous status text
    })();
  }, []);

  const getLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      setStatusText("Permission to access location was denied");
      setLocation(null);
      postCoordinatesData.current = null;
      return;
    }

    try {
      const location = await Location.getCurrentPositionAsync();
      postCoordinatesData.current = location.coords;
      const locationAddress = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
      setLocation(locationAddress[0]);
    } catch (error) {
      setStatusText("Failed to get location");
      setLocation(null);
      postCoordinatesData.current = null;
    }
  };

  let text = "Fetching location...";
  if (statusText) {
    text = statusText;
  } else if (location) {
    text = `${location.street ?? ""} ${location.streetNumber ?? ""} - ${location.city ?? ""}, ${location.country ?? ""}`;
  }

  return (
      <View style={styles.mainContainer}>
        <ScrollView
            keyboardDismissMode="interactive"
            automaticallyAdjustKeyboardInsets
        >
          <View style={styles.contentContainer}>
            <Modal visible={isCameraOpen} animationType="slide">
              <SelectImageModal
                  closeModal={() => {
                    setIsCameraOpen(false);
                    getLocation();
                  }}
                  setImage={setImage}
              />
            </Modal>
            <Pressable
                onPress={() => setIsCameraOpen(true)}
                style={styles.addImageBox}
                accessibilityLabel="Add or change image"
            >
              {image ? (
                  <Image
                      source={{ uri: image }}
                      style={{ resizeMode: "cover", width: "100%", height: 300 }}
                      alt="Selected image"
                  />
              ) : (
                  <EvilIcons name="image" size={80} color="gray" />
              )}
            </Pressable>
            <Text>{text}</Text>
            <View style={styles.textFieldContainer}>
              <Text style={styles.text}>Tittel</Text>
              <TextInput
                  onChangeText={setTitleText}
                  value={titleText}
                  style={styles.textfield}
                  placeholder="Skriv inn tittel"
              />
            </View>
            <View style={styles.textFieldContainer}>
              <Text style={styles.text}>Beskrivelse</Text>
              <TextInput
                  multiline
                  numberOfLines={3}
                  onChangeText={setDescriptionText}
                  value={descriptionText}
                  style={[styles.textfield, { height: 84 }]}
                  placeholder="Skriv inn beskrivelse"
              />
            </View>
            <View style={styles.textFieldContainer}>
              <Text style={styles.text}>Hashtags</Text>
              <TextInput
                  onChangeText={setHashtagText}
                  value={hashtagText}
                  style={styles.textfield}
                  placeholder="#kultur #natur #mat"
              />
            </View>
            <View style={styles.buttonContainer}>
              <Pressable
                  style={styles.primaryButton}
                  onPress={async () => {
                    const newPost: PostData = {
                      id: uuidv4(),
                      title: titleText,
                      description: descriptionText,
                      hashtags: hashtagText,
                      author: userNameSession || "Anonym",
                      authorId: user?.uid || "unknown",
                      isLiked: false,
                      imageURL: image || "",
                      postCoordinates: postCoordinatesData.current,
                      comments: [],
                      likes: [],
                    };

                    await postApi.createPost(newPost);
                    addNewPost(newPost);
                    setTitleText("");
                    setDescriptionText("");
                    setHashtagText("");
                    setImage(null); // Clear image after posting
                  }}
                  accessibilityLabel="Add post"
              >
                <Text style={{ color: "white" }}>Legg til post</Text>
              </Pressable>
              <Pressable
                  style={styles.secondaryButton}
                  onPress={closeModal}
                  accessibilityLabel="Cancel and close form"
              >
                <Text style={{ color: "#412E25" }}>Avbryt</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    height: "100%",
    paddingTop: 72,
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    width: "100%",
    flexDirection: "column",
    paddingHorizontal: 20,
  },
  textFieldContainer: {
    paddingTop: 8,
  },
  addImageBox: {
    borderRadius: 10,
    overflow: "hidden",
    width: "100%",
    height: 300,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  textfield: {
    borderWidth: 1,
    padding: 10,
    marginTop: 2,
    borderRadius: 5,
    fontSize: 14,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  primaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    backgroundColor: "#0096C7",
  },
  secondaryButton: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "gray",
  },
});
