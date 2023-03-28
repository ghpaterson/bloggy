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
import DesignPost from "@/components/designPost";
import Link from "next/link";

export default function Dashboard() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  const [posts, setPosts] = useState([]);
  const [postUnsubscribe, setPostUnsubscribe] = useState(null);
  const [foodUnsubscribe, setFoodUnsubscribe] = useState(null);
  const [designUnsubscribe, setDesignUnsubscribe] = useState(null);

  // get users data
  useEffect(() => {
    const fetchData = async () => {
      if (loading) return;
      if (!user) return route.push("/auth/login");

      const collectionRef = collection(db, "posts");
      const foodCollectionRef = collection(db, "food");
      const designCollectionRef = collection(db, "design");

      const q = query(collectionRef, where("user", "==", user.uid));
      const foodQ = query(foodCollectionRef, where("user", "==", user.uid));
      const designQ = query(designCollectionRef, where("user", "==", user.uid));

      const [snapshot, foodSnapshot, designSnapshot] = await Promise.all([
        getDocs(q),
        getDocs(foodQ),
        getDocs(designQ),
      ]);

      const postsData = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const foodData = foodSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      const designData = designSnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      setPosts([...postsData, ...foodData, ...designData]);

      const postUnsub = onSnapshot(q, (snapshot) => {
        setPosts(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
      setPostUnsubscribe(() => postUnsub);

      const foodUnsub = onSnapshot(foodQ, (snapshot) => {
        setPosts((prevPosts) => {
          const foodPosts = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            type: "food",
          }));
          return [
            ...prevPosts.filter((post) => post.type !== "food"),
            ...foodPosts,
          ];
        });
      });
      setFoodUnsubscribe(() => foodUnsub);

      const designUnsub = onSnapshot(designQ, (snapshot) => {
        setPosts((prevPosts) => {
          const designPosts = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
            type: "design",
          }));
          return [
            ...prevPosts.filter((post) => post.type !== "design"),
            ...designPosts,
          ];
        });
      });
      setDesignUnsubscribe(() => designUnsub);
    };

    fetchData();

    return () => {
      if (postUnsubscribe) {
        postUnsubscribe();
      }
      if (foodUnsubscribe) {
        foodUnsubscribe();
      }
      if (designUnsubscribe) {
        designUnsubscribe();
      }
    };
  }, [user, loading]);

  //delete users post
  const deletePost = async (id) => {
    const docRef = doc(db, "posts", id);
    await deleteDoc(docRef);
  };

  const deleteFoodPost = async (id) => {
    const docRef = doc(db, "food", id);
    await deleteDoc(docRef);
  };

  const deleteDesignPost = async (id) => {
    const docRef = doc(db, "design", id);
    await deleteDoc(docRef);
  };

  return (
    <div>
      <div>
        <div>
          <h1 className="flex justify-center text-xl text-blackbloggy pt-6 pb-4">
            {user ? `${user.displayName}'s Posts` : ""}
          </h1>
          <div className="flex justify-center">
            <button
              className=" bg-yellowbloggy text-blackbloggy rounded-md py-1 px-2 mb-6"
              onClick={() => auth.signOut()}
            >
              Sign out
            </button>
          </div>
        </div>
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
            } else if (post.type === "design") {
              return (
                <DesignPost {...post} key={post.id}>
                  <div className="flex gap-4">
                    <button
                      onClick={() => deleteDesignPost(post.id)}
                      className="text-sm flex items-center justify-center"
                    >
                      Delete
                    </button>
                    <Link href={{ pathname: "/design", query: post }}>
                      <button className="text-sm flex items-center justify-center">
                        Edit
                      </button>
                    </Link>
                  </div>
                </DesignPost>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
