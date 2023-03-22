import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { BsPerson } from "react-icons/bs";

export default function NavBar() {
  const [user, loading] = useAuthState(auth);
  console.log(user);

  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button>Mr. Bloggy</button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <button>Join Now</button>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-6">
            <Link href="/post">
              <button>Post</button>
            </Link>
            <Link href="/dashboard">
              <BsPerson className="text-2xl" />
              {/* <button>Profile</button> */}
              {/* <img src={user.photoUrl} /> */}
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
