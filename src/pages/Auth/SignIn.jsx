import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { decodeToken } from "react-jwt";

// Mutation
import { useLoginUserMutation } from "../../actions/users";

// Slice
import { loginUser, logoutUser } from "../../slices/user";

const SignIn = () => {
  const { authToken } = useSelector((state) => state.user);
  const [showPassword, setShowPassword] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm();
  const [loginUserMutation, { isLoading }] = useLoginUserMutation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (loginData) => {
    const { data, error } = await loginUserMutation(loginData);

    if (error) {
      const errorMessages = error.data.message || error.data.detail || "Something went wrong";
      toast.error(errorMessages);
    }

    if (data) {
      const myDecodedToken = decodeToken(data.access);
      if (myDecodedToken.role === "Admin") {
        localStorage.setItem("authToken", data.access);
        dispatch(loginUser(data));
        navigate("/admin/dashboard", { replace: true });
        toast.success("Login successfully");
      } else {
        toast.error("You are not authorized to access this page");
        dispatch(logoutUser());
        return;
      }
    }
  };

  useEffect(() => {
    if (authToken) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [authToken, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-xl p-8 bg-white rounded-lg shadow-lg dark:bg-gray-800 dark:text-white">
        <div className="text-center mb-8">
          <Link to="/">
            <h2 className="text-3xl font-bold text-primary">Criminal <span className="text-black">Detection</span></h2>
          </Link>
        </div>
        <h2 className="mb-6 text-2xl font-bold text-center">Sign In</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Email</label>
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-4 focus:border-primary focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                {...register("email", { required: true })}
              />
            </div>
            {errors.email && (
              <span className="text-red-500 font-medium text-sm">Email is required</span>
            )}
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full rounded-lg border border-gray-300 bg-gray-50 py-2 px-4 focus:border-primary focus:outline-none dark:bg-gray-700 dark:border-gray-600"
                {...register("password", { required: true })}
              />
            </div>
            {errors.password && (
              <span className="text-red-500 font-medium text-sm">Password is required</span>
            )}
          </div>

          <div className="mb-5">
            <button
              type="submit"
              className={`w-full py-3 rounded-lg text-white font-bold ${isLoading ? "bg-gray-500" : "bg-primary hover:bg-primary-dark"}`}
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignIn;