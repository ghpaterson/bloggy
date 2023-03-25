import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsPerson } from "react-icons/bs";

export default function NavBar() {
  const [user, loading] = useAuthState(auth);
  console.log(user);

  return (
    <nav className=" bg-pink-500 flex justify-between items-center  py-10">
      <Link href="/">
        <button className="text-gray-900 mx-4 md:mx-60 md:text-xl">
          Mr. Bloggy
        </button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <button className="text-gray-900 mx-4">Sign in</button>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-1 text-sm md:text-md md:mx-60">
            <Link href="/music">
              <button className="text-gray-900 mx-4">Food</button>
            </Link>
            <Link href="/music">
              <button className="text-gray-900 mx-4">Design</button>
            </Link>
            <Link href="/music">
              <button className="text-gray-900 mx-4">Music</button>
            </Link>
            <Link href="/dashboard">
              <button className="text-gray-900 mx-4">Account</button>
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
