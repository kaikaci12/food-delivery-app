import { createContext } from "react";

// Define the AuthProps interface for the context
export interface AuthProps {
  authState: {
    token: string | null;
    user: any | null;
  };
  onRegister: (
    email: string,
    password: string,
    username: string
  ) => Promise<void>;
  onLogin: (email: string, password: string) => Promise<void>;
  onLogout: () => void;
}

export const AuthContext = createContext<AuthProps>({
  authState: { token: null, user: null },
  onRegister: async () => {},
  onLogin: async () => {},
  onLogout: () => {},
});
