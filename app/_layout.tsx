// app/_layout.tsx
import { Stack, Slot } from 'expo-router';
import { useAuthSession } from '@/providers/authctx';
import { Text, View, StyleSheet } from 'react-native';

export const unstable_settings = {
    initialRouteName: 'welcomePage',
};

export default function RootLayout() {
    const { user, isLoading, userNameSession } = useAuthSession();

    if (isLoading) {
        // Optionally, you can return a loading indicator here
        return null;
    }

    return (
        <Stack
            initialRouteName={unstable_settings.initialRouteName}
            screenOptions={{
                headerStyle: {
                    backgroundColor: '#f4511e',
                },
                headerTintColor: '#d7d1d1',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            {user ? (
                <>
                    <Stack.Screen name="welcomePage" />
                    <Slot />
                </>
            ) : (
                <Stack.Screen name="authentication" />
            )}
        </Stack>
    );
}

const styles = StyleSheet.create({
    headerRightContainer: {
        marginRight: 10,
    },
    headerRightText: {
        color: '#d7d1d1',
        fontWeight: 'bold',
    },
});
