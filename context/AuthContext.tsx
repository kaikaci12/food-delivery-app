import { createContext } from "react";
export interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
  };
  onRegister?: (email: string, password: string, username: string) => void;
  onLogin?: (email: string, password: string) => void;
  onLogout?: () => void;
}
export const AuthContext = createContext<AuthProps>({
  authState: { token: null, authenticated: null },
  onRegister: async () => {},
  onLogin: async () => {},
  onLogout: async () => {},
});
