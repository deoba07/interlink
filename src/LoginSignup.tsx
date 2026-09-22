import { useState } from "react";
import "./LoginSignup.css";
import {  useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";

function LoginSignup() {
  const navigate = useNavigate();

  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [signupData, setSignupData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* ---------------- LOGIN ---------------- */

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);

    try {
      const res = await fetch("https://backlink-6l9m.onrender.com/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await res.json();

      if (!res.ok) {
      setLoginLoading(false);
      toast.error(data.message);
      return;
   }

      localStorage.setItem("token", data.token);

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      toast.success("Login Successful!");

      setTimeout(() => {
      setLoginLoading(false);
      navigate("/opportunities");
      }, 1000);

     

    } catch (err) {
      console.error(err);
      setLoginLoading(false);
      toast.error("Something went wrong.");
    }
  };


 

  /* ---------------- SIGN UP ---------------- */

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSignupLoading(true);

    if (signupData.password !== signupData.confirmPassword) {
    toast.error("Passwords do not match.");
    return;
    }

    try {
      const res = await fetch("https://backlink-6l9m.onrender.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setSignupLoading(false);
        toast.error(data.message);
        return;
      }

      toast.success("Account created successfully!");

      setSignupData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      });

      setTimeout(() => {
      setSignupLoading(false);
      }, 1000);

    } catch (err) {
      console.error(err);
      setSignupLoading(false);
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="auth-page">

      <div
        className={`auth-container ${
          isLogin ? "show-login" : "show-signup"
        }`}
      >

        {/* LOGIN */}

        <div className="form-column login-slot">

          <form className="auth-form" onSubmit={handleLogin}>

            <h2>Login</h2>

            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value,
                })
              }
              required
            />

            <div className="password-input">
            <input
            type={showLoginPassword ? "text" : "password"}
            placeholder="Password"
           value={loginData.password}
           onChange={(e) =>
            setLoginData({
          ...loginData,
          password: e.target.value,
          })
         }
         required
          />

          <button
          type="button"
          className="toggle-password"
          onClick={() => setShowLoginPassword(!showLoginPassword)}
           >
          {showLoginPassword ? <FiEyeOff /> : <FiEye />}
          </button>
          </div>

            <div className="auth-links">
<button
  type="button"
  className="mobile-auth-switch"
  onClick={() => setIsLogin(false)}
>
  Don't have an account? <strong>Sign Up</strong>
</button> 
            </div>


           

            <button 
            className="primary-btn"
            disabled={loginLoading}>
              {loginLoading ? "Logging in..." : "Login"}
            </button>



          </form>

          


        </div>

        {/* SIGNUP */}

        <div className="form-column signup-slot">

          <form className="auth-form" onSubmit={handleSignup}>

            <h2>Create Account</h2>

            <input
              type="text"
              placeholder="Full Name"
              value={signupData.name}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  name: e.target.value,
                })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={signupData.email}
              onChange={(e) =>
                setSignupData({
                  ...signupData,
                  email: e.target.value,
                })
              }
              required
            />

            <div className="password-input">
            <input
            type={showSignupPassword ? "text" : "password"}
            placeholder="Password"
            value={signupData.password}
            onChange={(e) =>
            setSignupData({
            ...signupData,
            password: e.target.value,
           })
           }
            required
           />

           <button
           type="button"
          className="toggle-password"
          onClick={() => setShowSignupPassword(!showSignupPassword)}
           >
          {showSignupPassword ? <FiEye /> : <FiEyeOff />}
         </button>
        </div>


         <div className="password-input">
         <input
         type={showConfirmPassword ? "text" : "password"}
         placeholder="Confirm Password"
         value={signupData.confirmPassword}
         onChange={(e) =>
         setSignupData({
        ...signupData,
        confirmPassword: e.target.value,
         })
        }
        required
        />

         <button
         type="button"
         className="toggle-password"
         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
       >
        {showConfirmPassword ? <FiEye /> : <FiEyeOff />}
        </button>
        </div>


              <button
type="button"
className="mobile-auth-switch"
onClick={() => setIsLogin(true)}

>

Already have an account? <strong>Sign In</strong> </button>

        <button
       className="primary-btn"
       disabled={signupLoading}
       >
       {signupLoading ? "Creating Account..." : "Sign Up"}
       </button>

          </form>

        </div>

        {/* BLUE PANEL */}

        <div className="sliding-overlay">

          <div className="overlay-panel">

            <h1>
              {isLogin ? "Welcome Back!" : "Join Us"}
            </h1>

            <p>
              {isLogin
                ? "Ready for your next step? Let's lock in your internship."
                : "Bridge the gap between learning and leading."}
            </p>

            <button
              className="switch-btn"
              onClick={() => setIsLogin(!isLogin)}
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>

          </div>

        </div>

      </div>




    </div>
  );
}

export default LoginSignup;