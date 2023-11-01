import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import QRCode from 'qrcode.react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Adduser from './Adduser';
import '../pages/ManageAccount.css'
import { db } from '../Config/firestore';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore';
const User = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [lastUsedId, setLastUsedId] = useState(3);

  // Fetch data from Firestore and update state
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'account'));
        const newData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setData(newData);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };

    fetchData();
  }, []); // Run this effect only once when the component mounts

  const handleAddBtnClick = () => {
    setShowModal(true);
  };

  const handleCloseModals = () => {
    setShowModal(false);
  };

  const generateQRCode = (text) => {
    // You can customize the QR code generation logic based on the student data
    return `QRCode: ${text}`;
  };

  const handleAddUser = async (newUser) => {
    try {
      // Generate the QR code
      const qrCode = generateQRCode(`Name: ${newUser.name} Student No: ${newUser.studentNumber} Contact No: ${newUser.contactNumber}`);
  
      // Add the user to Firestore with the QR code
      const docRef = await addDoc(collection(db, 'account'), {
        ...newUser,
        qrCode: qrCode,
      });
  
      console.log('Document written with ID: ', docRef.id);
  
      // Update the local state with the new user
      setData((prevData) => [
        ...prevData,
        {
          id: docRef.id, // Use Firestore-generated ID
          ...newUser,
          qrCode: qrCode,
        },
      ]);
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const handleDelete = async (id) => {
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure you want to delete this student?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              // Delete the document from Firestore
              await deleteDoc(doc(db, 'account', id));
  
              // Update the local state to reflect the deletion
              const updatedData = data.filter((item) => item.id !== id);
              setData(updatedData);
            } catch (error) {
              console.error('Error deleting document:', error);
            }
          },
        },
        {
          label: 'No',
          onClick: () => {},
        },
      ],
    });
  };
  

  const toggleQRVisibility = () => {
    setShowQR(!showQR);
  };

  return (
    <div>
      <div className='addbtn-container'>
        <button className='addbtn' onClick={handleAddBtnClick}>
          Add Student +
        </button>
      </div>
      <h1>Manage Account</h1>
      <table className='table'>
        <thead>
          <tr>
            <th>Name</th>
            <th>Student Number</th>
            <th>Contact Number</th>
            <th>Grade Level</th>
            <th>Section</th>
            <th>QR Code</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.studentNumber}</td>
              <td>{item.contactNumber}</td>
              <td>{item.gradeLevel}</td>
              <td>{item.section}</td>
              <td onClick={() => setShowQR(!showQR)}>
                {showQR ? (
                  <QRCode value={item.qrCode} />
                ) : (
                  <span>
                    <i className="eye-icon">👁️</i>
                    QR Code Hidden
                  </span>
                )}
              </td>
              <td>
                <div className='button-con'>
                  <button className="delete-btn" onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                  <button>
                    View
                  </button>
                </div>
                
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     {showModal && <Adduser onClose={handleCloseModals} onAddUser={handleAddUser} />}
    </div>
  );
};

export default User;
