import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { convertToBase64, uploadToImgBB } from '../utils/imageUtils';
import { createFoundReport } from '../utils/firebase';

export default function ReportFoundItemForm({ lostItem, onClose }) {
    const { user } = useAuth();
    const navigate = useNavigate();
    // Update initial state to match new schema
    const [formData, setFormData] = useState({
        lostItemId: lostItem?.id || '',
        finderUserId: user?.uid || '',
        finderEmail: user?.email || '',
        ownerUserId: lostItem?.userId || '',
        finderName: '',
        contact: '',
        message: '',
        status: 'pending',
        photo_url: '',
        timestamp: new Date().toISOString(),
        resolvedAt: null
    });
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!user) {
            navigate('/login', { replace: true });
        }
    }, [user, navigate]);

    if (!user) {
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const clearImage = () => {
        setImageFile(null);
        setImagePreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        try {
            if (!user) {
                throw new Error('You must be logged in to submit a report');
            }

            if (!lostItem?.userId) {
                throw new Error('Cannot identify the owner of this item');
            }

            let photoUrl = '';
            if (imageFile) {
                const base64Image = await convertToBase64(imageFile);
                photoUrl = await uploadToImgBB(base64Image);
            }

            const result = await createFoundReport({
                ...formData,
                photo_url: photoUrl,
                timestamp: new Date().toISOString()
            });

            if (result.success) {
                alert('Your found report has been submitted successfully.');
                onClose();
            } else {
                throw new Error(result.error?.message || 'Failed to create report');
            }
        } catch (error) {
            console.error('Error submitting report:', error);
            setError(error.message || 'An error occurred while submitting the report');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-gray-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                            Report Found Item
                        </h2>
                        <button
                            onClick={onClose}
                            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800/30">
                            <p className="text-red-800 dark:text-red-200">{error}</p>
                        </div>
                    )}

                    {lostItem && (
                        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <h3 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                                Reporting match for:
                            </h3>
                            <p className="text-blue-700 dark:text-blue-300">
                                {lostItem.title}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Your Name
                            </label>
                            <input
                                type="text"
                                name="finderName"
                                value={formData.finderName}
                                onChange={handleChange}
                                required
                                className="input-field text-black"
                                placeholder="Enter your name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Contact Information
                            </label>
                            <input
                                type="text"
                                name="contact"
                                value={formData.contact}
                                onChange={handleChange}
                                required
                                className="input-field text-black"
                                placeholder="Phone number or email"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Message to Owner
                            </label>
                            <textarea
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows="4"
                                className="input-field"
                                placeholder="Describe where and how you found the item..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Photo Evidence (Optional)
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="report-image-upload"
                            />
                            <label
                                htmlFor="report-image-upload"
                                className="inline-block px-4 py-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700"
                            >
                                Upload Image
                            </label>

                            {imagePreview && (
                                <div className="mt-2 relative inline-block">
                                    <img
                                        src={imagePreview}
                                        alt="Preview"
                                        className="max-w-full h-auto max-h-[200px] rounded-md"
                                    />
                                    <button
                                        type="button"
                                        onClick={clearImage}
                                        className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-gray-100"
                                    >
                                        <span className="text-gray-600">×</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end gap-4 mt-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="btn-secondary"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary"
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Submitting...' : 'Submit Report'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}