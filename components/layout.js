import NavBar from "./navBar";

export default function Layout({ children }) {
  return (
    <div className="font-poppins mx-6 md:max-w-4xl md:mx-auto">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
