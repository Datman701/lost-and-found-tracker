// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection, updateDoc, doc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDirmrwRwN19ts467wyu6GJ4n4hdzaWmsM",
  authDomain: "lost-and-found-tracker-4b600.firebaseapp.com",
  projectId: "lost-and-found-tracker-4b600",
  storageBucket: "lost-and-found-tracker-4b600.appspot.com",
  messagingSenderId: "651227680619",
  appId: "1:651227680619:web:5ffe4abd8d429853a7062e",
  measurementId: "G-PBKH0WBLGC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export const createFoundReport = async (reportData) => {
    try {
        if (!auth.currentUser) {
            throw new Error('User must be authenticated to create a report');
        }

        // Create the found report with all required fields
        const foundReportsRef = collection(db, 'found_reports');
        const report = {
            lostItemId: reportData.lostItemId,
            finderUserId: reportData.finderUserId,
            finderEmail: reportData.finderEmail,
            ownerUserId: reportData.ownerUserId,
            finderName: reportData.finderName,
            contact: reportData.contact,
            message: reportData.message,
            status: 'pending',
            timestamp: new Date().toISOString(),
            photo_url: reportData.photo_url || '',
            resolvedAt: null
        };

        const foundRef = await addDoc(foundReportsRef, report);

        // Update the lost item with found report reference
        const itemRef = doc(db, 'items', reportData.lostItemId);
        const itemDoc = await getDoc(itemRef);
        
        if (itemDoc.exists()) {
            const currentReports = itemDoc.data().foundReports || [];
            await updateDoc(itemRef, {
                foundReports: [...currentReports, foundRef.id]
            });
        }

        return { success: true, id: foundRef.id };
    } catch (error) {
        console.error('Error creating found report:', error);
        return { success: false, error };
    }
};

export const handleFoundReport = async (reportId, action) => {
    try {
        if (!auth.currentUser) {
            throw new Error('User must be authenticated to handle reports');
        }

        const reportRef = doc(db, 'found_reports', reportId);
        const reportDoc = await getDoc(reportRef);

        if (!reportDoc.exists()) {
            throw new Error('Report not found');
        }

        const reportData = reportDoc.data();
        if (reportData.ownerUserId !== auth.currentUser.uid) {
            throw new Error('Only the item owner can handle this report');
        }

        if (action === 'accept') {
            // Update found report status
            await updateDoc(reportRef, {
                status: 'accepted',
                resolvedAt: new Date().toISOString()
            });

            // Update the item status to found
            const itemRef = doc(db, 'items', reportData.lostItemId);
            await updateDoc(itemRef, {
                status: 'found',
                foundBy: reportData.finderUserId,
                foundAt: new Date().toISOString()
            });
        } else {
            // Reject the report
            await updateDoc(reportRef, {
                status: 'rejected',
                resolvedAt: new Date().toISOString()
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error handling found report:', error);
        return { success: false, error };
    }
};

export const handleClaimRequest = async (claimId, action) => {
    try {
        if (!auth.currentUser) {
            throw new Error('User must be authenticated to handle claims');
        }

        // Get the claim request 
        const claimRef = doc(db, 'found_reports', claimId);
        const claimDoc = await getDoc(claimRef);

        if (!claimDoc.exists()) {
            throw new Error('Claim request not found');
        }

        const claimData = claimDoc.data();

        // Check if the current user is the item owner
        if (claimData.ownerUserId !== auth.currentUser.uid) {
            throw new Error('Only the item owner can handle this claim');
        }

        // Update claim status based on action
        await updateDoc(claimRef, {
            status: action === 'accept' ? 'accepted' : 'rejected',
            resolvedAt: new Date().toISOString()
        });

        // If accepted, update the item status
        if (action === 'accept') {
            const itemRef = doc(db, 'items', claimData.lostItemId);
            await updateDoc(itemRef, {
                status: 'found',
                foundBy: claimData.finderUserId,
                foundAt: new Date().toISOString()
            });
        }

        return { success: true };
    } catch (error) {
        console.error('Error handling claim request:', error);
        return { success: false, error };
    }
};

export { app, auth, db, storage };