import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../zustand/auth";
import EyeIcon from "../../components/ui/icon/eye";
import { toast } from "sonner";
export default function Login() {
  const { login, loading, error } = useAuthStore();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const inputClass =
    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base md:text-sm";
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await login(email, password);

    if (success) {
      toast.success("Welcome back!");
      navigate("/");
    } else {
      toast.error(error || "Invalid email or password");
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-screen">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm w-full max-w-md">
        <div className="flex flex-col space-y-1.5 p-6 text-center">
          <div className="font-semibold tracking-tight text-2xl">
            Welcome Back
          </div>
          <div className="text-sm text-muted-foreground">
            Sign in to your SneakerHub account
          </div>
        </div>
        <div className="p-6 pt-0">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className={inputClass}
                id="email"
                placeholder="Enter your email"
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm font-medium leading-none"
                htmlFor="password"
              >
                Password
              </label>
              <div className="relative">
                <input
                  className={inputClass}
                  id="password"
                  placeholder="Enter your password"
                  required
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium w-10 absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent cursor-pointer text-gray-500"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <EyeIcon />
                </button>
              </div>
            </div>

            <button
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full"
              type="submit"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">
              Don't have an account?{" "}
            </span>
            <Link className="text-primary hover:underline" to="/auth/signup">
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
