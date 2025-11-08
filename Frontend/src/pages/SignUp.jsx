import React, { useState, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'

const SignUp = () => {
  const [user, setUser] = useState(null)

  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    image: null,
  })
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value })
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setForm({ ...form, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) {
      setForm({ ...form, image: file })
      setImagePreview(URL.createObjectURL(file))
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
  }
 

  const submitHandler = async (e) => {
    e.preventDefault()
     if (!form.firstName || !form.lastName || !form.username || !form.email || !form.password) {
      alert('Please fill in all fields')
      return
    }   
    const newUser = new FormData();
    newUser.append('firstName', form.firstName)
    newUser.append('lastName', form.lastName)
    newUser.append('username', form.username)
    newUser.append('email', form.email)
    newUser.append('password', form.password)
    if (form.image) {
      newUser.append('image', form.image)

    }
    
    
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/signup`,newUser)
      if(response.status==201){
          const data=response.data
          setUser(data.user)
          localStorage.setItem('token',data.token)
          alert('User created successfully')
      }
    setForm({
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      image: null,
    })
    setImagePreview(null)
    
  }

  return (
    <>
      <div className='flex flex-col justify-center items-center p-0 overflow-hidden'>
        <div className="shadow-lg shadow-gray-500 h-screen w-full relative overflow-hidden -z-1">
          <video
            autoPlay
            loop
            muted
            className="w-full h-full object-cover"
            src="https://video.wixstatic.com/video/f1c650_988626917c6549d6bdc9ae641ad3c444/720p/mp4/file.mp4"
          ></video>
        </div>
      </div>
      <Link to={'/'}>
        <img className='fixed top-5 left-5 h-30 w-32 hover:scale-120 transition duration-300 ease-in-out hover:cursor-pointer' src="./src/assets/logo1.png" alt="" />
      </Link>
      <span className='text-[70px] font-bold text-white text-center left-1/2 -translate-x-1/2 absolute top-7 z-40 font-[monaco]'>
        Welcome to TruthSync
      </span>

      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-150 w-135 bg-transparent drop-shadow-lg drop-shadow-cyan-300 border-6 border-white rounded-4xl text-white text-2xl font-bold z-4 flex justify-between hover:origin-center '>
        <form
          onSubmit={submitHandler}
          className='flex flex-col relative left-1/2 top-15 -translate-x-1/2 items-center w-120'
        >
          <div className="flex flex-row gap-4 relative top-15 ">
            <input
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              type="text"
              autoComplete="given-name"
              className='text-center bg-[#ededed] drop-shadow-lg border-4 border-white h-12 w-50 rounded-full text-black text-lg font-bold placeholder:font-bold placeholder:text-gray-600 placeholder:font-[spaceMono] hover:scale-110 transition duration-300 ease-in-out focus:outline-none '
              placeholder='First Name'
              required
            />
            <input
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              type="text"
              autoComplete="family-name"
              className='text-center bg-[#ededed] drop-shadow-lg border-4 border-white h-12 w-50 rounded-full text-black text-lg font-bold placeholder:font-bold placeholder:text-gray-600 placeholder:font-[spaceMono] hover:scale-110 transition duration-300 ease-in-out focus:outline-none'
              placeholder='Last Name'
              required
            />
          </div>
          <div className="flex flex-row gap-4 relative top-22 -left-2.5 ">
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            type="text"
            autoComplete="username"
            className='relative top-10 text-center bg-[#ededed] drop-shadow-lg  border-4 border-white h-12 w-65 rounded-full text-black text-lg font-bold placeholder:font-bold placeholder:text-gray-600 placeholder:font-[spaceMono] hover:scale-110 transition duration-300 ease-in-out focus:outline-none '
            placeholder='Username'
            required
          />
          <div
            className='relative flex flex-col items-center justify-center bg-white border-4 border-cyan-300 rounded-2xl w-30 h-28  cursor-pointer  transition duration-300 ease-in-out hover:scale-110'
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onClick={() => fileInputRef.current.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleImageChange}
            />
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="h-23 w-23 object-cover rounded-full " />
            ) : (
              <span className="text-gray-600 text-sm font-[spaceMono] font-bold text-center">Add/Drag Profile<br/> image</span>
            )}
          </div>
          </div>

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            autoComplete="email"
            className='relative top-28 text-center bg-[#ededed] drop-shadow-lg  border-4 border-white h-12 w-105 rounded-full text-black text-lg font-bold placeholder:font-bold placeholder:text-gray-600 placeholder:font-[spaceMono] hover:scale-110 transition duration-300 ease-in-out focus:outline-none'
            placeholder='Email'
            required
          />
          <input
            name="password"
            value={form.password}
            onChange={handleChange}
            type="password"
            autoComplete="new-password"
            className='relative top-32 text-center bg-[#ededed] drop-shadow-lg  border-4 border-white h-12 w-105 rounded-full text-black text-lg font-bold placeholder:font-bold placeholder:text-gray-600 placeholder:font-[spaceMono] hover:scale-110 transition duration-300 ease-in-out focus:outline-none'
            placeholder='Password'
            required
          />
          
          <button
            onClick={submitHandler}
            className='relative top-45 bg-transparent drop-shadow-sm drop-shadow-cyan-300 border-4 border-white h-14 w-60 rounded-full text-white text-2xl font-bold hover:scale-110 hover:cursor-pointer transition duration-300 ease-in-out animate- font-[spaceMono]'
            type="submit"
          >
            Sign Up
          </button>
        </form>
      </div>
      <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-150 w-135 bg-[#4f4f4f] opacity-40 blur-2xl rounded-4xl'>

      </div>
    </>
  )
}

export default SignUp