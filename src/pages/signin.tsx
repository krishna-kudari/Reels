import Image from "next/image";
import React, { FormEvent, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { reels_mark, reels_mark_solid } from "@/../public/assets";
import { CloudArrowDownIcon, CloudArrowUpIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {motion, AnimatePresence } from "framer-motion";
import useFilePReview from "@/hooks/useFilePreview";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getStorageRef } from "@/util/functions";
import { setDoc, doc } from "firebase/firestore";
import { userInfo } from "os";
import { db } from "@/firebase/store";
import { Router, useRouter } from "next/router";
interface signinProps {}

interface LoginFormData {
  email: string;
  password: string;
}

const signin: React.FC<signinProps> = ({}) => {
  const router = useRouter();
  const [imageUrl ,setImageUrl] = useState<string|undefined>();
  const [show, setshow] = useState<boolean>(false);
  const [authAction, setAuthAction] = useState<"Login" | "Signup">("Signup"); //animate state
  const {currentUser, signIn, signinWithGoogle, signinWithGitHub, createUser } = useAuth();
  const {
    register,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const {
    register: register_signup,
    setValue: setValue_signup,
    handleSubmit: handleSubmit_signup,
    formState: {errors: errors_signup}
  } = useForm();
  //Switch to Sign Up Form function
  const switchToSignUp = (event: React.SyntheticEvent) => {
    // animate form to signUp
    setAuthAction("Signup");
  };

  //Switch to Log In Form function
  const switchToLogIn = (event: React.SyntheticEvent) => {
    // animate form to signUp
    setAuthAction("Login");
  };

  //Login Form OnSubmit
  const onSubmit = handleSubmit(async (data) => {
    console.log("LoginFormData", data);
    try {
      const user = await signIn(data.email, data.password);
      console.log(user);
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setValue("email", "");
      setValue("password", "");
    }
  });
  //SignUp Form OnSubmit
  const onSubmit_SignUp = handleSubmit_signup(async (data) => {
    console.log("SignupFormData", data);
    const profile_pic = data.profile_picture[0];
    console.log(profile_pic);
    
    try {
      createUser(data.signup_email, data.signup_password).then((userCredential)=>{
        const user = userCredential.user;
        console.log(user);
        const userId = user.uid;
        const profile_picture_ref = getStorageRef(`users/${userId}/ProfileImage`);
        uploadBytes(profile_picture_ref,profile_pic).then(async (snapshot)=>{
          console.log(snapshot);
          const downloadUrl = await getDownloadURL(snapshot.ref);
          console.log(downloadUrl);
          const userDoc = {
            username : data.signup_username,
            email: data.signup_email,
            password: data.signup_password,
            profile_picture_url: downloadUrl,
            userId,
          }
          await setDoc(doc(db, "users", userId), userDoc);
          toast.success("account created");
          router.replace("/");
        }).catch((error:any) =>{
          const errorMessage = error.message;
          console.log(error);
          toast.error(errorMessage);
        })
      }).catch((error:any) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode,errorMessage);
        toast.error(errorMessage);
      })
      
    } catch (error: any) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setValue("email", "");
      setValue("password", "");
    }
  });

  //continue with google
  const signInWithGoogle = () => {
    console.log("SIGNIN WITH GOOGlE:");
    signinWithGoogle();
  };

  function signInWithGitHub(): void {
    console.log("SIGNIN WITH GITHUB:");
    signinWithGitHub();
  }

  // on profile_picture_upload 
  const profile_pic_preview =(event:React.SyntheticEvent &{target:  HTMLInputElement }) => {
    if(!event.target?.files)return;
    console.log("File uploaded" ,event.target.files[0]);
    const newUrl = URL.createObjectURL(event.target.files[0]);
    setImageUrl(newUrl);
  }

  return (
    <div
      className="h-screen overflow-hidden border flex items-center justify-center"
      style={{
        background: "linear-gradient(135deg,white 0% 50%, #000 50% 100%)",
      }}
    >
      <div className="flex bg-white rounded-lg overflow-hidden shadow shadow-gray-700 min-w-[80vw]">
        <div className=" hidden md:flex w-[45%] z-10 bg-gray-50 flex-col justify-between">
          <div className="flex space-x-1 p-4 px-8 items-center ">
            <div className="relative  h-5 w-5 ">
              <Image src={reels_mark_solid} alt={"🎬🎞️"} />
            </div>
            <p className="font-bold text-xl text-slate-900 ">reels</p>
          </div>
          <div>{/* <Image src={""} alt={""} /> */}</div>
          <div className="flex items-center justify-center p-8 ">
            <p className="text-xs truncate text-gray-400 font-medium">
              Used by millions of people around the world
            </p>
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div 
            key={authAction}
            initial={{x: "90vw", opacity: 0.8}}
            animate={{x: 0, opacity: 1}}
            exit={{x:"-90vw" , zIndex:1 , opacity:0.8}}
            transition={{delay:-0.2,duration: 0.6}}
            className="w-[100%] md:w-[55%]"
          >
{authAction == "Login" ? (
          <div className="w-full bg-white flex flex-col justify-between ">
            <div className="flex-shrink-0  flex  w-full p-4 px-8 items-center space-x-3">
              <p className="w-full text-right text-xs font-medium text-gray-500 block">
                Don't have an account?
              </p>
              <button
                onClick={switchToSignUp}
                type="button"
                className="text-xs flex-shrink-0 block font-medium text-gray-700 border-2  rounded px-2 py-1"
              >
                Sign Up
              </button>
            </div>
            <div className="h-full  px-12 space-y-10">
              <div className="space-y-2 ">
                <p className="font-semibold text-gray-500">LOGIN</p>
                <p className="font-medium text-gray-700 text-3xl">
                  Welcome Back
                </p>
                <p className="font-semibold text-gray-400 text-sm">
                  Please enter your account details
                </p>
              </div>
              <div className="">
                <form onSubmit={onSubmit} className="">
                  {/* <label
                  htmlFor="input-email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Email
                </label> */}
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="input-email"
                      {...register("email",{required:true})}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded outline-none focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={errors.email ? "email required":"name@⚡✉️.com"}
                    />
                  </div>
                  {/* <label
                  htmlFor="website-admin"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label>
                <div className="flex relative mb-6">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    @
                  </span>
                  <input
                    type="text"
                    id="website-admin"
                    className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 outline-none focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="elonmusk"
                  />
                </div> */}
                  {/* <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label> */}
                  <div className="relative mb-6">
                    <div
                      onClick={() => setshow(!show)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer "
                    >
                      {show ? (
                        <EyeIcon
                          aria-hidden="true"
                          fill="currentColor"
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        />
                      ) : (
                        <EyeSlashIcon
                          aria-hidden="true"
                          fill="currentColor"
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        />
                      )}
                    </div>
                    <input
                      type={show ? "text" : "password"}
                      id="password"
                      autoComplete="off"
                      {...register("password",{required:true,minLength:8,maxLength:64})}
                      className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded outline-none focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={errors.password ? "8<📏<64":"💠💠💠💠💠💠💠💠"}
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    CONTINUE
                  </button>
                  <div className="flex items-center my-4 before:flex-1 before:border-t-2 before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t-2 after:border-gray-300 after:mt-0.5">
                    <p className="text-center text-gray-500 font-semibold mx-4 mb-0">
                      OR LOGIN WITH
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <button
                      type="button"
                      onClick={() => signInWithGitHub()}
                      className="w-1/2 inline-flex items-center justify-center text-white bg-gradient-to-r from-gray-700 via-gray-800 to-black hover:bg-gradient-to-br focus:ring-4 focus:outline-none focus:ring-gray-200 dark:focus:ring-gray-200 font-medium rounded text px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      <svg
                        className="w-6 h-6 mr-2 -ml-1"
                        aria-hidden="true"
                        focusable="false"
                        data-prefix="fab"
                        data-icon="github"
                        role="img"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 496 512"
                      >
                        <path
                          fill="currentColor"
                          d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3 .3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5 .3-6.2 2.3zm44.2-1.7c-2.9 .7-4.9 2.6-4.6 4.9 .3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3 .7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3 .3 2.9 2.3 3.9 1.6 1 3.6 .7 4.3-.7 .7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3 .7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3 .7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"
                        ></path>
                      </svg>
                      GitHub
                    </button>
                    <button
                      type="button"
                      onClick={() => signInWithGoogle()}
                      className="w-1/2 inline-flex items-center justify-center  text-gray-700 dark:text-white border-2 border-gray-200  focus:outline-none focus:border-blue-500 dark:focus:border-blue-800 font-medium rounded text px-5 py-2.5 text-center mr-2 mb-2"
                    >
                      <svg
                        className="w-6 h-6 mr-2 -ml-2"
                        xmlns="http://www.w3.org/2000/svg"
                        xmlnsXlink="http://www.w3.org/1999/xlink"
                        viewBox="0 0 48 48"
                      >
                        <defs>
                          <path
                            id="a"
                            d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"
                          />
                        </defs>
                        <clipPath id="b">
                          <use xlinkHref="#a" overflow="visible" />
                        </clipPath>
                        <path
                          clipPath="url(#b)"
                          fill="#FBBC05"
                          d="M0 37V11l17 13z"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#EA4335"
                          d="M0 11l17 13 7-6.1L48 14V0H0z"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#34A853"
                          d="M0 37l30-23 7.9 1L48 0v48H0z"
                        />
                        <path
                          clipPath="url(#b)"
                          fill="#4285F4"
                          d="M48 48L17 24l-4-3 35-10z"
                        />
                      </svg>
                      Google
                    </button>
                  </div>
                  {/* {errors.email && toast(`${errors.email.message}`)}
                  {errors.password && toast(`${errors.password.message}`)} */}
                </form>
              </div>
              <div className="">
                <p className="text-xs font-medium text-gray-400 truncate">
                  This site is protected by reCAPTCHA v3 and the Google <br />{" "}
                  <span className="underline">Privacy Policy</span> and{" "}
                  <span className="underline">Terms of Use</span> apply
                </p>
              </div>
            </div>
            <div className="p-8 flex-shrink-0">
              <ul className="flex justify-around text-xs font-medium text-gray-400 ">
                <li className="hidden lg:inline-block">Terms Of Use</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li className="hidden lg:inline-block">Status Page</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="w-full bg-white flex flex-col justify-between ">
            <div className="flex-shrink-0  flex  w-full p-4 px-8 items-center space-x-3">
              <p className="w-full text-right text-xs font-medium text-gray-500 block">
                Already have an account?
              </p>
              <button
                onClick={switchToLogIn}
                type="button"
                className="text-xs flex-shrink-0 block font-medium text-gray-700 border-2  rounded px-2 py-1"
              >
                Log In
              </button>
            </div>
            <div className="h-full  px-12 py-[3.2px] space-y-5">
              <div className="space-y-2 ">
                {/* <p className="font-semibold text-gray-500">SIGNUP</p> */}
                {/* <p className="font-medium text-gray-700 text-3xl">
                  CREATE YOUR ACCOUNT
                </p> */}
                <p className="font-semibold text-gray-400 text-sm">
                  Please enter your details
                </p>
              </div>
              <div className="">
                <form onSubmit={onSubmit_SignUp} className="">
                  {/* <label
                  htmlFor="signup-username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Username
                </label> */}
                <div className="flex relative mb-6">
                  <span className="inline-flex items-center px-3 text-sm text-gray-900 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md dark:bg-gray-600 dark:text-gray-400 dark:border-gray-600">
                    @
                  </span>
                  <input
                    type="text"
                    id="signup-username"
                    {...register_signup("signup_username",{required:true,maxLength:32})}
                    className="rounded-none rounded-r-lg bg-gray-50 border text-gray-900 outline-none focus:ring-blue-500 focus:border-blue-500 block flex-1 min-w-0 w-full text-sm border-gray-300 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="elonmusk"
                  />
                </div>
                  {/* <label
                  htmlFor="signup-input-email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Your Email
                </label> */}
                  <div className="relative mb-6">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg
                        aria-hidden="true"
                        className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                      </svg>
                    </div>
                    <input
                      type="email"
                      id="signup-input-email"
                      {...register_signup("signup_email",{required:true})}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded outline-none focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={errors_signup.signup_email ? "email required":"name@⚡✉️.com"}
                    />
                  </div>
                  {/* <label htmlFor="signup-password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your password</label> */}
                  <div className="relative mb-6">
                    <div
                      onClick={() => setshow(!show)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer "
                    >
                      {show ? (
                        <EyeIcon
                          aria-hidden="true"
                          fill="currentColor"
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        />
                      ) : (
                        <EyeSlashIcon
                          aria-hidden="true"
                          fill="currentColor"
                          className="w-5 h-5 text-gray-500 dark:text-gray-400"
                        />
                      )}
                    </div>
                    <input
                      type={show ? "text" : "password"}
                      id="signup-password"
                      autoComplete="off"
                      {...register_signup("signup_password",{required:true,maxLength:64,minLength:8})}
                      className=" bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded outline-none focus:ring-blue-500 focus:border-blue-500 block w-full pr-10 p-2.5  dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder={errors_signup.signup_password ? "8<📏<64 " :"💠💠💠💠💠💠"}
                    />
                  </div>

                  <div className="flex items-center justify-center w-full mb-6">
                    <label
                      htmlFor="dropzone-file"
                      className="flex flex-col items-center justify-center w-full  border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                    >
                      { imageUrl ? (
                        <div className="relative w-full h-[140px] overflow-auto">
                          <Image src={`${imageUrl}`} alt={"Profile_pic"}  fill className="object-contain aspect-square object-center"/>
                        </div>
                      ) : (
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        
                        <svg
                          aria-hidden="true"
                          className="w-10 h-10 mb-3 text-gray-400"
                          fill="none"
                          stroke={errors_signup.profile_picture ?"#FF9494":"currentColor"}
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          ></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                          <span className="font-semibold">Click to upload</span> or
                          drag and drop
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          SVG, PNG, JPG or GIF (MAX. 800x400px)
                        </p>
                      </div>
                        )}
                      
                      <input {...register_signup("profile_picture",{required:true})}  id="dropzone-file" type="file" accept="image/*" className="hidden" />
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-2 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded text-sm px-5 py-2.5 text-center mr-2 mb-2"
                  >
                    CREATE
                  </button>
                </form>
              </div>
              <div className="">
                <p className="text-xs font-medium text-gray-400 truncate">
                  This site is protected by reCAPTCHA v3 and the Google <br />{" "}
                  <span className="underline">Privacy Policy</span> and{" "}
                  <span className="underline">Terms of Use</span> apply
                </p>
              </div>
            </div>
            <div className="pb-8 pt-5 flex-shrink-0">
              <ul className="flex justify-around text-xs font-medium text-gray-400 ">
                <li className="hidden lg:inline-block">Terms Of Use</li>
                <li>Privacy Policy</li>
                <li>Cookie Policy</li>
                <li className="hidden xl:inline-block">Status Page</li>
                <li>Contact Us</li>
              </ul>
            </div>
          </div>
        )}
          </motion.div>
        </AnimatePresence>
        
      </div>
    </div>
    
  );
};

export default signin;
