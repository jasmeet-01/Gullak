import React, {useState} from 'react'
import {FaRegEye, FaRegEyeSlash} from 'react-icons/fa6'

const Input = ({value, onChange,label,placeholder,type}) => {
  const [showPassword, setShowPassword] = useState(false);

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div >
      <label className='text-sm font-medium text-slate-800'>{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
        className='w-full p-3 rounded-md border border-slate-300 mt-1 mb-4 bg-slate-100 outline-none focus:border-slate-600'
      />

      {type === 'password' && (
        <>
        {showPassword ? (
        <FaRegEye
        size={22}
          className='text-primary cursor-pointer '
          onClick={() => toggleShowPassword()}
          
        />
        ):(
          <FaRegEyeSlash
          size={22}
          className='absolute right-3 top-[38px] cursor-pointer text-slate-400'
          onClick={() => toggleShowPassword()}  
        />
        )}
        </>
      )}
    
    </div>
  )
}

export default Input