import Image from "next/image"
import AuthForm from "./components/AuthForm"

export default function Home() {
    return (
      <div className="flex h-fit py-16 flex-col justify-center sm:px-6 lg:px-8 
      bg-gradient-to-br from-blue-900 via-black to-blue-900 text-white">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
            {/* <Image 
            alt="logo"
            height='100' 
            width='100'
            className="mx-auto w-auto mt-[-5px]"
            src='/images/logo.png' 
            /> */}
            <h2 className="mt-[-30px] text-center text-3xl font-bold tracking-tight">
                Sign in to your account
            </h2>
        </div>
        <AuthForm />
      </div>
    )
  }
  