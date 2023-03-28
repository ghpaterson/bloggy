import { auth, db } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  onSnapshot,
  query,
  where,
} from "firebase/firestore";
import MusicPost from "@/components/musicPost";
import FoodPost from "@/components/foodPost";
import Link from "next/link";

export default function Dashboard({ username }) {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);

  // see if user is logged in
  const getData = async () => {
    if (loading) return;
    if (!user) return route.push("/auth/login");
    const collectionRef = collection(db, "posts");
    const foodCollectionRef = collection(db, "food");

    const q = query(collectionRef, where("user", "==", user.uid));
    const foodQ = query(foodCollectionRef, where("user", "==", user.uid));

    const [snapshot, foodSnapshot] = await Promise.all([
      getDocs(q),
      getDocs(foodQ),
    ]);

    const postsData = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));
    const foodData = foodSnapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    setPosts([...postsData, ...foodData]);
    console.log(posts.type);

    //   const unsubscribe = onSnapshot(q, (snapshot) => {
    //     setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //   });
    //   return unsubscribe;
  };

  //delete users post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  const deleteFoodPost = async (id) => {
    const docRef = doc(db, "food", id);
    await deleteDoc(docRef);
  };

  //get users data
  useEffect(() => {
    getData();
  }, [user, loading]);

  return (
    <div>
      <div>
        <h1 className="flex justify-center text-xl text-blackbloggy py-6">
          {user.displayName}'s Posts
        </h1>
        <div className="max-w-4xl mx-auto space-y-6">
          {posts.map((post) => {
            if (post.type === "music") {
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
            } else if (post.type === "food") {
              return (
                <FoodPost {...post} key={post.id}>
                  <div className="flex gap-4">
                    <button
                      onClick={() => deleteFoodPost(post.id)}
                      className="text-sm flex items-center justify-center"
                    >
                      Delete
                    </button>
                    <Link href={{ pathname: "/food", query: post }}>
                      <button className="text-sm flex items-center justify-center">
                        Edit
                      </button>
                    </Link>
                  </div>
                </FoodPost>
              );
            }
          })}
        </div>
        <div className=" ml-96">
          <button
            className="bg-yellowbloggy text-blackbloggy rounded-md py-1 px-2 my-4"
            onClick={() => auth.signOut()}
          >
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
