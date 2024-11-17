import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const TabsLayout = () => {
    return (
        <Tabs>
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <AntDesign name="home" size={24} color={color} />
                    ),
                    headerTitle(props) {
                        return (
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "black",
                                }}
                            >
                                Hjemmeside
                            </Text>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="postsMapPage"
                options={{
                    title: "Map",
                    tabBarIcon: ({ color, focused }) => (
                        <FontAwesome5 name="map" size={24} color={color} />
                    ),
                    headerTitle(props) {
                        return (
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "black",
                                }}
                            >
                                Kart
                            </Text>
                        );
                    },
                }}
            />
            <Tabs.Screen
                name="profilePage"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, focused }) => (
                        <AntDesign name="user" size={24} color={color} />
                    ),
                    headerTitle(props) {
                        return (
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "black",
                                }}
                            >
                                Profilside
                            </Text>
                        );
                    },
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
