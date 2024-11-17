import { useAuthSession } from "@/providers/authctx";
import { Redirect, Stack } from "expo-router";
import { Text, View } from "react-native";

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
                <Text>Henter bruker...</Text>
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/authentication" />;
    }

    return (
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
    );
}
