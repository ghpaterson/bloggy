import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

export default function NavBar() {
  const [user, loading] = useAuthState(auth);
  console.log(user);

  return (
    <nav className=" bg-pinkbloggy flex justify-between items-center  py-10">
      <Link href="/">
        <button className="text-gray-50 mx-4 md:mx-60 md:text-xl hover:scale-125">
          mr bloggy
        </button>
      </Link>
      <ul className="flex items-center gap-10">
        {!user && (
          <Link href={"/auth/login"}>
            <button className="text-gray-50 mx-4 hover:scale-125 md:mx-60">
              sign in
            </button>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-1 text-sm  md:text-md md:mx-60">
            <Link href="/music">
              <button className="text-gray-50 mx-4 hover:scale-125">
                food
              </button>
            </Link>
            <Link href="/music">
              <button className="text-gray-50 mx-4 hover:scale-125">
                design
              </button>
            </Link>
            <Link href="/music">
              <button className="text-gray-50 mx-4 hover:scale-125">
                music
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="text-gray-50 mx-4 hover:scale-125">
                account
              </button>
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
