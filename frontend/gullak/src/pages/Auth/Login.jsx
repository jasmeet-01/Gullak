import React, { useContext, useState } from 'react'
import AuthLayout from '../../components/layouts/AuthLayout'
import {Link, useNavigate } from 'react-router-dom';
import Input from '../../components/inputs/input';
import { validateEmail } from '../../utils/helper';
import axiosInstance from '../../utils/axiosInstance';
import { API_PATHS } from '../../utils/apiPaths';
import { UserContext }from "../../context/UserContext"

const Login = () => {
  const [email,setEmail] =useState("");
  const [password, setPassword] =useState("");
  const [error, setError] =useState(null);

  const { updateUser } = useContext(UserContext);

  const navigate = useNavigate();

  //Handle login Form Submit
  const handleLogin =async (e) => {
    e.preventDefault();
    if(!validateEmail(email)){
      setError("Please enter a valid email address");
      return;
    }

    if(!password){
      setError("Please enter your password");
      return;
    }
    setError("");

    //Login API call
    try{
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });
      const { token, user } = response.data; 

      if(token){
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }
    }catch(err){
      if(err.response && err.response.data.message){
        setError(err.response.data.message);
      } else {
        setError("Something went wrong. Please try again later.");
      }
    }
  }

  return (
    <AuthLayout>
      <div className='lg:w=[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='r=text-xl font-semibold text-black'>Welcome Back</h3>
        <p className='text-xs text-slate-700 mt-[5px] mb-6'>
          Enter your details to login
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({target}) => setEmail(target.value)}
            label="Email Address"
            placeholder='jass@example.com'
            type='text'
          />

          <Input
            value={password}
            onChange={({target}) => setPassword(target.value)}
            label="Password"
            placeholder='Min 8 characters'
            type='password'
          />
          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button type="submit" className='w-[100%] h-auto p-2.5 bg-cyan-600 text-xl text-white justify-center'>
            LOGIN
          </button>
          <p className='text-[13px] text-slate-800 mt-3'>
            Don't have an account?{" "}
            <Link to='/signUp' className='font-medium text-primary underline'>
              SignUp
            </Link>
          </p>

        </form>

      </div>
    </AuthLayout>
  )
}

export default Login