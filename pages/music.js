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
      <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
        <form onSubmit={submitPost}>
          <h1>{post.hasOwnProperty("id") ? "Edit Post" : "New Post"}</h1>
          <div className="py-2">
            <h3>Description</h3>
            <textarea
              value={post.description}
              onChange={(e) =>
                setPost({ ...post, description: e.target.value })
              }
              className="bg-gray-800 h-48 w-full text-gray-100 rounded-lg p-2 text-sm"
            ></textarea>
            <p
              className={`text-cyan-600 ${
                post.description.length > 300 ? "text-red-500" : ""
              }`}
            >
              {post.description.length}/300
            </p>
          </div>
          <button type="submit">Submit</button>
        </form>
      </div>
      <div>
        <h2>Here are the posts</h2>
        {musicPosts.map((post) => (
          <MusicPost {...post} key={post.id}>
            <Link href={{ pathname: `/${post.id}`, query: { ...post } }}>
              <button>
                {post.comments?.length > 0 ? post.comments?.length : 0} Comments
              </button>
            </Link>
          </MusicPost>
        ))}
      </div>
    </>
  );
}
