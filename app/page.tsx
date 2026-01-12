export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">
            InterChange
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
            AI-Powered Parts Cross-Reference System
          </p>
          <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
              Welcome to InterChange
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Your intelligent solution for automotive, equipment, and industrial parts cross-referencing.
            </p>
            <div className="grid md:grid-cols-2 gap-4 text-left">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  🔍 Smart Search
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Find alternative parts with AI-powered matching
                </p>
              </div>
              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  📷 Image Recognition
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Identify parts from photos instantly
                </p>
              </div>
              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  ✓ Compatibility Check
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Verify part compatibility automatically
                </p>
              </div>
              <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-gray-100 mb-2">
                  💬 Community Forum
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  Connect with experts and enthusiasts
                </p>
              </div>
            </div>
            <div className="mt-8">
              <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
