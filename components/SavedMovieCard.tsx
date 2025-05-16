import { Link } from "expo-router"
import { Image, Text, TouchableOpacity, View } from 'react-native'

const SavedMovieCard = ({movie}: {movie: SavedMovie}) => {

  return (
    <Link href={`/movies/${movie.movie_id}`} asChild>
        <TouchableOpacity className='flex flex-row items-center rounded-lg bg-dark-100'>
            <Image source={{ uri: movie.poster_url}} resizeMode="stretch"  className="w-32 h-48 rounded-lg"/>
            <View className="flex-1 px-3">
              <Text ellipsizeMode="tail" className="text-bold text-light-100 mx-auto text-wrap" numberOfLines={1}>{movie.title}</Text>
            </View>
        </TouchableOpacity>
    </Link>
  )
}

export default SavedMovieCard