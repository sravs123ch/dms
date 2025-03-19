import { useState } from "react";
import Logo from "../../assests/Images/imly-logo-new.jpg";
import Logo1 from "../../assests/Images/Deal visory logo 1.jpg";
import image from "../../assests/Images/imly-two.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../Context/AuthContext";
import PersonIcon from "@mui/icons-material/Person";
import LockIcon from "@mui/icons-material/Lock";
import { jwtDecode } from "jwt-decode";
import {
  CITIES_API,
  COUNTRIES_API,
  GETALLSTORES_API,
  LOGIN,
  STATES_API,
} from "../../Constants/apiRoutes";

import LoadingAnimation from "../../Components/Loading/LoadingAnimation";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Lottie from "lottie-react";
import animation from "../../assests/animations/Animation-1.json";
import DocumentBg from "../../assets/images/document-bg.svg";
import B2YLogo from "../../assests/Images/b2y-Logo.png";
import { HiMail, HiLockClosed } from "react-icons/hi";
import {
  HiDocument,
  HiPencil,
  HiUsers,
  HiShieldCheck,
  HiDocumentDuplicate,
  HiPencilAlt,
} from "react-icons/hi";
import DealVisorLogo from "../../assests/Images/Deal visor.png";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const [isStoreDataLoading, setIsStoreDataLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const features = [
    {
      icon: "📄",
      title: "Document Upload",
      description: "Securely upload and manage your documents",
    },
    {
      icon: "✍️",
      title: "Digital Signatures",
      description: "Sign documents electronically",
    },
    {
      icon: "👥",
      title: "Collaboration",
      description: "Review and approve documents together",
    },
    {
      icon: "🔒",
      title: "Secure Storage",
      description: "Keep your documents safe and organized",
    },
  ];

  // Fetch data from the APIs if not present in local storage
  const fetchApiData = async () => {
    const storedCitiesData = localStorage.getItem("citiesData");
    const storedStatesData = localStorage.getItem("statesData");
    const storedCountriesData = localStorage.getItem("countriesData");

    if (!storedCitiesData || !storedStatesData || !storedCountriesData) {
      try {
        const resCities = storedCitiesData
          ? JSON.parse(storedCitiesData)
          : await fetch(CITIES_API).then((res) => res.json());
        const resStates = storedStatesData
          ? JSON.parse(storedStatesData)
          : await fetch(STATES_API).then((res) => res.json());
        const resCountries = storedCountriesData
          ? JSON.parse(storedCountriesData)
          : await fetch(COUNTRIES_API).then((res) => res.json());

        // Store in localStorage
        localStorage.setItem("citiesData", JSON.stringify(resCities));
        localStorage.setItem("statesData", JSON.stringify(resStates));
        localStorage.setItem("countriesData", JSON.stringify(resCountries));
      } catch (error) {
        console.error("Error fetching API data:", error);
      }
    }
  };
  const fetchAndStoreStoresData = async () => {
    setIsStoreDataLoading(true);

    // Retrieve userID from local storage
    const userID = localStorage.getItem("UserID");

    if (!userID) {
      console.error("UserID not found in local storage");
      setIsStoreDataLoading(false);
      return [];
    }

    const params = {
      pageNumber: 1,
      pageSize: 1000,
    };

    try {
      const storeResponse = await fetch(
        `${GETALLSTORES_API}?UserID=${userID}&${new URLSearchParams(
          params
        ).toString()}`
      );
      const storesData = await storeResponse.json();
      const stores = storesData.Stores || [];
      localStorage.setItem("storesData", JSON.stringify(stores));

      // Dispatch an event to notify that store data is ready
      window.dispatchEvent(new Event("storeDataReady"));

      return stores;
    } catch (error) {
      console.error("Error fetching store data:", error);
      return [];
    } finally {
      setIsStoreDataLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch(LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ Email: email, Password: password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token } = data;

        const decodedToken = jwtDecode(token);
        const roleID = decodedToken.RoleID;
        const userID = decodedToken.UserID;
        const TenantID = decodedToken.TenantID;

        localStorage.setItem("UserID", userID);
        localStorage.setItem("TenantID", TenantID);

        console.log("login UserID", userID);
        console.log("login TenantID", TenantID);
        login(token, roleID, userID);

        // Wait for both data fetching operations to complete
        await Promise.all([
          // fetchApiData(),
          // fetchAndStoreStoresData(),
          // fetchUserDetails(),
        ]);

        // Now that all data is loaded, navigate to the dashboard
        navigate("/dashboard");
        // Add a 5-second delay before navigation
        // setTimeout(() => {
        //   navigate("/dashboard");
        // }, 3000); // 5 seconds delay
      } else {
        console.error("Login failed:", data.message);
        setError(data.message);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 10000); // 5 seconds delay
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };
  const handleForgotPassword = () => {
    setIsLoading(true); // Start loading
    setTimeout(() => {
      navigate("/forgot-password"); // Navigate after a delay
      setIsLoading(false); // Stop loading after navigation
    }, 500); // Simulate a small loading delay (500ms)
  };

  return (
    <div className="min-h-screen relative flex overflow-hidden">
      {/* Background Pattern with Gradient */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#8B4513] via-[#632e0f] to-[#301607] opacity-95"
          style={{
            background:
              "linear-gradient(135deg, #8B4513 0%, #632e0f 50%, #301607 100%)",
          }}
        />

        {/* Animation Layer - Using GIF */}
        <div className="absolute inset-0 z-10 opacity-75 align-center">
          <Lottie
            animationData={animation}
            loop={true}
            autoplay={true}
            className="absolute inset-0 h-full w-full object-contain shadow-sm"
          />
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 bg-pattern opacity-10" />
      </div>

      {/* Content */}
      <div className="relative z-20 flex w-full">
        {/* Left Side - Visible on tablet and desktop */}
        <div className="flex-1 p-8 lg:p-12 hidden sm:block">
          {/* Login Text */}
          <div className="text-white max-w-xl mt-20">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Login into
              <br />
              your account
            </h1>
            <p className="text-lg opacity-80 mb-8">
              Access your document management portal
            </p>

            {/* Features Grid - Updated with emojis */}
            <div className="grid sm:grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-4 bg-[#8B4513]/35 hover:bg-[#8B4513]/25 rounded-lg p-4 transition-all duration-300 backdrop-blur-sm"
                >
                  <div className="text-white text-2xl shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-white font-semibold text-lg mb-1">
                      {feature.title}
                    </h3>
                    <p className="text-white/70 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-[400px] shadow-xl backdrop-blur-lg">
            <div className="flex justify-center items-center mb-2">
              <img src={DealVisorLogo} alt="B2Y" className="h-28 w-auto" />
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-gray-600 text-sm sm:block hidden">
                  Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 pl-10 bg-[#F1F5F9] rounded-lg text-gray-700"
                    placeholder="admin@example.com"
                  />
                  <HiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                </div>
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <label className="text-gray-600 text-sm sm:block">
                  Password
                </label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3 pl-10 bg-[#F1F5F9] rounded-lg text-gray-700"
                    placeholder="••••••••"
                  />
                  <HiLockClosed className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xl" />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end">
  <button
    type="button"
    onClick={() => navigate("/forgot-password")}
    className="text-[#8B4513] text-sm hover:underline"
  >
    Forgot your Password?
  </button>
</div>


              {/* Error Message */}
              {error && (
                <p className="text-red-500 text-sm text-center">{error}</p>
              )}

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-[#8B4513] hover:bg-[#632e0f] text-white py-3 rounded-lg font-medium transition-colors"
                disabled={isLoading}
              >
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
