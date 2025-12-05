import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '../Firebase';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' or 'error'

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000); // Hide after 3 seconds
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const user = { username, password };
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/login`, user, { withCredentials: true });

      if (response.status === 200) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
        localStorage.setItem('token', response.data.token);
        navigate('/home');
      }

      setUsername('');
      setPassword('');
    } catch (err) {
      console.error('Login error:', err.response?.data || err.message);
      showMessage('Incorrect Username or Password', 'error');
      setUsername('');
      setPassword('');
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const { user } = result;

      const token = await user.getIdToken();
      const res = await axios.post(`${import.meta.env.VITE_BASE_URL}/google-login`, { credential: token });
      if (res.status === 200) {
        console.log("Logged in")
        localStorage.setItem('user', JSON.stringify(res.data.user));
        localStorage.setItem('token', res.data.token);
        navigate('/home');
      }
    } catch (err) {
      console.error('Google sign-in failed:', err);
      showMessage('Google sign-in failed. Please try again.', 'error');
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          src="https://video.wixstatic.com/video/f1c650_988626917c6549d6bdc9ae641ad3c444/720p/mp4/file.mp4"
        />
      </div>

      {message && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${messageType === 'success' ? 'bg-green-500' : 'bg-red-500'} text-white`}>
          {message}
        </div>
      )}

      <Link to="/">
        <img
          className="fixed top-5 left-5 z-50 h-30 w-32 hover:scale-120 transition duration-300 ease-in-out hover:cursor-pointer"
          src="./src/assets/logo1.png"
          alt=''
        />
      </Link>

      <h1 className="text-[85px] font-bold text-white text-center absolute top-6 left-1/2 -translate-x-1/2 z-40 font-[monaco]">
        Login
      </h1>

      <div className="inset-0 flex items-center justify-center z-0">
        <div className="h-[38rem] w-[34rem] bg-[#0f0a0a] opacity-30 blur-2xl rounded-4xl"></div>
      </div>

      <div className="fixed inset-0 flex items-center justify-center z-10">
        <div className="h-[38rem] w-[34rem] bg-transparent border-6 border-white rounded-4xl drop-shadow-lg drop-shadow-cyan-300 text-white text-2xl font-bold flex flex-col items-center justify-center gap-10 p-10">
          <form onSubmit={submitHandler} className="flex flex-col mt-14 gap-8 w-full items-center">
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              type="text"
              autoComplete="username"
              placeholder="Enter Username"
              className="text-center bg-[#ededed] drop-shadow-lg drop-shadow-cyan-300 border-4 border-white h-14 w-4/5 rounded-full text-black text-xl font-bold placeholder:font-bold placeholder:text-gray-600 placeholder:font-[spaceMono] cursor-pointer hover:scale-110 transition duration-300 ease-in-out focus:outline-none"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              placeholder="Enter Password"
              className="text-center bg-[#ededed] drop-shadow-lg drop-shadow-cyan-300 border-4 border-white h-14 w-4/5 rounded-full text-black text-xl font-bold placeholder:font-bold placeholder:text-gray-600 placeholder:font-[spaceMono] cursor-pointer hover:scale-110 transition duration-300 ease-in-out focus:outline-none mb-4"
            />
            <button
              type="submit"
              className="bg-transparent drop-shadow-sm drop-shadow-cyan-300 border-4 border-white h-14 w-4/5 rounded-full text-white text-2xl font-bold hover:scale-110 transition duration-300 ease-in-out animate-pulse font-[spaceMono-Bold] cursor-pointer"
            >
              Login
            </button>
          </form>

          <span className="text-center text-white -my-3 ml-2">OR</span>

          <button
            type="button"
            onClick={handleGoogleSignIn}
            className="flex items-center justify-center bg-white text-black text-xl font-bold h-14 w-4/5 rounded-full hover:scale-110 transition duration-300 ease-in-out cursor-pointer gap-4"
          >
            Sign in with Google
            <img className="h-11 w-11" src="/google.png" alt="google" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
