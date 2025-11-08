import React, { useState } from 'react'
import SideBar from '../components/SideBar'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const NewClaim = () => {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [category, setCategory] = useState('')

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('isAnonymous', isAnonymous)
    if (selectedFile) {
      formData.append('image', selectedFile) 
    }

    setTitle('')
    setDescription('')
    setSelectedFile(null)
    setIsAnonymous(false)
    setCategory('')

    await axios.post(`${import.meta.env.VITE_BASE_URL}/claim/new-claim`, formData, {
      withCredentials: true,
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    alert('Claim submitted successfully!')
    navigate('/home')
  }

  const categories = [
    'Politics',
    'Health',
    'Education',
    'Entertainment',
    'Science and Tech',
    'Finance',
    'Sports',
    'Miscellaneous'
  ]

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-screen -z-10">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          src="https://video.wixstatic.com/video/f1c650_988626917c6549d6bdc9ae641ad3c444/720p/mp4/file.mp4"
        />
      </div>

      <div className="h-screen w-full flex items-center p-4 -ml-0.5">
        <SideBar />

        <div className="w-3/4 h-full flex border-4 border-white text-white flex-col justify-between px-8  rounded-3xl shadow-lg shadow-purple-800 ml-20 bg-transparent">
          <div
            className="text-[55px] tracking-wide ml-1 font-bold flex items-start justify-start font-[monaco]"
            style={{ textShadow: '3px 3px 2.5px #51E5F8' }}
          >
            New Claim
          </div>

          <div className="absolute top-25 rounded-3xl h-125.5 w-[68%] bg-gradient-to-b  from-gray-400 to-black opacity-30 z-0"></div>

          <div className="w-full h-[95%] tracking-wide rounded-3xl border-5 border-cyan-300 z-2 flex items-center justify-center text-black shadow-md shadow-cyan-500 -mt-1 mb-2">
            <form
              onSubmit={handleSubmit}
              className="w-[90%] flex flex-col gap-5 font-[spaceMono] text-lg font-semibold"
            >
              <input
                type="text"
                placeholder="Claim Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="border-3 text-white border-gray-300 caret-white placeholder:text-white rounded-xl p-2 outline-none focus:border-cyan-500 transition hover:cursor-pointer hover:scale-105 duration-200 ease-in-out focus:scale-105"
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border-3 text-white border-gray-300 caret-white placeholder:text-white rounded-xl p-2 h-32 resize-none outline-none focus:border-cyan-500 transition hover:cursor-pointer hover:scale-105 duration-200 ease-in-out focus:scale-105"
                required
              />

              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border-2 bg-transparent  text-white border-gray-300 rounded-xl p-2 outline-none hover:cursor-pointer hover:scale-105 focus:border-cyan-500 transition duration-200 ease-in-out"
              >
                <option value="" disabled>Select Category</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat} className="text-black accent-purple-600 hover:bg-purple-600 hover:cursor-pointer ">
                    {cat}
                  </option>
                ))}
              </select>

              <label className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-white">
                  Upload Image/Video (optional)
                </span>
                <input
                  type="file"
                  onChange={(e) => setSelectedFile(e.target.files[0])}
                  className="border-2 border-gray-300 text-white hover:cursor-pointer rounded-xl p-2 hover:scale-105 duration-200 ease-in-out file:bg-purple-600 file:cursor-pointer file:text-white file:rounded file:px-4 file:py-1"
                  accept="image/*,video/*"
                />
              </label>

              <label className="flex w-75 items-center gap-2 text-white text-sm hover:cursor-pointer hover:scale-105 duration-200 ease-in-out">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-purple-600 w-5 h-5 hover:cursor-pointer hover:scale-105 duration-200 ease-in-out"
                />
                Submit anonymously (optional)
              </label>

              <button
                type="submit"
                className=" bg-purple-600 text-white py-2 rounded-xl hover:cursor-pointer font-bold text-lg hover:bg-purple-700 transition active:scale-95 hover:scale-105 duration-200 ease-in-out focus:scale-105"
              >
                Submit Claim
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

export default NewClaim
