// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { authController } from "../../controllers/authController";
// import toast from "react-hot-toast";

// export default function Register() {
//   const [form, setForm] = useState({
//     email: "",
//     phone: "",
//     username: "",
//     password: "",
//   });

//   const [loading, setLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       const msg = await authController.register(form);
//       toast.success(msg.message || "Registered successfully");

//       navigate("/email-otp", {
//         state: { email: form.email, phone: form.phone },
//       });
//     } catch (err) {
//       console.error(err);
//       toast.error(err.response?.data?.message || "Registration failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     /* global google */
//     google.accounts.id.initialize({
//       client_id:
//         "660129225344-lqdgo1vjjbf3209aspcmps932rinbnn7.apps.googleusercontent.com",
//       callback: handleGoogleRegister,
//     });

//     google.accounts.id.renderButton(
//       document.getElementById("googleRegisterBtn"),
//       { theme: "outline", size: "large" }
//     );
//   }, []);

//   const handleGoogleRegister = async (response) => {
//     try {
//       toast.loading("Signing in with Google...");
//       const token = await authController.googleLogin(response.credential);

//       localStorage.setItem("token", token);
//       toast.dismiss();
//       toast.success("Logged in with Google");

//       navigate("/home");
//     } catch (err) {
//       console.error(err);
//       toast.dismiss();
//       toast.error("Google registration failed");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
//       <div className="bg-gray-900 border border-red-600/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">

//         <h2 className="text-3xl font-extrabold text-center mb-6">
//           <span className="text-red-500">Create</span>{" "}
//           <span className="text-yellow-400">Account</span>
//         </h2>

//         <form onSubmit={handleSubmit} className="flex flex-col gap-4">
//           <input
//             type="email"
//             placeholder="Email"
//             value={form.email}
//             onChange={(e) => setForm({ ...form, email: e.target.value })}
//             required
//             className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
//           />

//           <input
//             type="tel"
//             placeholder="Phone"
//             value={form.phone}
//             onChange={(e) => setForm({ ...form, phone: e.target.value })}
//             required
//             className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
//           />

//           <input
//             type="text"
//             placeholder="Username"
//             value={form.username}
//             onChange={(e) => setForm({ ...form, username: e.target.value })}
//             required
//             className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
//           />

//           <input
//             type="password"
//             placeholder="Password"
//             value={form.password}
//             onChange={(e) => setForm({ ...form, password: e.target.value })}
//             required
//             className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
//           />

//           <button
//             type="submit"
//             disabled={loading}
//             className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition duration-300 shadow-lg
//               ${
//                 loading
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-red-600 hover:bg-red-700"
//               }`}
//           >
//             {loading && (
//               <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
//             )}
//             {loading ? "Registering..." : "Register"}
//           </button>
//         </form>

//         <div className="my-6 flex items-center gap-3">
//           <div className="flex-grow border-t border-gray-700"></div>
//           <span className="text-gray-400 text-sm">OR</span>
//           <div className="flex-grow border-t border-gray-700"></div>
//         </div>

//         <div id="googleRegisterBtn" className="flex justify-center"></div>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { authController } from "../../controllers/authController";
import toast from "react-hot-toast";
import { useAuth } from "../../api/AuthContext";

export default function Register() {
  const [form, setForm] = useState({
    email: "",
    phone: "",
    username: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth(); // ✅ global auth

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const msg = await authController.register(form);
      toast.success(msg.message || "Registered successfully");

      navigate("/email-otp", {
        state: { email: form.email, phone: form.phone },
      });
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = async (response) => {
    try {
      toast.loading("Signing in with Google...");
      const token = await authController.googleLogin(response.credential);

      login(token); // ✅ store globally
      toast.dismiss();
      toast.success("Logged in with Google");

      navigate("/home");
    } catch (err) {
      console.error(err);
      toast.dismiss();
      toast.error("Google registration failed");
    }
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleRegister,
    });

    google.accounts.id.renderButton(
      document.getElementById("googleRegisterBtn"),
      { theme: "outline", size: "large" }
    );
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-black px-4">
      <div className="bg-gray-900 border border-red-600/30 p-8 rounded-2xl shadow-2xl w-full max-w-md">

        <h2 className="text-3xl font-extrabold text-center mb-6">
          <span className="text-red-500">Create</span>{" "}
          <span className="text-yellow-400">Account</span>
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <input
            type="tel"
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <input
            type="text"
            placeholder="Username"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
            className="bg-black text-white border border-gray-700 p-3 rounded-lg focus:ring-2 focus:ring-red-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`flex items-center justify-center gap-2 py-3 rounded-lg font-semibold transition duration-300 shadow-lg
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-red-600 hover:bg-red-700"
              }`}
          >
            {loading && (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            )}
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="flex-grow border-t border-gray-700"></div>
          <span className="text-gray-400 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div id="googleRegisterBtn" className="flex justify-center"></div>
      </div>
    </div>
  );
}
