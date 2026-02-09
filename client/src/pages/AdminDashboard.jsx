import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { designsAPI } from '../utils/api';
import { logout, getUser } from '../utils/auth';

const AdminDashboard = () => {
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    price: '',
    featured: false,
  });
  const [files, setFiles] = useState({
    model: null,
    thumbnail: null,
  });
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getUser();
    if (!user) {
      navigate('/admin/login');
      return;
    }
    fetchDesigns();
  }, [navigate]);

  const fetchDesigns = async () => {
    try {
      setLoading(true);
      const data = await designsAPI.getAll();
      setDesigns(data);
    } catch (err) {
      console.error('Error fetching designs:', err);
      if (err.response?.status === 401) {
        logout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleFileChange = (e) => {
    setFiles({
      ...files,
      [e.target.name]: e.target.files[0],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!files.model || !files.thumbnail) {
      alert('Please select both model and thumbnail files');
      return;
    }

    setUploading(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('description', formData.description);
      formDataToSend.append('category', formData.category);
      formDataToSend.append('price', formData.price);
      formDataToSend.append('featured', formData.featured);
      formDataToSend.append('model', files.model);
      formDataToSend.append('thumbnail', files.thumbnail);

      await designsAPI.create(formDataToSend);
      alert('Design uploaded successfully!');
      setShowForm(false);
      setFormData({
        title: '',
        description: '',
        category: 'other',
        price: '',
        featured: false,
      });
      setFiles({ model: null, thumbnail: null });
      fetchDesigns();
    } catch (err) {
      console.error('Error uploading design:', err);
      alert(err.response?.data?.message || 'Failed to upload design');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this design?')) {
      return;
    }

    try {
      await designsAPI.delete(id);
      alert('Design deleted successfully!');
      fetchDesigns();
    } catch (err) {
      console.error('Error deleting design:', err);
      alert('Failed to delete design');
    }
  };

  const handleLogout = () => {
    logout();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                {showForm ? 'Cancel' : '+ Add New Design'}
              </button>
              <button
                onClick={handleLogout}
                className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Upload Form */}
        {showForm && (
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Upload New Design</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  >
                    <option value="living-room">Living Room</option>
                    <option value="bedroom">Bedroom</option>
                    <option value="kitchen">Kitchen</option>
                    <option value="bathroom">Bathroom</option>
                    <option value="office">Office</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div className="flex items-center pt-8">
                  <input
                    type="checkbox"
                    name="featured"
                    checked={formData.featured}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label className="ml-2 text-sm font-medium text-gray-700">
                    Featured Design
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    3D Model File (.glb) *
                  </label>
                  <input
                    type="file"
                    name="model"
                    accept=".glb,.gltf"
                    required
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Thumbnail Image *
                  </label>
                  <input
                    type="file"
                    name="thumbnail"
                    accept="image/*"
                    required
                    onChange={handleFileChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                className="w-full bg-primary-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {uploading ? 'Uploading...' : 'Upload Design'}
              </button>
            </form>
          </div>
        )}

        {/* Designs List */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">All Designs ({designs.length})</h2>
          
          {designs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No designs uploaded yet.</p>
              <button
                onClick={() => setShowForm(true)}
                className="text-primary-600 hover:text-primary-700 font-medium"
              >
                Upload your first design
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {designs.map((design) => (
                <div key={design._id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="h-48 bg-gray-200 overflow-hidden">
                    {design.thumbnailUrl ? (
                      <img
                        src={`http://localhost:5000${design.thumbnailUrl}`}
                        alt={design.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-200">
                        <span className="text-primary-600 font-semibold">No Thumbnail</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{design.title}</h3>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{design.description || 'No description'}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 capitalize">{design.category?.replace('-', ' ')}</span>
                      {design.featured && (
                        <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Featured</span>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(design._id)}
                      className="mt-4 w-full bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


