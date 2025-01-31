"use client";

import { useContext, useEffect, useState } from "react";
import { validateEmail, validatePassword } from "../../helpers/validation";
import Link from "next/link";
import { ILoginForm as Data } from "../../interfaces/forms";
import { loginService } from "@/services/authServices";
import { useRouter } from "next/navigation";
import { AuthContext } from "@/context/authContext";
import Loading from "@/app/loading";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

interface DirtyState {
  email: boolean;
  password: boolean;
}

export default function LoginForm() {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const initialData: Data = { email: "", password: "" };
  const [data, setData] = useState(initialData);
  const [errors, setErrors] = useState(initialData);
  const [dirty, setDirty] = useState<DirtyState>({
    email: false,
    password: false,
  });

  useEffect(() => {
   
    const currentPath = window.location.pathname;
    localStorage.setItem("previousPath", currentPath);
  }, []);

  const showAlert = (
    message: string,
    icon: "success" | "error",
    callback?: () => void,
  ) => {
    MySwal.fire({
      title: <p>{message}</p>,
      icon: icon,
      toast: true,
      position: "top",
      showConfirmButton: false,
      timer: 1000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
      willClose: () => {
        if (callback) {
          callback();
        }
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setDirty((prevDirty) =>
      Object.keys(prevDirty).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        { ...prevDirty } as DirtyState,
      ),
    );

    const hasErrors = Object.values(errors).some((error) => error !== "");
    if (hasErrors) {
      showAlert("Please correct the errors in the form.", "error");
      return;
    }

    setIsLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!apiUrl) throw new Error("API URL not defined");

      const response = await loginService(apiUrl + "/users/login", data);

      if (response.login) {
        showAlert("Login successful!", "success", () => {
          setUser(response);
          router.push("/");
          localStorage.removeItem("previousPath");
        });
      } else {
        showAlert(response.message || "Invalid email or password.", "error");
      }
    } catch (error) {
      console.error("Помилка входу:", error);
      showAlert(
        "An error occurred during login. Please try again later.",
        "error",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setDirty({ ...dirty, [e.target.name]: true });
  };

  useEffect(() => {
    setErrors({
      email: validateEmail(data.email),
      password: validatePassword(data.password),
    });
  }, [data]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto my-20 flex w-full max-w-md flex-col gap-6 rounded-3xl border border-primary/80 bg-secondary/50 p-8 shadow-lg"
    >
      <label
        htmlFor="email"
        className="block text-lg font-semibold text-quinary"
      >
        Email
      </label>
      <input
        type="email"
        placeholder="ejemplo@ejemplo.com"
        id="email"
        name="email"
        value={data.email}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`block rounded-md bg-primary/10 p-3 text-primary ${
          errors.email && dirty.email ? "border-red-500" : "border-transparent"
        }`}
      />
      {dirty.email && errors.email && (
        <p className="text-red-500">{errors.email}</p>
      )}

      <label
        htmlFor="password"
        className="block text-lg font-semibold text-quinary"
      >
        Password
      </label>
      <input
        type="password"
        placeholder="********"
        id="password"
        name="password"
        value={data.password}
        onChange={handleChange}
        onBlur={handleBlur}
        className={`block rounded-md bg-primary/10 p-3 text-primary ${
          errors.password && dirty.password
            ? "border-red-500"
            : "border-transparent"
        }`}
      />
      {dirty.password && errors.password && (
        <p className="text-red-500">{errors.password}</p>
      )}

      <button
        className="relative z-10 mt-10 rounded border-2 border-primary bg-primary px-4 py-2 font-bold text-secondary transition-all duration-300 hover:scale-105 hover:border-primary hover:bg-secondary hover:text-primary active:scale-100"
        type="submit"
      >
       Login
      </button>

      <Link
        className="mt-4 text-center text-sm text-primary transition-colors hover:text-primary/70"
        href="/register"
      >
        Don't have an account?
      </Link>
    </form>
  );
}
