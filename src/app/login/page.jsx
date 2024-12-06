'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // useRouter for navigation in Next.js

const Login = () => {
  // State to handle form input and error messages
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Router instance for navigation

  // Handle the email input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  // Handle the password input change
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  // Handle the remember me checkbox change
  const handleRememberMeChange = () => {
    setRememberMe(!rememberMe);
  };

  // Simulated login function
  const handleLogin = (e) => {
    e.preventDefault();

    // Simple validation (you can add more complex validation here)
    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    // Here you would typically make a request to your authentication API.
    // For now, let's assume the login is always successful.
    if (email === 'admin@example.com' && password === 'password123') {
      // Store the login state in localStorage
      if (rememberMe) {
        localStorage.setItem('isLoggedIn', 'true');
      }

      // Clear any previous error message
      setErrorMessage('');
      alert('Login successful!');

      // Redirect to the homepage ("/")
      router.push('/');
    } else {
      setErrorMessage('Invalid email or password.');
    }
  };

  return (
    <div className="font-[sans-serif] bg-white">
      <div className="min-h-screen flex flex-col items-center justify-center py-6 px-4">
        <div className="grid md:grid-cols-2 items-center gap-10 max-w-6xl w-full">
          <div>
            <h2 className="lg:text-5xl text-4xl font-extrabold lg:leading-[55px] text-gray-800">
              Masterlist Management System
            </h2>
            <p className="text-sm mt-6 text-gray-800">
              Manage your masterlist effortlessly with secure login to access exclusive features.
            </p>
            <p className="text-sm mt-12 text-gray-800">
              Don't have an account?{' '}
              <a className="text-blue-600 font-semibold hover:underline ml-1">
                Register here
              </a>
            </p>
          </div>

          <form onSubmit={handleLogin} className="max-w-md md:ml-auto w-full">
            <h3 className="text-gray-800 text-3xl font-extrabold mb-8">
              Sign in
            </h3>

            {/* Error message */}
            {errorMessage && (
              <div className="bg-red-100 text-red-800 p-3 mb-6 rounded-md text-sm">
                {errorMessage}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={handleEmailChange}
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                  placeholder="Email address"
                />
              </div>
              <div>
                <input
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={handlePasswordChange}
                  className="bg-gray-100 w-full text-sm text-gray-800 px-4 py-3.5 rounded-md outline-blue-600 focus:bg-transparent"
                  placeholder="Password"
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={handleRememberMeChange}
                    className="h-4 w-4 text-blue-600 focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-3 block text-sm text-gray-800">
                    Remember me
                  </label>
                </div>
                <div className="text-sm">
                  <a href="javascript:void(0);" className="text-blue-600 hover:text-primary font-semibold">
                    Forgot your password?
                  </a>
                </div>
              </div>
            </div>

            <div className="!mt-8">
              <button
                type="submit"
                className="w-full shadow-xl py-2.5 px-4 text-sm font-semibold rounded text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
              >
                Log in
              </button>
            </div>

            <div className="space-x-6 flex justify-center mt-8">
              {/* Social Media Login Buttons (You can replace these with actual API integrations) */}
              <button type="button" className="border-none outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="32px" viewBox="0 0 512 512">
                  <path
                    fill="#fbbd00"
                    d="M120 256c0-25.367 6.989-49.13 19.131-69.477v-86.308H52.823C18.568 144.703 0 198.922 0 256s18.568 111.297 52.823 155.785h86.308v-86.308C126.989 305.13 120 281.367 120 256z"
                  />
                  <path
                    fill="#0f9d58"
                    d="m256 392-60 60 60 60c57.079 0 111.297-18.568 155.785-52.823v-86.216h-86.216C305.044 385.147 281.181 392 256 392z"
                  />
                </svg>
              </button>
              <button type="button" className="border-none outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="32px" viewBox="0 0 512 512">
                  <path
                    fill="#1877f2"
                    d="M512 256c0 127.78-93.62 233.69-216 252.89V330h59.65L367 256h-71v-48.02c0-20.25 9.92-39.98 41.72-39.98H370v-63s-29.3-5-57.31-5c-58.47 0-96.69 35.44-96.69 99.6V256h-65v74h65v178.89C93.62 489.69 0 383.78 0 256 0 114.62 114.62 0 256 0s256 114.62 256 256z"
                  />
                </svg>
              </button>
              <button type="button" className="border-none outline-none">
                <svg xmlns="http://www.w3.org/2000/svg" width="32px" viewBox="0 0 22.773 22.773">
                  <path
                    d="M15.769 0h.162c.13 1.606-.483 2.806-1.228 3.675-.731.863-1.732 1.7-3.351 1.573-.108-1.583.506-2.694 1.25-3.561C13.292.879 14.557.16 15.769 0zm4.901 16.716v.045c-.455 1.378-1.104 2.559-1.896 3.655-.723.995-1.609 2.334-3.191 2.334-1.367 0-2.275-.879-3.676-.903-1.482-.024-2.297.735-3.652.926h-.462c-.995-.144-1.798-.932-2.383-1.642-1.725-2.098-3.058-4.808-3.306-8.276v-1.019c.105-2.482 1.311-4.5 2.914-5.478.846-.52 2.009-.963 3.304-.765.555.086 1.122.276 1.619.464.471.181 1.06.502 1.618.485.378-.011.754-.208 1.135-.347 1.116-.403 2.21-.865 3.652-.648 1.733.262 2.963 1.032 3.723 2.22-1.466.933-2.625 2.339-2.427 4.74.176 2.181 1.444 3.457 3.028 4.209z"
                  ></path>
                </svg>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
