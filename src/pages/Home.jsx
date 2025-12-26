export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Home Page</h1>
      <p className="text-gray-600 mb-6">You are logged in.</p>

      <div className="bg-blue-500 text-white px-6 py-3 rounded-lg shadow-md hover:bg-blue-600 transition">
        Tailwind is working!
      </div>
    </div>
  );
}
