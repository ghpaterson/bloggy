import { useAuthState } from "react-firebase-hooks/auth";
import { Auth } from "../utils/firebase";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export default function Music() {
  return (
    <div className="my-20 p-12 shadow-lg rounded-lg max-w-md mx-auto">
      <form>
        <h1>New Post</h1>
        <div className="py-2">
          <h3>Description</h3>
          <textarea className="bg-gray-800 h-48 w-full text-gray-100 rounded-lg p-2 text-sm"></textarea>
          <p className="text-gray-300">0/300</p>
        </div>
        <button>Submit</button>
      </form>
    </div>
  );
}
