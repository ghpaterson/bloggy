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
import FoodPost from "@/components/foodPost";
import Link from "next/link";

export default function Food() {
  //form state
  const [foodPost, setFoodPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const updatePost = route.query;

  //submit post
  const submitFoodPost = async (e) => {
    e.preventDefault();

    //run checks for description
    if (!foodPost.description) {
      toast.error("Field Empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });

      return;
    }

    if (foodPost.description.length > 300) {
      toast.error("Too many characters", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });

      return;
    }

    if (foodPost?.hasOwnProperty("id")) {
      const docRef = doc(db, "food", foodPost.id);
      const updatedPost = { ...foodPost, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/food");
    } else {
      //make a new post
      const collectionRef = collection(db, "food");
      await addDoc(collectionRef, {
        ...foodPost,
        type: "food",
        timestamp: serverTimestamp(),
        user: user.uid,
        username: user.displayName,
      });
      setFoodPost({ description: "" });

      return route.push("/food");
    }
  };

  //create a state with all the food posts
  const [foodPosts, setFoodPosts] = useState([]);

  const getFoodPosts = async () => {
    const collectionRef = collection(db, "food");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (foodSnapshot) => {
      setFoodPosts(
        foodSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  };

  useEffect(() => {
    getFoodPosts();
  }, []);

  //check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (updatePost.id) {
      setFoodPost({ description: updatePost.description, id: updatePost.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <>
      <main className="bg-gray-100 bg-no-repeat bg-cover bg-fixed">
        <div>
          <h2 className="flex text-2xl justify-center py-6">Latest in Food</h2>
        </div>
        <div className="my-4 p-12 shadow-lg rounded-lg max-w-xl mx-auto">
          <form onSubmit={submitFoodPost}>
            <h1 className="flex justify-center">
              {foodPost.hasOwnProperty("id") ? "Edit Post" : "New Post"}
            </h1>
            <div className="py-2">
              <textarea
                value={foodPost.description}
                onChange={(e) =>
                  setFoodPost({ ...foodPost, description: e.target.value })
                }
                className="bg-gray-300 h-30 w-full text-gray-800 rounded-lg p-2 text-sm focus:outline-brunswick"
              ></textarea>
              <p
                className={`text-gray-600 text-xs ${
                  foodPost.description.length > 300 ? "text-bloggypurple" : ""
                }`}
              >
                {foodPost.description.length}/300
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
          {foodPosts.map((foodPost) => (
            <FoodPost
              {...foodPost}
              key={foodPost.id}
              timestamp={foodPost.timestamp}
            >
              <Link
                href={{ pathname: `/${foodPost.id}`, query: { ...foodPost } }}
              >
                <button>
                  {foodPost.comments?.length > 0
                    ? foodPost.comments?.length
                    : 0}{" "}
                  Comments
                </button>
              </Link>
            </FoodPost>
          ))}
        </div>
      </main>
    </>
  );
}
