import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export default function App() {
  return (
    <div className="flex flex-col min-h-screen bg-black">
      <Navbar />

      {/* Page Content */}
      <main className="flex-grow">
        <AppRoutes />
      </main>

      <Footer />
    </div>
  );
}
