import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr-es6';
import './StudentInfo.css'; // Import your CSS file
import { db } from '../Config/firestore';
import { collection, getDocs, deleteDoc, doc, addDoc, updateDoc } from 'firebase/firestore';
function StudentInfo({ onClose }) {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [studentData, setStudentData] = useState({
    name: '',
    studentNo: '',
    contactNo: '',
    timeIn: '', // You may want to update this based on your needs
    timeOut: '', 
  });

  const doesDocumentExist = async (studentNo) => {
    const querySnapshot = await getDocs(collection(db, 'qrscanned'));
    return querySnapshot.docs.some((doc) => doc.data().studentNo === studentNo);
  };
  

  const handleScan = async () => {
    const imageData = webcamRef.current.getScreenshot();
    const image = new Image();
    image.src = imageData;

    image.onload = async () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');

      // Set the canvas dimensions to match the image dimensions
      canvas.width = image.width;
      canvas.height = image.height;

      // Draw the image onto the canvas
      context.drawImage(image, 0, 0, image.width, image.height);

      // Get the pixel data from the canvas
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);

      // Pass the pixel data to jsQR
      const code = jsQR(imageData.data, canvas.width, canvas.height);

      if (code && code.data) {
        // Log the raw QR code data
        console.log('Raw QR Code Data:', code.data);

        // Extract individual pieces of information
        const match = code.data.match(/Name: (.*?) Grade: (.*?) Section: (.*?) Student No: (.*?) Contact No: (.*)/);

        if (match) {
          const name = match[1].trim();
          const gradeLevel = match[2].trim();
          const section = match[3].trim();
          const studentNo = match[4].trim();
          const contactNo = match[5].trim();

          // Check if the scanned QR code is the same as the previous one
          if (
            studentData.name === name &&
            studentData.studentNo === studentNo &&
            studentData.section === section &&
            studentData.contactNo === contactNo &&
            studentData.gradeLevel === gradeLevel
          ) {
            // Calculate time-out and update state
            const timeOut = new Date().toLocaleTimeString();
            setStudentData((prevData) => ({
              ...prevData,
              timeOut,
            }));
          } else {
            // Update state with new QR code data
            setStudentData({
              name,
              studentNo,
              contactNo,
              section,
              gradeLevel,
              timeIn: new Date().toLocaleTimeString(),
              timeOut: new Date().toLocaleTimeString(), // Reset time-out
            });
          }

          // Stop scanning after detecting a QR code
          setScanning(false);

          // Add the scanned data to the Firestore collection 'qrscanned'
          try {
            const qrScannedRef = await addDoc(collection(db, 'qrscanned'), {
              name,
              studentNo,
              section,
              contactNo,
              gradeLevel,
              timeIn: new Date().toLocaleTimeString(),
              timeOut: new Date().toLocaleTimeString(), // Initialize time-out in Firestore document
            });
            console.log('Document written with ID: ', qrScannedRef.id);
          } catch (error) {
            console.error('Error adding document to qrscanned collection:', error);
          }
        } else {
          console.log('QR Code data format does not match the expected structure');
        }
      } else {
        console.log('No QR Code found');
      }
    };
  };
  
  
    useEffect(() => {
    if (scanning) {
      const intervalId = setInterval(() => {
        handleScan();
      }, 1000); // Adjust the interval as needed (e.g., 1000 milliseconds = 1 second)

      return () => clearInterval(intervalId);
    }
  }, [scanning]);

  return (
    <div className="modaldiv">
      <div className="modal-content">
        <span className="close" onClick={onClose}>
          &times;
        </span>
        <div className="header">Student Information</div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          className="webcam-container"
        />
        <div className='modal-content2'>
            <p>Name: {studentData.name}</p>
            <p>Student No: {studentData.studentNo}</p>
            <p>Section: {studentData.section}</p>
            <p>Contact No: {studentData.contactNo}</p>
            <p>Grade Level: {studentData.gradeLevel}</p>
            <p>Time In: {studentData.timeIn}</p>
            <p>Time Out: {studentData.timeOut} </p>
        </div>
        <button className="scan-button" onClick={() => setScanning(true)}>
          Start Scanning
        </button>
      </div>
    </div>
  );
}

export default StudentInfo;
