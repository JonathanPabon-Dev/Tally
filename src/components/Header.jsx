import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { toast } from "react-toastify";

const Header = () => {
  const { session, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      const result = await signOut();

      if (result.success) {
        navigate("/");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error(error.message);
    }
  };

  return (
    <>
      <header className="flex bg-slate-800 px-4 py-2 text-white">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex size-6 items-center gap-2">
            <img src="bolsa.png" />
            <div className="text-xs font-bold uppercase">Tally</div>
          </div>
          <div className="flex items-center gap-5">
            <p className="text-xs font-semibold text-slate-100 uppercase">
              {session?.user?.email}
            </p>
            <button
              onClick={handleSignOut}
              className="size-7 rounded bg-red-500 font-bold text-white hover:bg-red-600"
              title="Sign Out"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={2}
                stroke="currentColor"
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
              >
                <path d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
            </button>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
