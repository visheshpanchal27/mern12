import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useCreateProductMutation,
  useUploadProductImageMutation,
} from '../../redux/api/productApiSlice';
import { useFetchCategoriesQuery } from '../../redux/api/categoryApiSlice';
import { toast } from 'react-toastify';
import AdminMenu from './AdminMenu';

const ProductList = () => {
  const [image, setImage] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [quantity, setQuantity] = useState('');
  const [brand, setBrand] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();
  const [uploadProductImage] = useUploadProductImageMutation();
  const [createProduct] = useCreateProductMutation();
  const { data: categories } = useFetchCategoriesQuery();

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    setImage(file);

    const formData = new FormData();
    formData.append('image', file);

    setUploading(true);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message || 'Image uploaded');
      setImageUrl(res.image);
    } catch (error) {
      toast.error(error?.data?.message || 'Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    // Frontend validation
    if (!name || !description || !price || !category || !quantity || !brand || !stock) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setUploading(true);
      let uploadedImageUrl = imageUrl;

      // If image is selected but not uploaded yet
      if (!imageUrl && image) {
        const formData = new FormData();
        formData.append('image', image);
        const res = await uploadProductImage(formData).unwrap();
        uploadedImageUrl = res.image;
      }

      // Construct form data
      const productData = new FormData();
      productData.append('name', name);
      productData.append('description', description);
      productData.append('price', price);
      productData.append('category', category);
      productData.append('quantity', quantity);
      productData.append('brand', brand);
      productData.append('countInStock', stock);
      productData.append('image', uploadedImageUrl);

      // Create product
      const result = await createProduct(productData).unwrap();
      toast.success('Product created successfully!');
      navigate('/');
    } catch (err) {
      console.error('❌ Product Error:', err);
      toast.error(err?.data?.message || err?.message || 'Failed to create product');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="container xl:mx-[9rem] sm:mx-[0] text-white">
      <AdminMenu/>
      <form onSubmit={submitHandler} className="flex flex-con md:flex-row"> 
        <div className="md:w-3/4 p-3">
          <div className="h-12 text-xl font-semibold mb-4">Create Product</div>

          {/* Image preview and upload */}
          <div className="mb-6">
            {imageUrl && (
              <div className="text-center mb-4">
                <img
                  src={`http://localhost:5000${imageUrl}`}
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
                name="accept"
                accept="image/*"
                onChange={uploadFileHandler}
                className="hidden"
                disabled={uploading}
              />
            </label>
          </div>

          {/* Name and Price */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-[48%]">
              <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                id="name"
                className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <label htmlFor="price" className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                id="price"
                className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
          </div>

          {/* Quantity and Brand */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-[48%]">
              <label htmlFor="quantity" className="block text-sm font-medium mb-2">Quantity</label>
              <input
                type="number"
                id="quantity"
                className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div className="w-full md:w-[48%]">
              <label htmlFor="brand" className="block text-sm font-medium mb-2">Brand</label>
              <input
                type="text"
                id="brand"
                className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
          </div>

          {/* Category and Stock */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="w-full md:w-[48%]">
              <label htmlFor="category" className="block text-sm font-medium mb-2">Category</label>
              <select
                id="category"
                className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="">Select Category</option>
                {categories?.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-[48%]">
              <label htmlFor="stock" className="block text-sm font-medium mb-2">Stock</label>
              <input
                type="number"
                id="stock"
                className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011]"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
              />
            </div>
          </div>

          {/* Description */}
          <div className="mb-6">
            <label htmlFor="description" className="block text-sm font-medium mb-2">Description</label>
            <textarea
              id="description"
              rows="4"
              className="p-4 w-full border border-gray-700 rounded-lg bg-[#101011] resize-none"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <div className="mb-6">
            <button
              type="submit"
              disabled={uploading}
              className={`w-full bg-pink-500 text-white py-3 rounded-lg font-semibold transition ${
                uploading ? 'cursor-not-allowed opacity-50' : 'hover:bg-pink-700'
              }`}
            >
              {uploading ? 'Uploading...' : 'Submit Product'}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProductList;
