import Loader from "@/components/Loader";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import { useRouter } from "next/router";

export default function Home() {
  const { loading, currentUser } = useAuth();
  const router = useRouter();

  const RedirectSignup = () => {
     router.replace("/signin");
     return <></>
  };
  console.log("Home",loading,currentUser);
  
  return <>{loading ? <Loader /> : currentUser ? <div>Feed</div> : <RedirectSignup />}</>;
}
