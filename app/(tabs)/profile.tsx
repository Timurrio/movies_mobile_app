import { icons } from '@/constants/icons'
import { useAuth } from '@/services/auth'
import { useState } from 'react'
import { ActivityIndicator, Image, KeyboardAvoidingView, Platform, Text, TextInput, TouchableOpacity, View } from 'react-native'

const Profile = () => {

  const {isLoading: isUserLoading, user, loginUser, registerUser, logoutUser} = useAuth()
  const [isRegister, setIsRegister] = useState(true)

  // form data
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [error, setError] = useState<null|string>(null)

  const handleLogin = async () => {
    try {
      if(email && password) {
        await loginUser(email,password)
      }
    } catch(error: any) {
      if(error?.message) {
        setError(error.message)
      } else {
        setError("Unknown error during login.")
      }
    }
  }

  const handleRegistration = async () => {
    try {
      if(email && password && name) {
        await registerUser(email, password, name)
      }
    } catch(error: any) {
      if(error?.message) {
        setError(error.message)
      } else {
        setError("Unknown error during registration.")
      }
    }
  }

  const handleLogout = async () => {
    try {
      await logoutUser()
    } catch(error: any) {
      if(error?.message) {
        setError(error.message)
      } else {
        setError("Unknown error during logout.")
      }
    }
  }

  if(user){
    return (
      <View className='bg-primary flex-1  flex justify-center items-center px-10'>
        <View className='flex justify-center items-center w-[85%] flex-1 flex-col gap-5 '>
          <Image source={icons.person} className='size-10' tintColor="#fff"/>
          <Text className='text-light-200 text-base'>{user.name}</Text>
          <Text className='text-light-100 font-bold text-sm'>{user.email}</Text>
          <TouchableOpacity className='rounded-lg py-1 px-10 bg-accent mt-6' onPress={handleLogout}>
              <Text className='font-bold text-white  text-center py-3 '>
                Logout
              </Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  if(isUserLoading){
    return(
      <View className='bg-primary flex-1 px-10'>
          <View className='flex justify-center items-center flex-1 flex-col gap-5'>
              <ActivityIndicator size="large" color="#0000ff" />
          </View>
      </View>
    )
  }

  if(!isUserLoading || user === null){
    return (
    <KeyboardAvoidingView
       behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
       style={{ flex: 1}}
       contentContainerStyle={{backgroundColor: "#030014"}}
    >

      <View className='bg-primary flex-1 px-10 justify-center items-center '>
        <View className='flex flex-col w-[85%]  gap-5'>
          <Image source={icons.person} className='size-10 self-center' tintColor="#fff"/>
          <Text className='text-light-100 self-center text-xl'>Login or register new account</Text>
          <Text className='text-red-600 text-lg self-center py-2'>{error}</Text>
          <View className='flex flex-col mt-2'>
           { 
      isRegister 
           ?
          <>
            <Text className='text-light-100 pb-2'>Email: </Text>
            <TextInput 
              className='w-full  bg-dark-100 text-white rounded-lg px-5 py-4'
              placeholder='example@gmail.com' 
              inputMode='email'  
              placeholderTextColor="#a8b5db"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Text className='text-light-100 mt-5 pb-2'>Password: </Text>
            <TextInput 
              className='w-full  bg-dark-100 text-white rounded-lg px-5 py-4'
              placeholder='*****' 
              inputMode='text'  
              secureTextEntry={true}
              placeholderTextColor="#a8b5db"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity className='rounded-lg bg-accent mt-6' onPress={handleLogin}>
              <Text className='font-bold text-white  text-center py-3 '>
                Login
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity className='py-3' onPress={() => setIsRegister(prev => !prev)}>
              <Text className='font-bold text-accent text-center py-1'>
                I don`t have account yet
              </Text>
            </TouchableOpacity>

          </>
          :
          <>
            <Text className='text-light-100 pb-2'>Email: </Text>
            <TextInput 
              className='w-full  bg-dark-100 text-white rounded-lg px-5 py-4'
              placeholder='example@gmail.com' 
              inputMode='email'  
              placeholderTextColor="#a8b5db"
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Text className='text-light-100 mt-5 pb-2'>Password: </Text>
            <TextInput 
              className='w-full  bg-dark-100 text-white rounded-lg px-5 py-4'
              placeholder='*****' 
              inputMode='text'  
              secureTextEntry={true}
              placeholderTextColor="#a8b5db"
              value={password}
              onChangeText={(text) => setPassword(text)}
            />

            <Text className='text-light-100 mt-5 pb-2'>Name: </Text>
            <TextInput 
              className='w-full  bg-dark-100 text-white rounded-lg px-5 py-4'
              placeholder='John Doe' 
              inputMode='text'  
              placeholderTextColor="#a8b5db"
              value={name}
              onChangeText={(text) => setName(text)}
            />

            <TouchableOpacity onPress={handleRegistration}  className='rounded-lg bg-accent mt-6' >
              <Text className='font-bold text-white  text-center py-3'>
                Register
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className='py-3' onPress={() => setIsRegister(prev => !prev)}>
              <Text className='font-bold text-accent text-center py-1'>
                I don`t have account yet
              </Text>
            </TouchableOpacity>
          </>
            }
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
    )
  }


}

export default Profile