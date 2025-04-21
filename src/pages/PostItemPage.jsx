import { useNavigate, useLocation } from 'react-router-dom';
import ItemForm from '../components/ItemForm';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { app } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import BackButton from '../components/BackButton';
import ImageUploader from '../components/ImageUploader';

const db = getFirestore(app);

export default function PostItemPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();
    
    const formType = location.pathname === '/lost/post' ? 'lost' : 'found';
    console.log('Form type determined from path:', formType, 'Path:', location.pathname);

    const handleSubmit = async (formData) => {
        try {
            const itemData = {
                category: formType,
                createdAt: new Date().toISOString(),
                description: formData.description,
                photo_url: formData.photo_url,
                itemType: formData.itemType,
                phoneNumber: formData.phoneNumber,
                status: formData.status || formType,
                title: formData.title,
                urgency: formData.urgency,
                userEmail: user.email,
                userId: user.uid,
                location: formData.location
            };

            console.log('Submitting item with data:', itemData);
            await addDoc(collection(db, 'items'), itemData);
            navigate(`/${formType}`);
        } catch (error) {
            console.error('Error submitting item:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton />

            <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
                {formType === 'lost' ? 'Report a Lost Item' : 'Report a Found Item'}
            </h1>

            <ItemForm 
                onSubmit={handleSubmit}
                formType={formType}
            />
        </div>
    );
}