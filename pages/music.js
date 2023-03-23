import { useAuthState } from "react-firebase-hooks/auth";
import { Auth } from "../utils/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Music() {
  //form state
  const [post, setPost] = useState({ description: "" });

  //submit post
  const submitPost = async (e) => {
    e.preventDefault();
  };

  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form onSubmit={submitPost}>
        <h1>New Post</h1>
        <div className="py-2">
          <h3>Description</h3>
          <textarea
            value={post.description}
            onChange={(e) => setPost({ ...post, description: e.target.value })}
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
  );
}
