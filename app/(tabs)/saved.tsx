import SavedMovieCard from '@/components/SavedMovieCard'
import { icons } from '@/constants/icons'
import { getSavedMovies } from '@/services/appwrite'
import { useAuth } from '@/services/auth'
import useFetch from '@/services/useFetch'
import { useFocusEffect } from 'expo-router'
import { useCallback } from 'react'
import { ActivityIndicator, FlatList, Image, Text, View } from 'react-native'

const Saved = () => {
  const {user, isLoading: userLoading} = useAuth()

  const {data: movies, error: moviesError, loading: moviesLoading, refetch: fetchMovies} = useFetch(getSavedMovies)

  // useEffect( () => {
  //   fetchMovies()
  // }, [user])

  useFocusEffect(
    useCallback( () => {
      fetchMovies()
    }, [])
  )

  if(userLoading || moviesLoading){
    return(
    <View className='bg-primary flex-1 px-10'>
              <View className='flex justify-center items-center flex-1 flex-col gap-5'>
                  <ActivityIndicator size="large" color="#0000ff" />
              </View>
    </View>
    )
  }

  if(!userLoading && !user){
  return (
    <View className='bg-primary flex-1 px-10'>
          <View className='flex justify-center items-center flex-1 flex-col gap-5'>
            <Image source={icons.save} className='size-10' tintColor="#fff"/>
            <Text className='text-gray-500 text-base'>Login to see saved movies</Text>
          </View>
    </View>
  )}

  if(user) {
      return (
    <View className='bg-primary flex-1 px-8'> 
          <View className='flex justify-center items-center mt-20 flex-col gap-5 '>
            <Image source={icons.save} className='size-10' tintColor="#fff"/>
            <Text className='text-light-100 text-xl'>Saved movies</Text>
          
          </View>
            {
              movies && (
                <FlatList
                  data={movies}
                  renderItem={({item,index}) => (
                    <SavedMovieCard movie={item}/>
                  )}
                  keyExtractor={ (item) => item.movie_id.toString()}
                  numColumns={1}
                  className="mt-2 pb-32 w-full"
                  scrollEnabled={true}
                  contentContainerStyle={{paddingTop: 50 ,paddingBottom: 100, paddingRight: 10, justifyContent: "center", gap: 25}}
                />
              )
            }
    </View> 
  )
  }
}

export default Saved