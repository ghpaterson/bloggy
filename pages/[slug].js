import MusicPost from "@/components/musicPost";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { auth, db } from "../utils/firebase";
import { toast } from "react-toastify";
import { arrayUnion, doc, Timestamp, updateDoc } from "firebase/firestore";

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

  return (
    <div>
      <MusicPost {...routeData}></MusicPost>
      <div className="my-4 ">
        <div className="flex">
          <input
            onChange={(e) => setComment(e.target.value)}
            type="text"
            value={comment}
            placeholder="Comment"
            className="w-full p-2 text-gray-800 text-sm"
          />
          <button
            onClick={submitComment}
            className="bg-gray-800 text-gray-100 py-1 px-2 rounded-md text-sm"
          >
            Submit
          </button>
        </div>
        <div className="py-6 ">
          <h2>Comments</h2>
          {/* {setAllComment?.map((comment) => (
            <div>
              <div></div>
            </div>
          ))} */}
        </div>
      </div>
    </div>
  );
}
