import initializeAuthentication from "../components/Firebase/Firebase-init";
import { getAuth, signInWithPopup, GoogleAuthProvider,signOut,onAuthStateChanged , createUserWithEmailAndPassword,signInWithEmailAndPassword} from "firebase/auth";
import { useEffect, useState } from "react";


initializeAuthentication();

const useFirebase =()=>{
const auth =getAuth();
const [user,setUser]=useState({})
const [email,setEmail] =useState("");
const [password,setPassword] =useState("");
const [error,setError] = useState("")
const [isLogIn,setIsLogIn] =useState(false);
const googleProvider = new GoogleAuthProvider();

const signInUsingGoogle =()=>{
 return  signInWithPopup(auth,googleProvider)
  .catch(error => {
    setError(error.message);
    });
}

const logOut = ()=>{
  signOut(auth)
  .then(()=>{
    setUser({})
  })
}

useEffect(()=>{
  const unsubscribe  =onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user)
      } 
    });
    return unsubscribe;
  },[])


  const  handleSignup=e=>{
    e.preventDefault();
    if(email === ''){
      setError('Input Field is Required');
      return;
    }
   if(!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(email)){
     setError('E-mail Not Validate');
     return;
   }
    if(password.length < 6 ){
      setError(' Password should be at least 6 characters');
      return;
    }
     
    
  
    isLogIn? signInWithEmail(email,password) :createNewUser(email,password);

      
  }
// here processLogin
  const signInWithEmail=(email,password)=>{
   signInWithEmailAndPassword(auth,email,password)
   .then(result=>{
     setUser(result.user)
   })
     .catch(error => { 
     setError('')    
      });
  }
// here new user Create
  const createNewUser =(email,password)=>{
    return createUserWithEmailAndPassword(auth,email,password)
    .catch(error => {
      setError('');     
      });
  }

// here Email Change
   const handleEmailChange = e=>{
     setEmail(e.target.value);
   }
   // here password Change
   const handlePasswordChange = e=>{
     setPassword(e.target.value);
   }
 

 // here return all property

return{
  user,
  error,
  email,
  password,
  setError,
  signInUsingGoogle,
  logOut,
  handleSignup,
  handleEmailChange,
  handlePasswordChange,
  createNewUser,
  signInWithEmail

 
}

}

export default useFirebase;