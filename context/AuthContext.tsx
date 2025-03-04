import { createContext } from "react";
export interface AuthProps {
  authState?: {
    token: string | null;
    user: any | null;
  };
  onRegister?: (email: string, password: string, username: string) => void;
  onLogin?: (email: string, password: string) => void;
  onLogout?: () => void;
}
export const AuthContext = createContext<AuthProps>({
  authState: { token: null, user: null },
  onRegister: async () => {},
  onLogin: async () => {},
  onLogout: async () => {},
});
