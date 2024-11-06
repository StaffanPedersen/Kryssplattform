import { AuthSessionProvider } from "../../../eksamen1/Kryssplattform/providers/authctx";
import { Slot, Stack } from "expo-router";

import "../../../eksamen1/Kryssplattform/global.css";

export default function RootLayout() {
  return (
    <AuthSessionProvider >
      <Slot />
    </AuthSessionProvider>
  );
}
