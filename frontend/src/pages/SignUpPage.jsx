import React from 'react'
import { useState } from 'react'
import {ShieldCheck} from "lucide-react"
import { Link } from 'react-router'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { signup } from '../lib/api'

const SignUpPage = () => {
  const [signupData , setsignupData] = useState({
    fullName : "",
    email : "",
    password : "",
  });

  const queryClient = useQueryClient();

  const {mutate:signupMutation , isPending , error} = useMutation({
    mutationFn:signup,
    onSuccess : () => queryClient.invalidateQueries({queryKey : ["authUser"]}),
  });

  const handleSignUp = (e) =>{
    e.preventDefault();
    signupMutation(signupData);
  }

  return (
    <div className='h-screen flex items-center justify-center p-4 sm:p-6 md:p-8' data-theme = "forest">
      <div className='border border-primary/25 flex flex-col lg:flex-row w-full max-w-5xl mx-auto bg-base-100 rounded-xl shadow-lg overflow-hidden'>
        {/* SIGNUP FORM - LEFT SIDE */}
        <div className='w-full lg:w-1/2 p-4 sm:p-8 flex flex-col'>
        {/*logo */}
        <div className='mb-4 flex items-center justify-start gap-2'>
        <ShieldCheck className='size-9 text-primary'/>
        <span className='text-3xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary tracking-wider'>
        Connectly
        </span>
        </div>

      {/*SIGNUP FORM */}
        <div className='w-full'>
          <form onSubmit={handleSignUp}>
            <div className='space-y-4'>
            <div>
              <h2 className='text-xl font-semibold'>Create an Account</h2>
              <p className='text-sm opacity-70'>Join Connectly and start your language learning adventure</p>
            </div>

            <div className='space-y-3'>
              {/*Full Name */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Full Name</span>
                </label>
                <input type="text" placeholder='John Doe' className='input input-bordered w-full' value={signupData.fullName} onChange={(e)=>setsignupData({...signupData , fullName: e.target.value})} required/>
              </div>

            {/*Email */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Email</span>
                </label>
                <input type="text" placeholder='john@gmail.com' className='input input-bordered w-full' value={signupData.email} onChange={(e)=>setsignupData({...signupData , email: e.target.value})} required/>
              </div>

              {/*Password */}
              <div className='form-control w-full'>
                <label className='label'>
                  <span className='label-text'>Password</span>
                </label>
                <input type="password" placeholder='*********' className='input input-bordered w-full' value={signupData.password} onChange={(e)=>setsignupData({...signupData , password: e.target.value})} required/>
                <p className='text-xs opacity-70 mt-1'>
                  Password must be at least 6 characters long
                </p>
              </div>

            {/*Error message if any ... */}
              {error && (
                <div className='alert alert-error mb-2'>
                 <span>{error.response?.data?.message || error.message}</span>
                </div>
              )}

              {/*Terms & condition */}
               <div className='form-control'>
                <label className='label curson-pointer justify-start gap-2'>
                  <input type="checkbox" className='checkbox checkbox-sm' required/>
                  <span className='text-sm leading-tight'>
                    I agree to the {" "}
                    <span className='text-primary hover:underline'> terms of service</span> and {" "}
                    <span className='text-primary hover:underline'>privacy policy</span>
                  </span>
                </label>
              </div>
            </div>
            
            <button className='btn btn-primary w-full' type='submit'>
              {isPending ? (
                <>
                  <span className='loading loading-spinner loading-xs'></span>
                  Loading...
                </>
              ):("Create Account")
              }
              </button>

            <div className='text-center mt-4'>
              <p className='text-sm'>
                Already have an account ?{" "}
                <Link to="/login" className="text-primary hover:underline"> Sign in </Link>
              </p>
            </div>
          </div>
          </form>
        </div>

        </div>

        {/* SIGNUP FORM - RIGHT SIDE */}
        <div className='hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center'>
          <div className='max-w-md p-10'>
            <div className='relative aspect-square max-w-sm mx-auto'>
              <img src="/video.png" alt="language connection illustration" className='w-full h-full'/>
            </div>
            <div className='text-center space-y-3 mt-6'>
              <h2 className='text-xl font-semibold'>Connect with Language partners worldwide</h2>
              <p className='opacity-70'>
                Practice conversations , make friends , and improve your language skills together
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
