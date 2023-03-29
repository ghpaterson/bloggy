import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../utils/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import MusicPost from "@/components/musicPost";
import Link from "next/link";

export default function Music() {
  //form state
  const [post, setPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const updatePost = route.query;

  //submit post
  const submitPost = async (e) => {
    e.preventDefault();

    //run checks for description
    if (!post.description) {
      toast.error("Field Empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });

      return;
    }

    if (post.description.length > 300) {
      toast.error("Too many characters", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });

      return;
    }

    if (post?.hasOwnProperty("id")) {
      const docRef = doc(db, "posts", post.id);
      const updatedPost = { ...post, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/music");
    } else {
      //make a new post
      const collectionRef = collection(db, "posts");
      await addDoc(collectionRef, {
        ...post,
        type: "music",
        timestamp: serverTimestamp(),
        user: user.uid,
        username: user.displayName,
      });
      setPost({ description: "" });

      return route.push("/music");
    }
  };

  //create a state with all the music posts
  const [musicPosts, setMusicPosts] = useState([]);

  const getMusicPosts = async () => {
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (musicSnapshot) => {
      setMusicPosts(
        musicSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  };

  useEffect(() => {
    getMusicPosts();
  }, []);

  //check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (updatePost.id) {
      setPost({ description: updatePost.description, id: updatePost.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <>
      <main className="bg-gray-100 bg-no-repeat bg-cover bg-fixed">
        <div>
          <h2 className="flex justify-center py-6">Latest in Music</h2>
        </div>
        <div className="my-4 p-12 shadow-lg rounded-lg max-w-xl mx-auto">
          <form onSubmit={submitPost}>
            <h1 className="flex justify-center">
              {post.hasOwnProperty("id") ? "Edit Post" : "New Post"}
            </h1>
            <div className="py-2">
              <textarea
                value={post.description}
                onChange={(e) =>
                  setPost({ ...post, description: e.target.value })
                }
                className="bg-gray-300 h-30 w-full text-gray-800 rounded-lg p-2 text-sm focus:outline-brunswick"
              ></textarea>
              <p
                className={`text-gray-600 text-xs ${
                  post.description.length > 300 ? "text-bloggypurple" : ""
                }`}
              >
                {post.description.length}/300
              </p>
            </div>
            <button
              className="bg-brunswick text-bloggylime py-1 px-1 rounded-md"
              type="submit"
            >
              Submit
            </button>
          </form>
        </div>

        <div className="py-4 max-w-4xl space-y-6 mx-auto">
          {musicPosts.map((post) => (
            <MusicPost {...post} key={post.id} timestamp={post.timestamp}>
              <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
                <button>
                  {post.comments?.length > 0 ? post.comments?.length : 0}{" "}
                  Comments
                </button>
              </Link>
            </MusicPost>
          ))}
        </div>
      </main>
    </>
  );
}
