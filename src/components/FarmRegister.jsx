import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Leaf, MapPin, Sprout, Tractor, 
  Image as ImageIcon, Locate, Loader2, X 
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function FarmRegister() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: "",
    soilType: "loamy",
    area: "",
    address: "",
    lat: "",
    lng: "",
    crops: [{ name: "", variety: "", plantingDate: "" }],
  });
  
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [locationLoading, setLocationLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!user || !token) {
      navigate('/login');
    }
  }, [user, token, navigate]);

  const handleChange = (e, index) => {
    const { name, value } = e.target;
    
    if (name.startsWith("crop_")) {
      const field = name.split("_")[1];
      const updatedCrops = [...formData.crops];
      updatedCrops[index][field] = value;
      setFormData({ ...formData, crops: updatedCrops });
    } else {
      setFormData({ ...formData, [name]: value });
    }
    
    // Clear errors when user starts typing
    setError("");
  };

  const handleAddCrop = () => {
    setFormData({
      ...formData,
      crops: [...formData.crops, { name: "", variety: "", plantingDate: "" }],
    });
  };

  const handleRemoveCrop = (index) => {
    if (formData.crops.length > 1) {
      const updatedCrops = formData.crops.filter((_, i) => i !== index);
      setFormData({ ...formData, crops: updatedCrops });
    }
  };

  // 🌍 Get user's current location
  const handleGetLocation = () => {
    setLocationLoading(true);
    setError("");
    
    if (!navigator.geolocation) {
      setError("❌ Geolocation is not supported in this browser.");
      setLocationLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setFormData({
          ...formData,
          lat: position.coords.latitude.toFixed(6),
          lng: position.coords.longitude.toFixed(6),
        });
        setLocationLoading(false);
        setSuccess("✅ Location detected successfully!");
        setTimeout(() => setSuccess(""), 3000);
      },
      (error) => {
        setLocationLoading(false);
        setError("⚠️ Location access denied. Please enable GPS and try again.");
      }
    );
  };

  // 📸 Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size (5MB max)
      if (file.size > 5 * 1024 * 1024) {
        setError("❌ Image size should be less than 5MB");
        return;
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError("❌ Please upload an image file");
        return;
      }
      
      setImage(file);
      setPreview(URL.createObjectURL(file));
      setError("");
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview("");
  };

  // Validate form
  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Farm name is required");
      return false;
    }
    
    if (!formData.area || formData.area < 0.1) {
      setError("Area must be at least 0.1 acres");
      return false;
    }
    
    if (!formData.lat || !formData.lng) {
      setError("Location coordinates are required. Please use 'Get My Location' or enter manually.");
      return false;
    }
    
    // Validate crops
    const validCrops = formData.crops.filter(crop => crop.name.trim());
    if (validCrops.length === 0) {
      setError("At least one crop is required");
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    
    // Validate form
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);

    try {
      // Create form data to send file and JSON
      const data = new FormData();
      data.append("name", formData.name.trim());
      data.append("soilType", formData.soilType);
      data.append("area", formData.area);
      data.append("address", formData.address.trim());
      data.append("lat", formData.lat);
      data.append("lng", formData.lng);
      
      // Only include crops that have a name
      const validCrops = formData.crops.filter(crop => crop.name.trim());
      data.append("crops", JSON.stringify(validCrops));
      
      if (image) {
        data.append("image", image);
      }

      const API_URL = import.meta.env.VITE_APP_API_URL || 'http://localhost:5000/api';
      
      const res = await fetch(`${API_URL}/farms`, {
        method: "POST",
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: data,
      });

      const result = await res.json();

      if (res.ok && result.success) {
        setSuccess("✅ Farm Registered Successfully!");
        
        // Redirect to dashboard after 2 seconds
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        setError(result.message || "❌ Error registering farm. Please try again.");
      }
    } catch (err) {
      console.error('Farm registration error:', err);
      setError("❌ Network error. Please check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-lime-100 via-green-50 to-emerald-100 p-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-2xl"
      >
        <Card className="shadow-2xl rounded-2xl bg-white/90 backdrop-blur-lg border border-green-200">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-extrabold text-emerald-700 flex items-center justify-center gap-2">
              <Tractor size={30} /> Register Your Farm
            </CardTitle>
            <p className="text-gray-500 mt-1">Grow smarter with FarmAssist 🌱</p>
          </CardHeader>

          <CardContent>
            {/* Success/Error Messages */}
            {error && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            {success && (
              <Alert className="mb-4 bg-green-50 border-green-200">
                <AlertDescription className="text-green-700">{success}</AlertDescription>
              </Alert>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Farm Details */}
              <section>
                <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-700 mb-3">
                  <Leaf size={20} /> Farm Details
                </h3>
                
                <Input
                  name="name"
                  placeholder="Farm Name *"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-3 w-full"
                  disabled={loading}
                />
                
                <select
                  name="soilType"
                  value={formData.soilType}
                  onChange={handleChange}
                  className="mt-3 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={loading}
                >
                  <option value="clay">Clay</option>
                  <option value="sandy">Sandy</option>
                  <option value="loamy">Loamy (Recommended)</option>
                  <option value="silty">Silty</option>
                  <option value="peaty">Peaty</option>
                  <option value="chalky">Chalky</option>
                </select>
                
                <Input
                  name="area"
                  placeholder="Area (in acres) *"
                  type="number"
                  min="0.1"
                  step="0.1"
                  required
                  value={formData.area}
                  onChange={handleChange}
                  className="mt-3"
                  disabled={loading}
                />
              </section>

              {/* Location Section */}
              <section>
                <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-700 mb-3">
                  <MapPin size={20} /> Location
                </h3>
                
                <Textarea
                  name="address"
                  placeholder="Farm Address (Village, District, State)"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  className="mt-3 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  disabled={loading}
                />
                
                <div className="grid grid-cols-2 gap-4 mt-3">
                  <Input
                    name="lat"
                    placeholder="Latitude *"
                    type="number"
                    step="0.000001"
                    required
                    value={formData.lat}
                    onChange={handleChange}
                    disabled={loading}
                  />
                  <Input
                    name="lng"
                    placeholder="Longitude *"
                    type="number"
                    step="0.000001"
                    required
                    value={formData.lng}
                    onChange={handleChange}
                    disabled={loading}
                  />
                </div>
                
                <Button
                  type="button"
                  onClick={handleGetLocation}
                  disabled={locationLoading || loading}
                  className="w-full mt-3 bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center gap-2"
                >
                  {locationLoading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      Detecting Location...
                    </>
                  ) : (
                    <>
                      <Locate size={18} /> Get My Location
                    </>
                  )}
                </Button>
              </section>

              {/* Image Upload */}
              <section>
                <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-700 mb-3">
                  <ImageIcon size={20} /> Farm Image (Optional)
                </h3>
                
                {!preview ? (
                  <div className="border-2 border-dashed border-emerald-300 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="farm-image-upload"
                      disabled={loading}
                    />
                    <label
                      htmlFor="farm-image-upload"
                      className="cursor-pointer flex flex-col items-center gap-2"
                    >
                      <ImageIcon size={40} className="text-emerald-500" />
                      <span className="text-sm text-gray-600">
                        Click to upload farm image (Max 5MB)
                      </span>
                    </label>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={preview}
                      alt="Farm Preview"
                      className="mt-3 rounded-xl shadow-md max-h-64 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute top-5 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      disabled={loading}
                    >
                      <X size={16} />
                    </button>
                  </div>
                )}
              </section>

              {/* Crops */}
              <section>
                <h3 className="text-xl font-semibold flex items-center gap-2 text-emerald-700 mb-3">
                  <Sprout size={20} /> Crops *
                </h3>
                
                {formData.crops.map((crop, index) => (
                  <div
                    key={index}
                    className="grid grid-cols-[1fr_1fr_1fr_auto] gap-3 border p-3 rounded-lg bg-emerald-50/60 mb-3"
                  >
                    <Input
                      name="crop_name"
                      placeholder="Crop Name *"
                      value={crop.name}
                      onChange={(e) => handleChange(e, index)}
                      disabled={loading}
                    />
                    <Input
                      name="crop_variety"
                      placeholder="Variety"
                      value={crop.variety}
                      onChange={(e) => handleChange(e, index)}
                      disabled={loading}
                    />
                    <Input
                      name="crop_plantingDate"
                      type="date"
                      value={crop.plantingDate}
                      onChange={(e) => handleChange(e, index)}
                      disabled={loading}
                    />
                    {formData.crops.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCrop(index)}
                        className="text-red-500 hover:text-red-700"
                        disabled={loading}
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>
                ))}
                
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddCrop}
                  className="w-full border-dashed border-2 text-emerald-600 hover:bg-emerald-50"
                  disabled={loading}
                >
                  + Add Another Crop
                </Button>
              </section>

              {/* Submit */}
              <motion.div whileHover={{ scale: loading ? 1 : 1.02 }} whileTap={{ scale: loading ? 1 : 0.98 }}>
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-lg py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 size={20} className="animate-spin mr-2" />
                      Registering Farm...
                    </>
                  ) : (
                    <>
                      🌿 Register Farm
                    </>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}