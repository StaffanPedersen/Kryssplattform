// app/authenticated/_layout.tsx
import { rAuthSessionProvider as AuthSessionProvider } from '../providers/authctx';
import { Slot } from 'expo-router';

export default function RootLayout() {
    return (
        <AuthSessionProvider>
            <Slot />
        </AuthSessionProvider>
    );
}
