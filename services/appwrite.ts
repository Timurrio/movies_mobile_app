import { Account, Client, Databases, ID, Query } from "appwrite";

const DATABASE_ID = process.env.EXPO_PUBLIC_APPWRITE_DATABASE_ID!;
const METRICS_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_METRICS_COLLECTION_ID!;
const SAVED_MOVIES_COLLECTION_ID = process.env.EXPO_PUBLIC_APPWRITE_SAVED_MOVIES_COLLECTION_ID!;

export const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject(process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID!)

export const database = new Databases(client)
export const account = new Account(client)


export const getIsMovieSaved = async (movie: SavedMovie) => {
  try {
    const user = await account.get()
    if(user){
        const movieData = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, [
          Query.equal("user_id", user.$id),
          Query.equal("movie_id", movie.movie_id)
        ])
        const isSaved = movieData.total > 0 ? true : false
        return isSaved
    } else {
      return null
    }
  } catch (error) {
    console.log("getIsMovieSaved error:", error)
    return null
  }
}

export const getSavedMovies = async () => {
  try {
    const user = await account.get()
    if(user){
      const savedMovies = await database.listDocuments(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, [
        Query.equal("user_id", user.$id)
      ])
      return savedMovies.documents as unknown as SavedMovie[]
    } else {
    return null}
  } catch(error) {
    console.log("Get saved movies error:", error)
    return null
  }
} 

export const addSavedMovie = async (movie: SavedMovie) => {
  try {
    const user = await account.get()
    if(user) {
       const savedMovie = await database.createDocument(
                    DATABASE_ID,
                    SAVED_MOVIES_COLLECTION_ID,
                    ID.unique(),
                    {
                        user_id: user.$id,
                        movie_id: movie.movie_id,
                        title: movie.title,
                        poster_url: movie.poster_url
                    }
                )
        console.log(savedMovie)
        }
    }
   catch (error) {
    console.log("Add saved movie error:", error)
  }
}

export const removeSavedMovie = async (movie: SavedMovie) => {
  try {
    const user = await account.get()
    if(user) {
      const savedDocument = await database.listDocuments( DATABASE_ID,
      SAVED_MOVIES_COLLECTION_ID,
      [
        Query.equal("movie_id", movie.movie_id),
        Query.equal("user_id", user.$id),
      ])
      await database.deleteDocument(DATABASE_ID, SAVED_MOVIES_COLLECTION_ID, savedDocument.documents[0].$id)
    }
  } catch(error) {  
    console.log("Remove saved movie error: ", error)
  }
}

export const getCurrentUser = async () => {
  try {
    const user = await account.get();
    return user;
  } catch (error) {
    console.log("Get user error:", error);
    return null;
  }
};

export const appwriteRegisterUser = async (email: string, password: string, name: string) => {
    try {
        const user = await account.create(ID.unique(), email, password, name)
        return user

    } catch(error) {
        console.log(error)
        throw error
    }
}

export const appwriteLoginUser = async (email: string, password: string) => {
  try {
    const session = await account.createEmailPasswordSession(email, password);
    return session;
  } catch (error) {
    console.log("Login error:", error);
    throw error;
  }
};

export const appwriteLogoutUser = async () => {
  try {
    await account.deleteSession('current');
  } catch (error) {
    console.log("Logout error:", error);
    throw error;
  }
};





export const updateSearchCount = async (query: string, movie: Movie) => {
    try{
            const result = await database.listDocuments(DATABASE_ID, METRICS_COLLECTION_ID, [
                Query.equal('searchTerm', query)
            ])

            if(result.documents.length > 0) {
                const existingMovie = result.documents[0]

                await database.updateDocument(
                    DATABASE_ID,
                    METRICS_COLLECTION_ID,
                    existingMovie.$id,
                    {
                        count: existingMovie.count + 1
                    }
                )
            } else {
                let posterUrl;
                if(movie.poster_path){
                  posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                } else {
                  posterUrl = `https://placehold.co/600x400/1a1a1a/ffffff.png`
                }
                await database.createDocument(
                    DATABASE_ID,
                    METRICS_COLLECTION_ID,
                    ID.unique(),
                    {
                        searchTerm: query,
                        movie_id: movie.id,
                        count: 1,
                        title: movie.title,
                        poster_url: posterUrl
                    }
                )
            }

            console.log(result)
    } catch (error) {
        console.log(error);
        throw error;
    }
}

export const getTrendingMovies = async(): Promise<TrendingMovie[]> => {
    try {
         const result = await database.listDocuments(DATABASE_ID, METRICS_COLLECTION_ID, [
                Query.limit(5),
                Query.orderDesc('count'),
            
        ])
          return result.documents as unknown as TrendingMovie[];
    } catch(error) {
        console.log(error)
        throw error;
    }
}