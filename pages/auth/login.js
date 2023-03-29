import { FcGoogle } from "react-icons/fc";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../utils/firebase";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";

export default function Login() {
  const route = useRouter();
  const [user, loading] = useAuthState(auth);
  //signin with google
  const googleProvider = new GoogleAuthProvider();
  const GoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      route.push("/");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (user) {
      route.push("/");
    } else {
      console.log("login please");
    }
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className=" shadow-xl mt-32 p-10 textgray-800 rounded-lg">
        <div className="py-4">
          <button
            onClick={GoogleLogin}
            className="text-bloggylime bg-gray-800 max-w-3xl font-medium rounded-lg flex align-middle p-4 gap-2"
          >
            <FcGoogle className="text-2xl" />
            Sign in with Google
          </button>
        </div>
      </div>
    </div>
  );
}
