import { Models } from "appwrite";
import { createContext, useContext } from "react";


interface AuthContextType {
  user: Models.User<Models.Preferences> | null;
  isLoading: boolean;
  registerUser: (email:string, password:string, name:string) => Promise<void>;
  loginUser: (email:string, password:string) => Promise<void>;
  logoutUser: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);



export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
