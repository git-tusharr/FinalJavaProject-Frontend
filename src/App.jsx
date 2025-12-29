import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#111",
            color: "#fff",
            border: "1px solid #ef4444",
          },
          success: {
            iconTheme: {
              primary: "#22c55e",
              secondary: "#111",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#111",
            },
          },
        }}
      />

      <Navbar />

      {/* Page Content */}
      <main className="flex-grow">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}
