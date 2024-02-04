import React, { useState, useEffect } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import QRCode from 'qrcode.react';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Modal from 'react-modal';
import Adduser from './Adduser';
import ViewUserModal from './ViewUserModal'; // Import the new modal
import '../pages/ManageAccount.css';
import { db } from '../Config/firestore';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc, getDoc } from 'firebase/firestore';
import * as XLSX from 'xlsx';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import EditUserModal from './EditUserModal';

// Set the root element for the modal
Modal.setAppElement('#root');

const User = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showQR, setShowQR] = useState(false);
  const [lastUsedId, setLastUsedId] = useState(3);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isUploading, setIsUploading] = useState(false); // Added state for file upload
  const [selectAll, setSelectAll] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showArchiveModal, setShowArchiveModal] = useState(false);
  const [archiveData, setArchiveData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedSection, setSelectedSection] = useState('');
const [selectedGradeLevel, setSelectedGradeLevel] = useState('');



  const handleArchiveBtnClick = async () => {
    // Fetch data from the "archive" Firestore collection
    try {
      const querySnapshot = await getDocs(collection(db, 'archive'));
      const archiveData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setArchiveData(archiveData);
      setShowArchiveModal(true);
    } catch (error) {
      console.error('Error fetching data from archive collection:', error);
    }
  };

  const handleCloseArchiveModal = () => {
    setShowArchiveModal(false);
  };



  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'account'));
        const newData = querySnapshot.docs.map((doc) => {
          const user = { id: doc.id, ...doc.data() };
          user.qrCode = generateQRCode(user);
          return user;
        });
        newData.sort((a, b) => a.name.localeCompare(b.name));
        setData(newData);
      } catch (error) {
        console.error('Error fetching data from Firestore:', error);
      }
    };
  
    fetchData();
  }, []);

  useEffect(() => {
    getStudent();
  }, []); // Updated dependency array


  const handleAddBtnClick = () => {
    setShowModal(true);
  };
  const handleView = (user) => {
    // Logic to handle the "View" action for the selected user
    setShowViewModal(true); // Assuming you want to show the View modal
    setSelectedUser(user);
  };


  const handleCloseModals = () => {
    setShowModal(false);
    setShowViewModal(false);
  };

  const generateQRCode = (row) => {
    return `QRCode: Name: ${row.name} Grade: ${row.gradeLevel} Section: ${row.section} Student No: ${row.studentNumber} Contact No: ${row.contactNumber}`;
  };

  const handleAddUser = (newUser) => {
    setLastUsedId((prevId) => prevId + 1); // Update lastUsedId before updating the data state


    const qrCode = generateQRCode(newUser);

    setData((prevData) => [
      ...prevData,
      {
        id: lastUsedId + 1,
        ...newUser,
        qrCode: qrCode,
      },
    ]);

    setLastUsedId((prevId) => prevId + 1);
  };

  const handleDelete = async (itemId) => {
    const itemsToDelete = selectAll ? data.map((item) => item.id) : [...selectedItems, itemId];
    
    if (itemsToDelete.length === 0) {
      // No items selected
      return;
    }
    
    confirmAlert({
      title: 'Confirm to Delete',
      message: 'Are you sure you want to delete the selected item(s)?',
      buttons: [
        {
          label: 'Yes',
          onClick: async () => {
            try {
              // Move selected items to the "archive" collection
              await Promise.all(itemsToDelete.map(async (id) => {
                const docRef = doc(db, 'account', id);
                const documentData = (await getDoc(docRef)).data();
    
                // Delete document from the original collection
                await deleteDoc(docRef);
    
                // Add document to the "archive" collection
                const archiveDocRef = await addDoc(collection(db, 'archive'), documentData);
                console.log(`Document moved to archive with ID: ${archiveDocRef.id}`);
              }));
    
              // Update the data state by filtering out the deleted items
              const updatedData = data.filter((item) => !itemsToDelete.includes(item.id));
              setData(updatedData);
    
              // Clear selected items
              setSelectAll(false);
              setSelectedItems([]);
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

  const [users, setUsers] = useState([]);

  const getStudent = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'account'));
      const users = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setUsers(users);
    } catch (error) {
      console.error('Error fetching data: ', error);
    }
  };

  useEffect(() => {
    getStudent();
  }, [users]);

  const handleExcelUpload = async (event) => {
    const file = event.target.files[0];
  
    if (file) {
      // Show a confirmation dialog before proceeding with the upload
      confirmAlert({
        title: 'Confirm Upload',
        message: 'Are you sure you want to upload this Excel file?',
        buttons: [
          {
            label: 'Yes',
            onClick: async () => {
              setIsUploading(true);
  
              try {
                const reader = new FileReader();
                reader.onload = async (e) => {
                  const data = new Uint8Array(e.target.result);
                  const workbook = XLSX.read(data, { type: 'array' });
                  const sheetName = workbook.SheetNames[0];
  
                  const sheet = workbook.Sheets[sheetName];
                  const jsonData = XLSX.utils.sheet_to_json(sheet);
  
                  // Fetch the latest users from Firestore
                  await getStudent();
  
                  // Check for duplicate student numbers with the existing users
                  const existingStudentNumbers = users.map((user) => user.studentNumber);
                  const newUsers = jsonData.filter((row) => !existingStudentNumbers.includes(row.studentNumber));
  
                  if (newUsers.length === 0) {
                    toast.info('No new users to add.');
                  } else {
                    // Add new users to Firestore
                    await addDataToFirestore(newUsers);
                    toast.success('New users added successfully!');
  
                    // Fetch the latest users again after adding new users
                    await getStudent();
  
                    // Your other logic here...
                  }
                };
  
                reader.readAsArrayBuffer(file);
              } catch (error) {
                toast.error('Error during file upload. Please try again.');
              } finally {
                setIsUploading(false);
  
                // Reset the file input value after the upload is complete
                event.target.value = '';
              }
            },
          },
          {
            label: 'No',
            onClick: () => {},
          },
        ],
      });
    }
  };
  
  const addDataToFirestore = async (jsonData) => {
    jsonData.forEach(async (row) => {
      try {
        // Check if the student number already exists in Firestore
        const existingStudent = users.find((user) => user.studentNumber === row.studentNumber);

        if (existingStudent) {
          // Display a notification or alert indicating duplicate student numbers
          toast.error(`Student number ${row.studentNumber} already exists. Please check your data.`);
        } else {
          console.log('Adding data to Firestore:', row);

          const qrCode = generateQRCode(row);

          const docRef = await addDoc(collection(db, 'account'), {
            name: row.name,
            studentNumber: row.studentNumber,
            section: row.section,
            gradeLevel: row.gradeLevel,
            contactNumber: row.contactNumber,
            qrCode: qrCode,
          });

          setUsers((prevUsers) => [...prevUsers, { id: docRef.id, ...row }]);
          setData((prevData) => [...prevData, { id: docRef.id, ...row, qrCode: qrCode }]);
        }
      } catch (error) {
        console.error('Error adding document: ', error);
      }
    });
  };
  const [showEditModal, setShowEditModal] = useState(false);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleSaveEdit = async (editedUser) => {
    try {
      // Update the user data in Firestore
      await updateUserDataInFirestore(editedUser);

      // Update the local state with the edited user
      setData((prevData) =>
        prevData.map((item) => (item.id === editedUser.id ? { ...item, ...editedUser } : item))
      );

      toast.success('User information updated successfully!');
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating user information:', error);
      toast.error('Error updating user information. Please try again.');
    }
  };

  const updateUserDataInFirestore = async (editedUser) => {
    try {
      await updateDoc(doc(db, 'account', editedUser.id), {
        name: editedUser.name,
        studentNumber: editedUser.studentNumber,
        section: editedUser.section,
        gradeLevel: editedUser.gradeLevel,
        contactNumber: editedUser.contactNumber,
        qrCode: generateQRCode(editedUser),
      });
    } catch (error) {
      console.error('Error updating document in Firestore:', error);
      throw error;
    }
  };
  const handleToggleSelection = (itemId) => {
    if (selectedItems.includes(itemId)) {
      // Remove item from selectedItems
      setSelectedItems((prevSelected) =>
        prevSelected.filter((selectedId) => selectedId !== itemId)
      );
    } else {
      // Add item to selectedItems
      setSelectedItems((prevSelected) => [...prevSelected, itemId]);
    }
  };
  
  const handleSelectAll = () => {
    setSelectAll(!selectAll);
    setSelectedItems(selectAll ? [] : data.map((item) => item.id));
  };
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };
  const handleSectionChange = (e) => {
    setSelectedSection(e.target.value);
  };
  const handleGradeLevelChange = (e) => {
    setSelectedGradeLevel(e.target.value);
  };

  // Filter the data based on the search term
  const filteredData = data.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filterData = () => {
  return data.filter((item) => {
    const isNameMatch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const isGradeLevelMatch = selectedGradeLevel === '' || parseInt(item.gradeLevel, 10) === parseInt(selectedGradeLevel, 10);
    const isSectionMatch = selectedSection === '' || item.section === selectedSection;

    return isNameMatch && isGradeLevelMatch && isSectionMatch;
  });
};
const handleDeleteAll = async () => {
  confirmAlert({
    title: 'Confirm to Delete',
    message: 'Are you sure you want to delete all selected items?',
    buttons: [
      {
        label: 'Yes',
        onClick: async () => {
          try {
            // Move selected items to the "archive" collection
            await Promise.all(selectedItems.map(async (id) => {
              const docRef = doc(db, 'account', id);
              const documentData = (await getDoc(docRef)).data();

              // Delete document from the original collection
              await deleteDoc(docRef);

              // Add document to the "archive" collection
              const archiveDocRef = await addDoc(collection(db, 'archive'), documentData);
              console.log(`Document moved to archive with ID: ${archiveDocRef.id}`);
            }));

            // Update the data state
            const updatedData = data.filter((item) => !selectedItems.includes(item.id));
            setData(updatedData);

            // Clear selected items
            setSelectAll(false);
            setSelectedItems([]);
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
const downloadQRCode = (qrCodeData, fileName) => {
  const canvas = document.querySelector('canvas');
  const dataUrl = canvas.toDataURL();

  // Create a Blob object from the data URL
  const blob = dataURItoBlob(dataUrl);

  // Create a temporary anchor element
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${fileName}.png`;

  // Open file manager or prompt user to choose download location
  link.click();
};


// Function to convert data URI to Blob object
const dataURItoBlob = (dataURI) => {
  const byteString = atob(dataURI.split(',')[1]);
  const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
  const arrayBuffer = new ArrayBuffer(byteString.length);
  const uint8Array = new Uint8Array(arrayBuffer);
  
  for (let i = 0; i < byteString.length; i++) {
    uint8Array[i] = byteString.charCodeAt(i);
  }
  
  return new Blob([arrayBuffer], { type: mimeString });
};


  return (
    <div>
      <ToastContainer />
      <div className='addbtn-container'>
        <button className='addbtn' onClick={handleAddBtnClick}>
          Add Student +
        </button>
        <button className='archive-btn' onClick={handleArchiveBtnClick}>
        Archive
      </button>
      </div>

      <div>
      <input
        type="text"
        placeholder="Search by name"
        value={searchTerm}
        onChange={handleSearch}
        className='search-input'
      />
       {/* Add dropdowns for grade level and section */}
       <div className="filter-dropdowns">
       <label>Select Grade Level:</label>
       <select value={selectedGradeLevel} onChange={handleGradeLevelChange}>
       <option value=''>All</option>
          <option value='7'>Grade 7</option>
          <option value='8'>Grade 8</option>
          <option value='9'>Grade 9</option>
          <option value='10'>Grade 10</option>
          <option value='11'>Grade 11</option>
          <option value='12'>Grade 12</option>
        </select>

        <label>Select Section:</label>
        <select value={selectedSection} onChange={handleSectionChange}>
        <option value=''>All</option>
          <option value='Mapagmahal'>Mapagmahal</option>
          <option value='Zara'>Zara</option>
          <option value='Jacinto'>Jacinto</option>
          <option value='Balagtas'>Balagtas</option>
          <option value='Tolentino'>Tolentino</option>
          <option value='Napkil'>Napkil</option>
          <option value='BSIT'>BSIT</option>
        </select>
      </div>
    </div>
      
      
      <table className='table'>
      <thead>
  <tr>
    <th>
    <div className='select-all-container'>
  <button onClick={handleSelectAll}>
    {selectAll ? 'Deselect All' : 'SELECT ALL'}
  </button>
  {selectedItems.length > 0 && (
    <button className='delete-btn' onClick={() => handleDeleteAll()}>
      Delete Selected
    </button>
  )}
</div>

    </th>
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
          
          
        {filterData().map((item) => (
  <tr key={item.id}>
              <td>
              <input
                  type="checkbox"
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleToggleSelection(item.id)}
                />
              </td>
              <td>{item.name}</td>
              <td>{item.studentNumber}</td>
              <td>{item.contactNumber}</td>
              <td>{item.gradeLevel}</td>
              <td>{item.section}</td>
              
              <td onClick={() => downloadQRCode(item.qrCode, `${item.name}_${item.studentNumber}`)}>
  <QRCode value={item.qrCode} />
</td>

              <td>
                <div className='button-con'>
                <button className='edit-btn' onClick={() => handleEdit(item)}>
                    Edit
                  </button>
                  <button className='delete-btn' onClick={() => handleDelete(item.id)}>
                    Delete
                  </button>
                  <button className='view-btn' onClick={() => handleView(item)}>
                    View
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal
        isOpen={showArchiveModal}
        onRequestClose={handleCloseArchiveModal}
        contentLabel='Archive Modal'
      >
        <h2>Archive</h2>
        <table className='table'>
          <thead>
            <tr>
              <th>Name</th>
              <th>Student Number</th>
              <th>Contact Number</th>
              <th>Grade Level</th>
              <th>Qr Code</th>
              <th>Section</th>
              {/* Add other fields you want to display */}
            </tr>
          </thead>
          <tbody>
            {archiveData.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.studentNumber}</td>
                <td>{item.contactNumber}</td>
                <td>{item.gradeLevel}</td>
                <td onClick={() => setShowQR(!showQR)}>

                {showQR ? (
                  <QRCode value={item.qrCode} />
                ) : (
                  <span>
                    <i className='eye-icon'>👁️</i>
                    QR Code Hidden
                  </span>
                )}
              </td>
                <td>{item.section}</td>
                {/* Add other fields you want to display */}
              </tr>
            ))}
          </tbody>
        </table>
        <button onClick={handleCloseArchiveModal}>Close</button>
      </Modal>
      {isUploading && <div>Uploading...</div>}
      <EditUserModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        user={selectedUser}
        onSave={handleSaveEdit}
      />

      {/* Modal for Viewing User Details */}
      <ViewUserModal isOpen={showViewModal} onClose={() => setShowViewModal(false)} user={selectedUser} />

      <input type='file' accept='.xls,.xlsx' onChange={handleExcelUpload} />

      {showModal && <Adduser onClose={handleCloseModals} onAddUser={handleAddUser} />}
    </div>
  );
};

export default User;