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
  const [message, setMessage] = useState('')
  const [messageType, setMessageType] = useState('')

  const navigate = useNavigate()

  const showMessage = (msg, type) => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => setMessage(''), 3000)
  }

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    const allowed = [
      'image/jpeg', 'image/png', 'image/gif',
      'video/mp4', 'video/webm', 'video/ogg'
    ]
    if (!allowed.includes(file.type)) {
      showMessage('Invalid file type.', 'error')
      return
    }

    if (file.size > 50 * 1024 * 1024) {
      showMessage('File too large (50MB max).', 'error')
      return
    }

    setSelectedFile(file)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData()
    formData.append('title', title)
    formData.append('description', description)
    formData.append('category', category)
    formData.append('isAnonymous', isAnonymous)
    if (selectedFile) formData.append('image', selectedFile)

    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/claim/new-claim`,
        formData,
        { withCredentials: true }
      )
      showMessage('Claim submitted successfully!', 'success')
      navigate('/home')
    } catch {
      showMessage('Failed to submit claim.', 'error')
    }
  }

  const categories = [
    'Politics','Health','Education','Entertainment',
    'Science and Tech','Finance','Sports','Miscellaneous'
  ]

  return (
    <>
      {/* Background (same as HomeScreen) */}
      <div className="fixed inset-0 -z-10">
        <video
          autoPlay
          loop
          muted
          className="w-full h-full object-cover"
          src="https://video.wixstatic.com/video/f1c650_988626917c6549d6bdc9ae641ad3c444/720p/mp4/file.mp4"
        />
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {message && (
        <div className={`fixed top-4 right-4 px-4 py-3 rounded-xl z-50 text-white
          ${messageType === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {message}
        </div>
      )}

      <div className="h-screen w-full flex items-center p-4">
        <SideBar />

        <div
          className="
            w-3/4 h-full flex flex-col
            border-3 border-purple-500/70
            text-white px-8
            rounded-xl
            shadow-lg shadow-purple-700/40
            ml-20 bg-transparent
          "
        >
          {/* Title */}
          <div
            className="text-[55px] tracking-wide  font-[monaco]"
            style={{ textShadow: '2px 2px 3px rgba(123,108,255,0.6)' }}
          >
            New Claim
          </div>

          {/* Soft inner overlay */}
          <div
            className="
              absolute top-25 rounded-xl
              h-125.5 w-[68%]
              bg-gradient-to-b from-gray-500 to-black
              opacity-20 z-0
            "
          />

          {/* Form container */}
          <div
            className="
              w-full h-[85%]
              rounded-xl border-3 border-gray-400
              bg-[#141823]
              z-10 flex items-center justify-center
              shadow-md shadow-purple-600/40
              -mt-2
            "
          >
            <form
              onSubmit={handleSubmit}
              className="w-[90%] flex flex-col gap-5 font-[spaceMono] text-lg opacity-90"
            >
              <input
                type="text"
                placeholder="Claim Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="
                  bg-transparent text-white placeholder:text-gray-300
                  border-2 border-gray-400
                  rounded-lg p-2 outline-none
                  focus:border-purple-500
                  transition hover:scale-103 hover:cursor-pointer
                "
                required
              />

              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="
                  bg-transparent text-white placeholder:text-gray-300
                  border-2 border-gray-400
                  rounded-lg p-2 h-32 resize-none
                  outline-none focus:border-purple-500
                  transition hover:scale-103 hover:cursor-pointer
                "
                required
              />

              <select
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
                  bg-transparent text-white
                  border-2 border-gray-400
                  rounded-lg p-2 outline-none
                  transition hover:scale-103 hover:cursor-pointer
                "
              >
                <option value="" disabled>Select Category</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat} className="text-black">
                    {cat}
                  </option>
                ))}
              </select>

              <input
                type="file"
                onChange={handleFileChange}
                accept="image/*,video/*"
                className="
                  border-2 border-gray-400
                  rounded-lg p-2
                  file:bg-purple-600 file:text-white
                  file:rounded file:px-4 file:py-1 file:mr-3
                  transition hover:scale-103 hover:cursor-pointer
                "
              />

              <label className="flex items-center gap-2 text-white text-sm hover:scale-103 hover:cursor-pointer transition">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="accent-purple-600 w-5 h-5 hover:cursor-pointer"
                />
                Submit anonymously
              </label>

              <button
                type="submit"
                className="
                  bg-purple-600 text-white py-2
                  rounded-lg font-bold
                  hover:bg-purple-700
                  hover:scale-103 transition hover:cursor-pointer
                "
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
