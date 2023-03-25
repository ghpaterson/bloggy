import NavBar from "./navBar";

export default function Layout({ children }) {
  return (
    <div className=" font-poppins max-w-4xl  md:max-w-full">
      <NavBar />
      <main className="">
        <div>{children}</div>
      </main>
    </div>
  );
}
