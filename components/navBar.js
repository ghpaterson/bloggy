import Link from "next/link";
import { auth } from "../utils/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/router";

export default function NavBar() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  console.log(user);

  return (
    <nav
      className={`bg-brunswick flex justify-center ${
        router.pathname === "/auth/login"
          ? "md:justify-start"
          : "md:justify-end"
      } items-center  py-10`}
    >
      {router.pathname !== "/" && (
        <Link href="/">
          <button className=" font-moonie text-bloggylime mx-4 md:mx-60 md:text-6xl md:w-72">
            mr bloggy
          </button>
        </Link>
      )}

      <ul className="flex items-center gap-10">
        {router.pathname !== "/auth/login" && !user && (
          <Link href={"/auth/login"}>
            <button className="text-bloggylime mx-4 hover:scale-125 md:mx-60">
              sign in
            </button>
          </Link>
        )}
        {user && (
          <div className="flex items-center gap-1 text-sm  md:text-md md:mx-60">
            <Link href="/food">
              <button className="text-bloggylime mx-4 hover:scale-125">
                food
              </button>
            </Link>
            <Link href="/design">
              <button className="text-bloggylime mx-4 hover:scale-125">
                design
              </button>
            </Link>
            <Link href="/music">
              <button className="text-bloggylime mx-4 hover:scale-125">
                music
              </button>
            </Link>
            <Link href="/dashboard">
              <button className="text-bloggylime mx-4 hover:scale-125">
                account
              </button>
            </Link>
          </div>
        )}
      </ul>
    </nav>
  );
}
