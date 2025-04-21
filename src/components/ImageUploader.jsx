import React, { useState } from 'react';

const ImageUploader = ({ onImageUpload }) => {
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // Show preview
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);

        try {
            setLoading(true);
            setError(null);

            // Convert image to base64
            const base64Image = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result.split(',')[1]);
                reader.readAsDataURL(file);
            });

            // Upload to ImgBB
            const formData = new FormData();
            formData.append('image', base64Image);

            const response = await fetch('https://api.imgbb.com/1/upload?key=344a1fb80a945665d0e4c01d81190309', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (data.success) {
                onImageUpload(data.data.url);
            } else {
                throw new Error('Failed to upload image');
            }
        } catch (err) {
            console.error('Error uploading image:', err);
            setError('Failed to upload image. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-center w-full">
                <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        {preview ? (
                            <img src={preview} alt="Preview" className="max-h-48 object-contain" />
                        ) : (
                            <>
                                <svg className="w-8 h-8 mb-4 text-gray-500" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                                </svg>
                                <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-gray-500">PNG, JPG or JPEG (MAX. 800x400px)</p>
                            </>
                        )}
                    </div>
                    <input 
                        type="file" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleImageChange}
                        disabled={loading}
                    />
                </label>
            </div>
            {loading && <p className="text-sm text-gray-500">Uploading image...</p>}
            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
};

export default ImageUploader; 