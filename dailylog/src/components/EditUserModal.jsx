import React, { useState, useEffect } from 'react';
import './EditUserModal.css';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc } from 'firebase/firestore'; // Add Firestore imports
import { db, storage } from '../Config/firestore'; // Assuming you have a firestore configuration file
import { toast } from 'react-toastify'; // Import toast for notifications

const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [editedUser, setEditedUser] = useState(user || {});
  const [imageFile, setImageFile] = useState(null); // State to store the selected image file
  const [imageError, setImageError] = useState(''); // State to manage image upload errors

  useEffect(() => {
    setEditedUser(user || {});
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImageFile(file);
      setImageError('');
    } else {
      setImageFile(null);
      setImageError('Please select a valid image file.');
    }
  };

  const handleSave = async () => {
    try {
      let imageUrl = editedUser.imageUrl; // Preserve the existing imageUrl if it exists
  
      // Check if a new image file is selected
      if (imageFile) {
        // Check if user.id is defined before using it
        const docRef = user.id ? doc(db, 'account', user.id) : null;
  
        if (docRef) {
          const storageRef = ref(storage, `images/${imageFile.name}`);
          
          // Convert the file content to a data URL
          const reader = new FileReader();
          reader.onload = async (e) => {
            const dataURL = e.target.result;
    
            // Upload the data URL to Firebase Storage
            try {
              await uploadString(storageRef, dataURL, 'data_url');
              imageUrl = await getDownloadURL(storageRef);
    
              // Update the Firestore document with the new imageUrl
              await updateDoc(docRef, {
                ...editedUser,
                imageUrl: imageUrl,
              });
    
              // Display a success notification
              toast.success('User updated successfully!');
              onClose(); // Close the modal after successful update
            } catch (error) {
              console.error('Error uploading image:', error);
              toast.error('Error uploading image. Please try again.');
            }
          };
    
          reader.readAsDataURL(imageFile);
        }
      } else {
        // Handle case where no image file is selected
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Error updating user. Please try again.');
    }
  };
  
  

  return (
    <div className={`modal ${isOpen ? 'open' : ''}`}>
      <div className='modal-container'>
        <h2>Edit Student Information</h2>
        <div className='edit-user-form'>
          <label>Profile Image:</label>
          <input type='file' accept='image/*' onChange={handleImageChange} />

          {/* Display preview of selected image */}
          {imageFile && (
            <img src={URL.createObjectURL(imageFile)} alt='Preview' className='preview-image' />
          )}
          <label>Name:</label>
          <input type='text' name='name' value={editedUser.name || ''} onChange={handleInputChange} />
          <label>Student Number:</label>
          <input
            type='text'
            name='studentNumber'
            value={editedUser.studentNumber || ''}
            onChange={handleInputChange}
          />

          <label>Contact Number:</label>
          <input
            type='text'
            name='contactNumber'
            value={editedUser.contactNumber || ''}
            onChange={handleInputChange}
          />

          <label>Grade Level:</label>
          <input
            type='text'
            name='gradeLevel'
            value={editedUser.gradeLevel || ''}
            onChange={handleInputChange}
          />

          <label>Section:</label>
          <input
            type='text'
            name='section'
            value={editedUser.section || ''}
            onChange={handleInputChange}
          />

          <button className='save-btn' onClick={handleSave}>
            Save
          </button>
          <button className='close-btn' onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
