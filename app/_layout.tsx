import { rAuthSessionProvider as AuthSessionProvider, useAuthSession } from '../providers/authctx';
import { Slot, useRouter } from 'expo-router';
import { View, Pressable, Text, StyleSheet } from 'react-native';
import {PostProvider} from "@/providers/PostContext";

function LoginButton() {
    const { user } = useAuthSession();
    const router = useRouter();

    if (user) {
        return null;
    }

    return (
        <View style={styles.bottomLayout}>
            <Pressable
                style={styles.loginButton}
                onPress={() => router.push('/authentication')}
            >
                <Text style={styles.buttonText}>Login</Text>
            </Pressable>
        </View>
    );
}

    export default function RootLayout() {
        return (
            <AuthSessionProvider>
                <PostProvider>
                    <Slot />
                </PostProvider>
            </AuthSessionProvider>
        );
}

    const styles = StyleSheet.create({
    bottomLayout: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'orange',
    padding: 10,
    alignItems: 'center',
},
    loginButton: {
    backgroundColor: 'blue',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        marginBottom: 20,
},
    buttonText: {
    color: 'white',
    fontWeight: 'bold',
},
});