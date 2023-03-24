import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import MusicPost from "@/components/musicPost";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // see if user is logged in
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const q = query(collectionRef, where("user", "==", user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    });
    return unsubscribe;
  };

  //delete users post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  //get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <h1>Your Posts</h1>
      <div>
        {posts.map((post) => {
          return (
            <MusicPost {...post} key={post.id}>
              <div className="flex gap-4">
                <button
                  onClick={() => deletePost(post.id)}
                  className="text-sm flex items-center justify-center"
                >
                  Delete
                </button>
                <Link href={{ pathname: "/music", query: post }}>
                  <button className="text-sm flex items-center justify-center">
                    Edit
                  </button>
                </Link>
              </div>
            </MusicPost>
          );
        })}
      </div>
      <button
        className="bg-gray-800 text-gray-100 rounded-md py-1 px-2 my-4"
        onClick={() => auth.signOut()}
      >
        Sign out
      </button>
    </div>
  );
}