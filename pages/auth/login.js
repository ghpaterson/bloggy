import { FcGoogle } from "react-icons/fc";

export default function Login() {
  return (
    <div className="shadow-xl mt-32 p-10 textgray-800 rounded-lg">
      <h2 className="text-2xl font-medium">Join Today</h2>
      <div className="py-4">
        <h3 className="py-4">Sign in with a Provider</h3>
        <button className="text-white bg-gray-800 w-full font-medium rounded-lg flex align-middle p-4 gap-2">
          <FcGoogle className="text-2xl" />
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
