import { useAuthSession } from "@/providers/authctx";
import { Redirect, Stack } from "expo-router";
import { NavigationContainer } from '@react-navigation/native';
import { Text, View } from "react-native";
import { PostProvider } from '@/providers/postctx';

export default function RootLayout() {
    const { userNameSession, isLoading, user } = useAuthSession();

    if (isLoading) {
        return (
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Text>Loading...</Text>
            </View>
        );
    }

    if (!user) {
        return <Redirect href="../authenticated/authentication" />;
    }

    return (
        <NavigationContainer>
            <PostProvider>
                <Stack>
                    <Stack.Screen
                        name="(tabs)"
                        options={{
                            headerShown: false,
                            title: "Tilbake",
                            animation: "slide_from_left",
                        }}
                    />
                    <Stack.Screen
                        name="index"
                        options={{
                            title: "Home",
                            headerStyle: {
                                backgroundColor: '#f4511e',
                            },
                            headerTintColor: '#d7d1d1',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                    <Stack.Screen
                        name="postDetails/[id]"
                        options={{
                            headerStyle: {
                                backgroundColor: '#f4511e',
                            },
                            headerTintColor: '#d7d1d1',
                            headerTitleStyle: {
                                fontWeight: 'bold',
                            },
                        }}
                    />
                </Stack>
            </PostProvider>
        </NavigationContainer>
    );
}
