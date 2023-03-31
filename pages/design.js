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
import DesignPost from "@/components/designPost";
import Link from "next/link";

export default function Design() {
  //form state
  const [designPost, setDesignPost] = useState({ description: "" });
  const [user, loading] = useAuthState(auth);
  const route = useRouter();
  const updatePost = route.query;

  //submit post
  const submitDesignPost = async (e) => {
    e.preventDefault();

    //run checks for description
    if (!designPost.description) {
      toast.error("Field Empty", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });

      return;
    }

    if (designPost.description.length > 300) {
      toast.error("Too many characters", {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 2000,
      });

      return;
    }

    if (designPost?.hasOwnProperty("id")) {
      const docRef = doc(db, "design", designPost.id);
      const updatedPost = { ...designPost, timestamp: serverTimestamp() };
      await updateDoc(docRef, updatedPost);
      return route.push("/design");
    } else {
      //make a new post
      const collectionRef = collection(db, "design");
      await addDoc(collectionRef, {
        ...designPost,
        type: "design",
        timestamp: serverTimestamp(),
        user: user.uid,
        username: user.displayName,
      });
      setDesignPost({ description: "" });

      return route.push("/design");
    }
  };

  //create a state with all the food posts
  const [designPosts, setDesignPosts] = useState([]);

  const getDesignPosts = async () => {
    const collectionRef = collection(db, "design");
    const q = query(collectionRef, orderBy("timestamp", "desc"));
    const unsubscribe = onSnapshot(q, (designSnapshot) => {
      setDesignPosts(
        designSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    });
    return unsubscribe;
  };

  useEffect(() => {
    getDesignPosts();
  }, []);

  //check our user
  const checkUser = async () => {
    if (loading) return;
    if (!user) route.push("/auth/login");
    if (updatePost.id) {
      setDesignPost({ description: updatePost.description, id: updatePost.id });
    }
  };

  useEffect(() => {
    checkUser();
  }, [user, loading]);

  return (
    <>
      <main className="bg-gray-100 bg-no-repeat bg-cover bg-fixed">
        <div>
          <h2 className="flex justify-center text-2xl py-6">
            Latest in Design
          </h2>
        </div>
        <div className="my-4 p-12 shadow-lg rounded-lg max-w-xl mx-auto">
          <form onSubmit={submitDesignPost}>
            <h1 className="flex justify-center">
              {designPost.hasOwnProperty("id") ? "Edit Post" : "New Post"}
            </h1>
            <div className="py-2">
              <textarea
                value={designPost.description}
                onChange={(e) =>
                  setDesignPost({ ...designPost, description: e.target.value })
                }
                className="bg-gray-300 h-30 w-full text-gray-800 rounded-lg p-2 text-sm focus:outline-brunswick"
              ></textarea>
              <p
                className={`text-gray-600 text-xs ${
                  designPost.description.length > 300 ? "text-bloggypurple" : ""
                }`}
              >
                {designPost.description.length}/300
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
          {designPosts.map((designPost) => (
            <DesignPost
              {...designPost}
              key={designPost.id}
              timestamp={designPost.timestamp}
            >
              <Link
                href={{
                  pathname: `/${designPost.id}`,
                  query: { ...designPost },
                }}
              >
                <button>
                  {designPost.comments?.length > 0
                    ? designPost.comments?.length
                    : 0}{" "}
                  Comments
                </button>
              </Link>
            </DesignPost>
          ))}
        </div>
      </main>
    </>
  );
}
