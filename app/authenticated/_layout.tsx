// Code from lecture or modified code from lecture
import { rAuthSessionProvider as AuthSessionProvider } from '../../providers/authctx';
import { Slot } from 'expo-router';

export default function AuthLayout() {
    return (
        <AuthSessionProvider>
            <Slot />
        </AuthSessionProvider>
    );
}
