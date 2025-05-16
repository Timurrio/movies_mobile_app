import { account, appwriteLoginUser, appwriteLogoutUser, appwriteRegisterUser, getCurrentUser } from "@/services/appwrite";
import { AuthContext } from "@/services/auth";
import { Models } from "appwrite";
import { Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import "./globals.css";

export default function RootLayout() {

  
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = async () => {
    try {
      setIsLoading(true)
      const accountDetails = await account.get();
      setUser(accountDetails);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const loginUser = async (email:string, password:string) => {
    try {
      setIsLoading(true)
      await appwriteLoginUser(email, password)
      const userRes = await getCurrentUser()
      setUser(userRes)
    } catch(error) {
      console.log(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const registerUser = async (email:string, password: string, name: string) => {
    try {
      setIsLoading(true)
      const registerRes = await appwriteRegisterUser(email, password, name)
      if(registerRes) {
        await loginUser(email, password)        
      }
    } catch(error) {
      console.log(error)
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logoutUser = async () => {
      try {
        setIsLoading(true)
        await appwriteLogoutUser()
      } catch(error) {
        console.log(error)
        throw error
      } finally {
        setIsLoading(false)
        setUser(null)
      }
  }

  useEffect(() => {
    refreshUser();
  }, []);



  return (
  <>
    <AuthContext.Provider value={{ user, loginUser, registerUser, logoutUser, isLoading, refreshUser }}>
      <StatusBar hidden={true}/>
      <Stack>
        <Stack.Screen 
          name="(tabs)" 
          options={{headerShown: false}}

        />
        <Stack.Screen
          name="movies/[id]"
          options={{headerShown: false}}
        />
      </Stack>
    </AuthContext.Provider>
  </>
  )
}
