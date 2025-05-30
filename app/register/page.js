"use client";

import { useState } from "react";
import { ApiClient } from "../../apiClient/apiClient";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function UserRegisterPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }
    setLoading(true);
    try {
      const apiClient = new ApiClient();
      const response = await apiClient.register(form.email, form.password);

      // Check if we have a token
      if (response.data && response.data.token) {
        router.push("/events");
      } else {
        setError("Register successful but no token received");
      }
    } catch (err) {
      console.error("Register error:", err.response || err); // Debug log
      setError(
        err.response?.data?.message || "Invalid credentials or server error."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-fuchsia-100 to-sky-100 dark:from-gray-900 dark:to-gray-800 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 p-8 md:p-10 rounded-2xl shadow-xl w-full max-w-md"
      >
        <h1 className="text-2xl md:text-3xl font-extrabold mb-6 text-center text-gray-900 dark:text-white">
          Register your <span className="text-fuchsia-600">Spare Seats 4U</span>{" "}
          account
        </h1>

        <div className="mb-5">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            placeholder="you@example.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-fuchsia-500 focus:border-transparent"
            placeholder="••••••••"
            autoComplete="current-password"
            required
          />
        </div>

        {error && (
          <p className="mb-4 text-sm text-red-600 text-center">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-fuchsia-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-fuchsia-700 transition-colors focus:outline-none focus:ring-2 focus:ring-fuchsia-500 focus:ring-offset-2 disabled:opacity-60"
        >
          {loading ? "Registering..." : "Register"}
        </button>
        <div className="mt-10 text-center flex flex-col ">
          <p className="text-fuchsia-600/70  mb-4 font-light text-sm">
            Already have an account?
          </p>
          <Link href="/">
            <button className="text-fuchsia-600 py-2 px-6 font-light hover:text-fuchsia-700  transition-colors duration-200 border-b border-fuchsia-600/30 hover:border-fuchsia-600 ">
              Register
            </button>
          </Link>
        </div>
      </form>
    </div>
  );
}
