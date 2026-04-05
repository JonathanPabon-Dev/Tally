import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const SignIn = () => {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPasword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailError, setEmailError] = useState("");
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError("Wrong email format");
      return;
    }
    try {
      setLoading(true);
      const result = await signIn(email, password);

      if (result.success) {
        navigate("/dashboard");
      } else {
        setError(result.error.message);
      }
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email !== "") {
      return regex.test(email);
    }
    return true;
  };

  const handleEmailBlur = () => {
    setEmailError(!validateEmail(email) ? "Wrong email format" : "");
  };

  return (
    <div className="mx-auto flex min-h-screen w-[40%] max-w-md min-w-80 flex-col justify-center gap-3">
      <h2 className="text-center text-2xl">Sign In</h2>
      <p className="text-center">
        Don&apos;t have an account?{" "}
        <Link
          to={"/signup"}
          className="text-blue-300 underline underline-offset-2"
        >
          Sign up!
        </Link>
      </p>
      <form onSubmit={handleSignIn}>
        <div className="flex flex-col gap-2">
          <input
            placeholder="Email"
            className={`mt-4 rounded-md p-3 outline-none dark:bg-slate-800 ${emailError ? "border-2 border-red-500" : ""}`}
            type="email"
            onChange={(e) => setEmail(e.target.value)}
            required
            onBlur={handleEmailBlur}
          />
          {emailError && <p className="text-red-500">{emailError}</p>}
          <input
            placeholder="Password"
            className="mt-4 rounded-md p-3 outline-none dark:bg-slate-800"
            type="password"
            onChange={(e) => setPasword(e.target.value)}
            required
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            type="submit"
            disabled={loading || emailError || email === ""}
            className={`mt-4 w-full rounded-md bg-slate-600 p-2 ${loading || emailError || email === "" ? "cursor-not-allowed opacity-50" : "hover:bg-slate-700"}`}
          >
            Sign In
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignIn;
