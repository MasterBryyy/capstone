import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr-es6';
import './StudentInfo.css'; // Import your CSS file

function StudentInfo({ onClose }) {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [studentData, setStudentData] = useState({
    name: '',
    studentNo: '',
    contactNo: '',
    timeIn: '', // You may want to update this based on your needs
  });

  const handleScan = async () => {
    const imageData = webcamRef.current.getScreenshot();
    console.log('Image Data:', imageData);
    const image = new Image();
    image.src = imageData;
  
    image.onload = () => {
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
  
      if (code) {
        // Handle the QR code data as needed
        console.log('QR Code Data:', code.data);
  
        // Update state with QR code data
        setStudentData({
          name: code.data, // Update with actual data from the QR code
          
          timeIn: new Date().toLocaleTimeString(), // Update with actual time data
        });
  
        // Stop scanning after detecting a QR code
        setScanning(false);
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
            <p>Time In: {studentData.timeIn}</p>
        </div>
        <button className="scan-button" onClick={() => setScanning(true)}>
          Start Scanning
        </button>
      </div>
    </div>
  );
}

export default StudentInfo;
