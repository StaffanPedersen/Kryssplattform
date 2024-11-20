// Code from lecture or modified code from lecture
import { Tabs } from "expo-router";
import AntDesign from "@expo/vector-icons/AntDesign";
import { Text, View } from "react-native";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const TabsLayout = () => {
    return (
        <Tabs
            screenOptions={{
                tabBarShowLabel: true,
                tabBarStyle: {
                    position: 'absolute',
                    height: 60,
                    paddingBottom: 10,
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="home" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "black",
                                }}
                            >
                                Hovedside
                            </Text>
                            <Text
                                style={{
                                    fontSize: 20,
                                    fontWeight: "bold",
                                    color: "black",
                                    marginLeft: 10,
                                }}
                            >
                                ArtVista
                            </Text>
                        </View>
                    ),
                    headerStyle: {
                        backgroundColor: "#b67272",
                    },
                    headerTintColor: '#d7d1d1',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                }}
            />
            <Tabs.Screen
                name="postsMapPage"
                options={{
                    title: "Map",
                    tabBarIcon: ({ color, size }) => (
                        <FontAwesome5 name="map" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "black",
                            }}
                        >
                            Kart
                        </Text>
                    ),
                }}
            />
            <Tabs.Screen
                name="profilePage"
                options={{
                    title: "Profil",
                    tabBarIcon: ({ color, size }) => (
                        <AntDesign name="user" size={size} color={color} />
                    ),
                    headerTitle: () => (
                        <Text
                            style={{
                                fontSize: 20,
                                fontWeight: "bold",
                                color: "black",
                            }}
                        >
                            Din profil
                        </Text>
                    ),
                }}
            />
        </Tabs>
    );
};

export default TabsLayout;
