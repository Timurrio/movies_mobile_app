import { icons } from '@/constants/icons';
import { fetchMovieDetails } from '@/services/api';
import { addSavedMovie, getIsMovieSaved, removeSavedMovie } from '@/services/appwrite';
import useFetch from '@/services/useFetch';
import formatRevenue from '@/utils/formatRevenue';
import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface MovieInfoProps {
  label: string;
  value?: string | number | null;
}

const SaveMovieBtn = ({movie}:{movie: SavedMovie}) => {

  const [isSaved, setIsSaved] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log(movie)

    const checkSaved = async () => {
      try {
        const saved = await getIsMovieSaved(movie)
        setIsSaved(saved)
      } catch (error) {
        console.error('Check saved error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkSaved()
  }, [])

   const handlePress = async () => {
    setLoading(true)
    try {
      if (isSaved) {
        await removeSavedMovie(movie)
        setIsSaved(false)
      } else {
        await addSavedMovie(movie)
        setIsSaved(true)
      }
    } catch (error) {
      console.error('Toggle save error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <ActivityIndicator size="small" color="#fff" />
  }
  
  return(
  <TouchableOpacity className='mx-3' disabled={loading} onPress={ () => handlePress()}>
    <Image source={icons.save} tintColor={isSaved ? "yellow" : "white"} className='w-10 h-10'/>
  </TouchableOpacity>
  )
}

const MovieInfo = ({label, value} : MovieInfoProps) => (
  <View className='flex-col items-start justify-center mt-5'>
    <Text className='text-light-200 font-normal text-sm'>
      {label}
    </Text>
    <Text className='text-light-100 font-bold text-sm mt-2'>
      {value || "N/A"}
    </Text>
  </View>
)

const MovieDetails = () => {

  const {id} = useLocalSearchParams()

  const {data: movie, loading} = useFetch(() => fetchMovieDetails(id as string))

  return (
    <View className='bg-primary flex-1'>
      <ScrollView contentContainerStyle={{
        paddingBottom: 80,
      }}>

        <View>
          <Image 
            source={{uri: `https://image.tmdb.org/t/p/w500${movie?.poster_path}`}}
            className='w-full h-[550px]'
            resizeMode='stretch'
          />
        </View>

        <View className='flex-col items-start justify-center mt-5 px-5'>

          <Text className='text-white font-bold text-xl'>{movie?.title}</Text>
          <View className='flex-row items-center gap-x-1 mt-2'>
            <Text className='text-light-200 text-sm'>
              {movie?.release_date?.split("-")[0]}
            </Text>
            <Text className='text-light-200 text-sm'>
              {movie?.runtime}m
            </Text>

            
          </View>

          <View className='flex-row'>
              <View className='flex-row items-center bg-dark-100 px-2 py-1 rounded-md gap-x-1 mt-2'>
                <Image source={icons.star} className='size-4'/>
                <Text className='text-white font-bold text-sm'>
                  {Math.round(movie?.vote_average ?? 0)}/10
                </Text>
                <Text className='text-light-200 text-sm'>
                  ({movie?.vote_count} votes)
                </Text>
              
              </View>
              {
                  movie &&
                  <SaveMovieBtn movie={ {movie_id: movie.id, poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`||'https://placehold.co/600x400/1a1a1a/ffffff.png', title: movie.title}}/>            
              }
          </View>

          <MovieInfo label='Overview' value={movie?.overview}/>

          <MovieInfo label='Genres' value={movie?.genres?.map((g) => g.name).join(" - ") || "N/A"}/>

          <View className='flex flex-row justify-between w-1/2'>
            <MovieInfo label='Budget' value={formatRevenue(movie?.budget)}/>
            <MovieInfo label="Revenue" value={formatRevenue(movie?.revenue)}/>
          </View>

          <MovieInfo label='Production Companies' value={movie?.production_companies.map((c) => c.name).join(" - ") || "N/A"}/>

        </View>
      </ScrollView>

      <TouchableOpacity 
        className='absolute bottom-5 left-0 right-0 mx-5 bg-accent rounded-lg py-3.5 flex flex-row items-center justify-center z-50'
        onPress={router.back}  
      >
        <Image source={icons.arrow} className='size-5 mr-1 mt-0.5 rotate-180' tintColor="#fff"/>
        <Text className='text-white font-semibold text-base'> Go back</Text>
      </TouchableOpacity>
    </View>
  )
}

export default MovieDetails