import React, { useState } from 'react';
import { RxCross1 } from 'react-icons/rx';
import { categoriesData } from "../../static/data";
import { AiOutlineDelete, AiOutlinePlusCircle } from 'react-icons/ai';
import { toast } from 'react-toastify';
import { server } from '../../server';
import axios from 'axios';
import Loader from "../Layout/Loader";

const EditProducts = ({ setOpenEdit, data, filteredData, setFilteredData, setUpdated, updated }) => {
  // Define local states for each input field
  const [name, setName] = useState(data.name || "");
  const [description, setDescription] = useState(data.description || "");
  const [category, setCategory] = useState(data.category || "");
  const [tags, setTags] = useState(data.tags || "");
  const [originalPrice, setOriginalPrice] = useState(data.originalPrice || 0);
  const [discountPrice, setDiscountPrice] = useState(data.discountPrice || 0);
  const [stock, setStock] = useState(data.stock || 0);
  const [images, setImages] = useState(data.images || []);
  const [loading, setLoading] = useState(false);
  const MAX_IMAGES = 6;
  // Handle form submission
  
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        if (images.length === 0) {
        setLoading(false);

      toast.error("You must upload at least one image.");

      return; // Prevent submission if no images are uploaded
    }
      if (images.length>6) {
        setLoading(false);

     toast.error(`You can only upload a maximum of ${MAX_IMAGES} images.`);
      return; // Prevent submission if no images are uploaded
    }
        const updatedProduct = {
            name,
            description,
            category,
            tags,
            originalPrice,
            discountPrice,
            stock,
            images
        };

        try {
            const response = await axios.put(`${server}/product/update-shop-product/${data._id}`, updatedProduct,
                { withCredentials: true }
            );
            
             if (response.data.success) {
        toast.success("Product updated successfully");

        // Find and replace the product in filterData
        const updatedFilterData = filteredData.map((product) =>
          product._id === data._id ? { ...product, ...updatedProduct } : product
        );

        // Update filterData state
        setFilteredData(updatedFilterData);
        setUpdated(!updated);
    }
        } catch (error) {
            toast.error('Error updating product: ', error);
        }
        setLoading(false);
        setOpenEdit(false);
    };

   
  

  // Handle image upload
  const handleImageChange = (e) => {
  const files = Array.from(e.target.files);

  files.forEach((file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setImages((prevImages) => [...prevImages, reader.result]); // Store base64 string
    };
    reader.readAsDataURL(file); // Convert to base64
  });
};
const handleImageDelete = (index) => {
  setImages((prevImages) => {
    // Check if there is more than one image left
    if (prevImages.length <= 1) {
      alert("You must keep at least one image."); // or use a toast notification
      return prevImages; // Return the previous state without any change
    }
    // If more than one image, filter out the selected one
    return prevImages.filter((_, i) => i !== index);
  });
};

  return (
    <div className="fixed top-0 left-0 w-full h-screen bg-[#00000062] z-[200] flex items-center justify-center">
        {loading ? (<Loader/>) : (
            <div className="overflow-y-scroll w-[90%] 800px:w-[40%] h-[90vh] bg-white rounded-md shadow p-4">
        <div className="w-full flex justify-end">
          <RxCross1
            size={30}
            className="cursor-pointer"
            onClick={() => setOpenEdit(false)}
          />
        </div>
        <h5 className="text-[30px] font-Poppins text-center">Edit Product</h5>
        
        {/* Edit Product Form */}
        <form onSubmit={handleSubmit}>
          <br />
          <div>
            <label className="pb-2">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your product name..."
            />
          </div>
          <br />
          <div>
            <label className="pb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              cols="30"
              required
              rows="8"
              type="text"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 appearance-none block w-full pt-2 px-3 border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your product description..."
            ></textarea>
          </div>
          <br />
          <div>
            <label className="pb-2">
              Category <span className="text-red-500">*</span>
            </label>
            <select
              className="w-full mt-2 border h-[35px] rounded-[5px]"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Choose a category">Choose a category</option>
              {categoriesData &&
                categoriesData.map((i) => (
                  <option value={i.title} key={i.title}>
                    {i.title}
                  </option>
                ))}
            </select>
          </div>
          <br />
          <div>
            <label className="pb-2">Tags</label>
            <input
              type="text"
              name="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your product tags..."
            />
          </div>
          <br />
          <div>
            <label className="pb-2">Original Price</label>
            <input
              type="number"
              name="originalPrice"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your product price..."
            />
          </div>
          <br />
          <div>
            <label className="pb-2">
              Price (With Discount) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="discountPrice"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your product price with discount..."
            />
          </div>
          <br />
          <div>
            <label className="pb-2">
              Product Stock <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              name="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="mt-2 appearance-none block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Enter your product stock..."
            />
          </div>
          <br />
          <div>
            <label className="pb-2">
              Upload Images <span className="text-red-500">*</span>
            </label>
            <input
              type="file"
              name="images"
              id="upload"
              className="hidden"
              multiple
              onChange={handleImageChange}
            />
            <div className="w-full flex items-center flex-wrap">
              <label htmlFor="upload">
                <AiOutlinePlusCircle size={30} className="mt-3" color="#555" />
              </label>
              {images &&
                images.map((img, index) => (
                 <div key={index} className="relative m-2">
                  <img
                    src={img.url || img}
                    alt=""
                    className="h-[120px] w-[120px] object-cover"
                  />
                  <AiOutlineDelete
                    size={20}
                    className="absolute top-0 right-0 cursor-pointer bg-white rounded-full"
                    onClick={() => handleImageDelete(index)}
                    title="Delete Image"
                  />
                </div>
                ))}
            </div>
            <br />
            <div>
              <input
                type="submit"
                value="Update"
                className="mt-2 cursor-pointer appearance-none text-center block w-full px-3 h-[35px] border border-gray-300 rounded-[3px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>
        </form>
      </div>
        )}
      
    </div>
  );
};

export default EditProducts;

