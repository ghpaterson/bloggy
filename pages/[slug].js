import MusicPost from "@/components/musicPost";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  Timestamp,
  updateDoc,
} from "firebase/firestore";

export default function Details() {
  const router = useRouter();
  const routeData = router.query;
  const [comment, setComment] = useState("");
  const [allComment, setAllComment] = useState([]);

  //submit a comment
  const submitComment = async () => {
    //check if the user is logged in
    if (!auth.currentUser) return router.push("/auth/login");
    if (!comment) {
      toast.error("Please leave a comment", {
        position: toast.POSITION.TOP,
        autoClose: 2000,
      });
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    await updateDoc(docRef, {
      comments: arrayUnion({
        comment,
        userName: auth.currentUser.displayName,
        time: Timestamp.now(),
      }),
    });

    setComment("");
  };

  // get comments
  const getComments = async () => {
    if (!routeData || !routeData.id) {
      return;
    }
    const docRef = doc(db, "posts", routeData.id);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const data = snapshot.data();
      if (data && data.comments) {
        setAllComment(data.comments);
      } else {
        setAllComment([]);
      }
    });
    return unsubscribe;
  };

  useEffect(() => {
    if (!router.isReady) return;
    getComments();
  }, [router.isReady]);

  return (
    <main className="bg-gray-100 bg-no-repeat bg-cover bg-fixed">
      <div className="max-w-5xl mx-auto">
        <MusicPost {...routeData}></MusicPost>
        <div className="my-4 ">
          <div className="flex flex-col mx-20 gap-4">
            <input
              onChange={(e) => setComment(e.target.value)}
              type="text"
              value={comment}
              placeholder="Comment"
              className="p-2 text-gray-800 text-sm rounded-md focus:border-bloggylime"
            />
            <button
              onClick={submitComment}
              className="bg-brunswick mx-auto text-gray-100 py-1 px-2 rounded-md text-sm"
            >
              Submit
            </button>
          </div>
          <div className="flex flex-col gap-6 py-6 text-gray-800  ">
            <h2 className="text-xl text-gray-100 mx-auto">Comments</h2>
            {allComment?.map((comment, index) => (
              <div
                className="bg-gray-100 p-4 my-4 rounded-md"
                key={comment?.time || index}
              >
                <div>
                  <h2>{comment?.userName}</h2>
                </div>
                <h2 className="text-sm text-gray-800">{comment?.comment}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
