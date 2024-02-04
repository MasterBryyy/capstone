import React, { useState } from 'react';
import './Adduser.css';
import { db, storage } from '../Config/firestore';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { ToastContainer, toast } from 'react-toastify';
import { ref, uploadString, getDownloadURL } from 'firebase/storage';  
import 'react-toastify/dist/ReactToastify.css';

function Adduser({ onClose, onAddUser }) {
  const [formData, setFormData] = useState({
    name: '',
    studentNumber: '',
    gradeLevel: '',
    section: '',
    contactNumber: '',
  });

  const [nameError, setNameError] = useState('');
  const [studentNumberError, setStudentNumberError] = useState('');
  const [gradeLevelError, setGradeLevelError] = useState('');
  const [sectionError, setSectionError] = useState('');
  const [contactNumberError, setContactNumberError] = useState('');
  const [image, setImage] = useState(null);  // State to hold the selected image file
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const fileType = file.type.split('/')[0]; // Get the file type (e.g., 'image', 'application', etc.)
      if (fileType !== 'image') {
        // If the file type is not an image, show an error message
        toast.error('Only image files are supported.');
        // Clear the input field to prevent submitting non-image files
        e.target.value = null;
        // Reset the image state to null
        setImage(null);
        return;
      }
      // If the file is an image, set it in the state
      setImage(file);
    }
  };
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Check if the uploaded file is an image
    if (name === 'image') {
      const file = e.target.files[0];
      if (file) {
        const fileType = file.type.split('/')[0]; // Get the file type (e.g., 'image', 'application', etc.)
        if (fileType !== 'image') {
          // If the file type is not an image, show an error message
          toast.error('Only image files are supported.');
          // Clear the input field to prevent submitting non-image files
          e.target.value = null;
          // Reset the image state to null
          setImage(null);
          return;
        }
        // If the file is an image, set it in the state
        setImage(file);
      }
    }

    // Validation for the "Contact Number" field (allows only numeric input)
    if (name === 'contactNumber' && isNaN(value)) {
      setContactNumberError('Contact Number must be numeric');
      return;
    } else {
      setContactNumberError('');
    }

    // Validation for the "Grade Level" field (allows only numeric input)
    if (name === 'gradeLevel' && isNaN(value)) {
      setGradeLevelError('Grade Level must be numeric');
      return;
    } else {
      setGradeLevelError('');
    }

    // Validation for the "Student Number" field (allows only numeric input)
    if (name === 'studentNumber' && isNaN(value)) {
      setStudentNumberError('Student Number must be numeric');
      return;
    } else {
      setStudentNumberError('');
    }

    // Update the state for other fields
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if the student number already exists
    const querySnapshot = await getDocs(collection(db, 'account'));
    const existingStudent = querySnapshot.docs.find(
      (doc) => doc.data().studentNumber === formData.studentNumber
    );
  
    if (existingStudent) {
      // Display a notification that the student number already exists
      toast.error('Student number already exists. Please use a different student number.');
      return;
    }
  
 
    // Upload the image to Firebase Storage
    let imageUrl = '';

    if (image) {
      const storageRef = ref(storage, 'images/' + image.name);
      
      try {
        const dataURL = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });

        await uploadString(storageRef, dataURL, 'data_url');
        imageUrl = await getDownloadURL(storageRef);
      } catch (error) {
        console.error('Error uploading image:', error);
        toast.error('Error uploading image. Please try again.');
        return;
      }
    }

  
    // Add the user to Firestore with imageUrl if available
    try {
      const docRef = await addDoc(collection(db, 'account'), {
        name: formData.name,
        studentNumber: formData.studentNumber,
        gradeLevel: formData.gradeLevel,
        section: formData.section,
        contactNumber: formData.contactNumber,
        imageUrl: imageUrl,  // Add imageUrl to the Firestore document
      });
  
      console.log('Document written with ID: ', docRef.id);
  
      // Display a success notification
      toast.success('Student added successfully!');
    } catch (error) {
      console.error('Error adding student:', error);
      toast.error('Error adding student. Please try again.');
    }
  
    // Notify the parent component about the new user
    onAddUser({
      ...formData,
      imageUrl: imageUrl,  // Add imageUrl to the onAddUser callback
    });
  
    // Reset the form after submission if needed
    setFormData({
      name: '',
      studentNumber: '',
      gradeLevel: '',
      section: '',
      contactNumber: '',
    });
    onClose();
  };
  

  return (
    <div className='usemain'>
      <button className="exit-btn" onClick={onClose}>
        X
      </button>
      <span className="title">Add Account</span>
      <form className="form" onSubmit={handleSubmit}>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          {nameError && <span className="error">{nameError}</span>}
          <label htmlFor="name">Name:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="studentNumber"
            value={formData.studentNumber}
            onChange={handleChange}
            required
          />
          {studentNumberError && <span className="error">{studentNumberError}</span>}
          <label htmlFor="studentNumber">Student Number:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="gradeLevel"
            value={formData.gradeLevel}
            onChange={handleChange}
            required
          />
          {gradeLevelError && <span className="error">{gradeLevelError}</span>}
          <label htmlFor="grade">Grade:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="section"
            value={formData.section}
            onChange={handleChange}
            required
          />
          {sectionError && <span className="error">{sectionError}</span>}
          <label htmlFor="section">Section:</label>
        </div>
        <div className="group">
          <input
            placeholder=""
            type="text"
            name="contactNumber"
            value={formData.contactNumber}
            onChange={handleChange}
            required
          />
          {contactNumberError && <span className="error">{contactNumberError}</span>}
          <label htmlFor="contactNumber">Contact Number:</label>
        </div>
        <label htmlFor="image">Select Image:</label>
        <div className="group">
          <input
            type="file"
            name="image"
            onChange={handleChange}
            accept="image/*"  // Allow only image files
          />
        
        </div>
        <button className='addstubtn' type="submit">
          Add
        </button>
      </form>
      <ToastContainer />
    </div>
  );
}

export default Adduser;
