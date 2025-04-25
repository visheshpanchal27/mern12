import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice';
import { toast } from 'react-toastify';
import AdminMenu from './AdminMenu';

const initialFormState = {
  name: '',
  description: '',
  price: '',
  category: '',
  quantity: '',
  brand: '',
  stock: '',
};

const ProductList = () => {
  const [formData, setFormData] = useState(initialFormState);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [creatingProduct, setCreatingProduct] = useState(false);

  const navigate = useNavigate();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await uploadProductImage(formData).unwrap();
      setImageUrl(res.image);
      toast.success(res.message || 'Image uploaded');
    } catch (error) {
      toast.error(error?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const { name, description, price, category, quantity, brand, stock } = formData;

    if (!name || !description || !price || !category || !quantity || !brand || !stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setCreatingProduct(true);
      let uploadedImageUrl = imageUrl;

      // If no uploaded URL and user selected a file
      if (!uploadedImageUrl && image) {
        const uploadForm = new FormData();
        uploadForm.append('image', image);
        setUploading(true);
        const res = await uploadProductImage(uploadForm).unwrap();
        uploadedImageUrl = res.image;
        setUploading(false);
      }

      // Create FormData to send product details
      const newFormData = new FormData();
      newFormData.append('name', name);
      newFormData.append('description', description);
      newFormData.append('price', price);
      newFormData.append('category', category);
      newFormData.append('quantity', quantity);
      newFormData.append('brand', brand);
      newFormData.append('countInStock', stock);
      newFormData.append('image', uploadedImageUrl);

      await createProduct(newFormData).unwrap();
      toast.success('Product created successfully!');
      setFormData(initialFormState);
      setImage(null);
      setImageUrl('');
      navigate('/');

    } catch (err) {
      console.error('❌ Product Error:', err);
      toast.error(err?.data?.message || err?.message || 'Failed to create product');
    } finally {
      setCreatingProduct(false);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0] text-white">
      <AdminMenu />
      <form onSubmit={submitHandler} className="flex flex-col md:flex-row">
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-xl font-semibold mb-6">Create Product</div>

          {/* Image Preview and Upload */}
          <div className="mb-8">
            {imageUrl && (
              <div className="text-center mb-4">
                <img
                  src={
                    imageUrl.startsWith('http')
                      ? imageUrl
                      : `${import.meta.env.VITE_API_URL}${imageUrl}`
                  }                  
                  alt="product"
                  className="block mx-auto max-h-[200px] rounded-md shadow-md"
                />
              </div>
            )}
            <label
              className={`border px-4 block w-full text-center rounded-lg cursor-pointer font-bold py-11 border-gray-700 hover:border-pink-500 transition ${
                uploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {uploading ? 'Uploading Image...' : image ? image.name : 'Upload Image'}
              <input
                type="file"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {[
              { label: 'Name', id: 'name', type: 'text' },
              { label: 'Price', id: 'price', type: 'number' },
              { label: 'Quantity', id: 'quantity', type: 'number' },
              { label: 'Brand', id: 'brand', type: 'text' },
              { label: 'Stock', id: 'stock', type: 'number' },
            ].map((field) => (
              <div key={field.id}>
                <label htmlFor={field.id} className="block text-sm font-medium mb-2">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  id={field.id}
                  value={formData[field.id]}
                  onChange={handleChange}
                  className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
                />
              </div>
            ))}
            <div>
              <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
              <select
                id="category"
                value={formData.category}
                onChange={handleChange}
                className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Description */}
          <div className="mb-8">
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
            <textarea
              id="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011] resize-none"
            />
          </div>

          {/* Submit Button */}
          <div className="mb-6">
            <button
              type="submit"
              disabled={uploading || creatingProduct}
              className={`w-full bg-pink-500 text-white py-3 rounded-lg font-semibold transition ${
                uploading || creatingProduct ? 'cursor-not-allowed opacity-50' : 'hover:bg-pink-700'
              }`}
            >
              {uploading
                ? 'Uploading Image...'
                : creatingProduct
                ? 'Creating Product...'
                : 'Submit Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductList;
