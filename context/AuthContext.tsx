import { createContext } from "react";
interface AuthProps {
  authState?: {
    token: string | null;
    authenticated: boolean | null;
  };
  onRegister?: (
    email: string,
    password: string,
    username: string
  ) => Promise<any>;
  onLogin?: (email: string, password: string) => Promise<any>;
  onLogout?: () => Promise<any>;
}
const AuthContext = createContext<AuthProps>({
  authState: { token: null, authenticated: null },
  onRegister: async () => {},
  onLogin: async () => {},
  onLogout: async () => {},
});
