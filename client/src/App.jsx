function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-green-600 mb-4">
        🚀 FreelanceHub
      </h1>

      <p className="text-gray-600 text-lg mb-8">
        A Professional Freelance Marketplace Platform
      </p>

      <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ✅ Project Status
        </h2>

        <div className="space-y-3">
          <StatusItem label="Frontend (React)" status="Running" />
          <StatusItem label="Tailwind CSS" status="Configured" />
          <StatusItem label="Backend (Express)" status="Running" />
          <StatusItem label="MongoDB" status="Connected" />
        </div>

        <p className="mt-6 pt-4 border-t text-sm text-gray-500 text-center">
          Week 1 - Day 1 Complete! 🎉
        </p>
      </div>
    </div>
  );
}

function StatusItem({ label, status }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-gray-700">{label}</span>

      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
        {status}
      </span>
    </div>
  );
}

export default App;
