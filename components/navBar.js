import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="flex justify-between items-center py-10">
      <Link href="/">
        <button>Mr. Bloggy</button>
      </Link>
      <ul className="flex items-center gap-10">
        <Link href={"/auth/login"}>
          <button>Join Now</button>
        </Link>
      </ul>
    </nav>
  );
}
