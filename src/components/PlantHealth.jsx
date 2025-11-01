import { useState } from "react";

export default function PlantChecker() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError("");
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError("Please select a photo first");
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError("Please upload a valid image file");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("http://localhost:5000/api/plant/health", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      
      if (data.success) {
        setResult(data.description);
      } else {
        setError(data.error || "Error analyzing photo");
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Failed to connect to server. Make sure backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-green-700 mb-2">
              🌱 Plant Health Analyzer
            </h1>
            <p className="text-gray-600">
              Upload a photo of your plant to get an instant health assessment
            </p>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Plant Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100 cursor-pointer"
              />
              <p className="mt-1 text-xs text-gray-500">
                Supported: JPG, PNG, WEBP (max 10MB)
              </p>
            </div>

            {preview && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                <img
                  src={preview}
                  alt="Plant preview"
                  className="w-full max-h-96 object-contain rounded-lg border-2 border-gray-200"
                />
              </div>
            )}

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                disabled={loading || !file}
                className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Analyzing...
                  </span>
                ) : (
                  "Analyze Plant"
                )}
              </button>
              
              {(file || result || error) && (
                <button
                  onClick={handleReset}
                  className="px-6 py-3 border-2 border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
              <div className="flex items-start">
                <span className="text-red-600 text-xl mr-2">⚠️</span>
                <div>
                  <h3 className="text-red-800 font-semibold">Error</h3>
                  <p className="text-red-700 text-sm mt-1">{error}</p>
                </div>
              </div>
            </div>
          )}

          {result && (
            <div className="mt-6 p-6 bg-green-50 border-l-4 border-green-500 rounded-lg">
              <h3 className="text-green-800 font-bold text-lg mb-3 flex items-center">
                <span className="text-2xl mr-2">📋</span>
                Health Assessment
              </h3>
              <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                {result}
              </div>
            </div>
          )}
        </div>

        <div className="mt-6 text-center text-sm text-gray-600">
          <p>💡 Tip: For best results, take clear photos in good lighting</p>
        </div>
      </div>
    </div>
  );
}