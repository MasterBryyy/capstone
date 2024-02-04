import React, { useState, useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import jsQR from 'jsqr-es6';
import './StudentInfo.css'; // Import your CSS file
import { db } from '../Config/firestore';
import { collection, addDoc, updateDoc, doc, getDocs } from 'firebase/firestore';

function StudentInfo({ onClose }) {
  const webcamRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showStudentList, setShowStudentList] = useState(false); // New state for controlling the visibility of the student list
  const [absentStudents, setAbsentStudents] = useState([]);
  const [showWebcam, setShowWebcam] = useState(true);
  const [studentData, setStudentData] = useState({
    name: '',
    studentNo: '',
    contactNo: '',
    timeIn: '',
    timeOut: '',
    scannedDate: '', // Added field for scanned date
    id: '',
  });

  const toggleWebcam = () => {
    setShowWebcam(prevState => !prevState);
  };
  

  const sendSMS = async (phoneNumber, name) => {
    const apiKey = '739c8cc0da929761b2b46d0cb4438cfa';
    const currentTime = new Date().toLocaleTimeString();
    const message = `Dear Parent, your child ${name} has arrived from school at: ${currentTime}`;
  
    const url = `https://api.semaphore.co/api/v4/messages?apikey=${apiKey}&number=${phoneNumber}&message=${encodeURIComponent(
      message
    )}`;
  
    try {
      const response = await fetch(url, { method: 'POST' });
  
      if (response.ok) {
        console.log('SMS sent successfully');
      } else {
        console.error('Failed to send SMS:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };
  
  const sendSMSout = async (phoneNumber, name) => {
    const apiKey = '739c8cc0da929761b2b46d0cb4438cfa';
    const currentTime = new Date().toLocaleTimeString();
    const message = `Dear Parent, your child ${name} has leave from school at: ${currentTime}`;

    const url = `https://api.semaphore.co/api/v4/messages?apikey=${apiKey}&number=${phoneNumber}&message=${encodeURIComponent(
      message
    )}`;

    try {
      const response = await fetch(url, { method: 'POST' });

      if (response.ok) {
        console.log('SMS sent successfully');
      } else {
        console.error('Failed to send SMS:', response.statusText);
      }
    } catch (error) {
      console.error('Error sending SMS:', error);
    }
  };
  const sendAbsentSMS = async (phoneNumber, name) => {
    if (absentStudents.length === 0) {
      console.log('No absent students to send SMS.');
      return;
    }
  
    const apiKey = '739c8cc0da929761b2b46d0cb4438cfa';
    const currentTime = new Date().toLocaleTimeString();
    for (const student of absentStudents) {
      const message = `Dear Parent, your child ${student.name} is absent from school as of: ${currentTime}`;
  
      const url = `https://api.semaphore.co/api/v4/messages?apikey=${apiKey}&number=${student.contactNumber}&message=${encodeURIComponent(
        message
      )}`;
  
      try {
        const response = await fetch(url, { method: 'POST' });
  
        if (response.ok) {
          console.log(`SMS sent successfully for ${student.name}`);
        } else {
          console.error(`Failed to send SMS for ${student.name}:`, response.statusText);
        }
      } catch (error) {
        console.error(`Error sending SMS for ${student.name}:`, error);
      }
    }
  };

 const handleScan = async () => {
  if (studentData.timeIn) {
    alert('You have already scanned in for time in.');
    setScanning(false); // Stop the scanning process
    return;
  }
  let qrScannedRef;

  const imageData = webcamRef.current.getScreenshot();
  const image = new Image();
  image.src = imageData;

  image.onload = async () => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = image.width;
    canvas.height = image.height;
    context.drawImage(image, 0, 0, image.width, image.height);

    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code && code.data) {
      const match = code.data.match(/Name: (.*?) Grade: (.*?) Section: (.*?) Student No: (.*?) Contact No: (.*)/);

      if (match) {
        const name = match[1].trim();
        const gradeLevel = match[2].trim();
        const section = match[3].trim();
        const studentNo = match[4].trim();
        const contactNo = match[5].trim();

        const scannedDate = new Date().toLocaleDateString(); // Capture the date

        // Check if the scanned data exists in the Firestore collection
        const userQuerySnapshot = await getDocs(collection(db, 'account'));
        const userDoc = userQuerySnapshot.docs.find(
          (doc) =>
            doc.data().name === name &&
            doc.data().studentNumber === studentNo &&
            doc.data().section === section &&
            doc.data().contactNumber === contactNo &&
            doc.data().gradeLevel === gradeLevel
        );

        if (!userDoc) {
          // If the user document does not exist, show an alert message
          alert('User does not exist');
          return;
        }

        if (
          studentData.name === name &&
          studentData.studentNo === studentNo &&
          studentData.section === section &&
          studentData.contactNo === contactNo &&
          studentData.gradeLevel === gradeLevel
        ) {
          const timeOut = new Date().toLocaleTimeString();
          setStudentData((prevData) => ({
            ...prevData,
            timeOut,
          }));

          try {
            await updateDoc(doc(db, 'qrscanned', studentData.id), {
              timeOut,
            });
            // Send SMS when checking out
            sendSMSout(studentData.contactNo, name);
            console.log('Document updated with time-out:', studentData.id);
          } catch (error) {
            console.error('Error updating document in qrscanned collection:', error);
          }
        } else {
          setStudentData({
            name,
            studentNo,
            contactNo,
            section,
            gradeLevel,
            timeIn: new Date().toLocaleTimeString(),
            timeOut: '',
            scannedDate, // Set the scanned date
          });

          try {
            const newDocRef = await addDoc(collection(db, 'qrscanned'), {
              name,
              studentNo,
              section,
              contactNo,
              gradeLevel,
              timeIn: new Date().toLocaleTimeString(),
              timeOut: '',
              scannedDate,
            });
            console.log('Document written with ID:', newDocRef.id);
            qrScannedRef = newDocRef;
            // Send SMS when checking in
            sendSMS(contactNo, name);
            // Set the ID in the state for future updates
            setStudentData((prevData) => ({
              ...prevData,
              id: newDocRef.id,
            }));
          } catch (error) {
            console.error('Error adding document to qrscanned collection:', error);
          }
        }

        setScanning(false);
      } else {
        console.log('QR Code data format does not match the expected structure');
      }
    } else {
      console.log('No QR Code found');
    }
  };
};

  const getExistingScannedData = async (name, studentNo, section, contactNo, gradeLevel) => {
    try {
      const querySnapshot = await getDocs(collection(db, 'qrscanned'));
      const scannedData = querySnapshot.docs.map(doc => doc.data());
      return scannedData.find(data =>
        data.name === name &&
        data.studentNo === studentNo &&
        data.section === section &&
        data.contactNo === contactNo &&
        data.gradeLevel === gradeLevel
      );
    } catch (error) {
      console.error('Error fetching existing scanned data:', error);
      return null;
    }
  };
  
  const handleTimeoutScan = async () => {
    const imageData = webcamRef.current.getScreenshot();
    const image = new Image();
    image.src = imageData;
  
    image.onload = async () => {
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
  
      canvas.width = image.width;
      canvas.height = image.height;
      context.drawImage(image, 0, 0, image.width, image.height);
  
      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, canvas.width, canvas.height);
  
      if (code && code.data) {
        const match = code.data.match(/Name: (.*?) Grade: (.*?) Section: (.*?) Student No: (.*?) Contact No: (.*)/);
  
        if (match) {
          const name = match[1].trim();
          const gradeLevel = match[2].trim();
          const section = match[3].trim();
          const studentNo = match[4].trim();
          const contactNo = match[5].trim();
  
          const scannedDate = new Date().toLocaleDateString(); // Capture the date
  
          // Fetch timeIn if already scanned
          const existingScannedData = await getExistingScannedData(name, studentNo, section, contactNo, gradeLevel);
  
          // Set the student data including timeIn
          setStudentData({
            name,
            studentNo,
            contactNo,
            section,
            gradeLevel,
            timeIn: existingScannedData ? existingScannedData.timeIn : new Date().toLocaleTimeString(),
            timeOut: new Date().toLocaleTimeString(),
            scannedDate,
          });
  
          try {
            const userQuerySnapshot = await getDocs(collection(db, 'account'));
            const userDoc = userQuerySnapshot.docs.find(
              (doc) =>
                doc.data().name === name &&
                doc.data().studentNumber === studentNo &&
                doc.data().section === section &&
                doc.data().contactNumber === contactNo &&
                doc.data().gradeLevel === gradeLevel
            );
  
            if (userDoc) {
              // Set the imageUrl from the Firestore document
              setImageUrl(userDoc.data().imageUrl || ''); // Use default value if imageUrl is not present
            }
  
            const newDocRef = await addDoc(collection(db, 'qrscanned'), {
              name,
              studentNo,
              section,
              contactNo,
              gradeLevel,
              timeIn: existingScannedData ? existingScannedData.timeIn : new Date().toLocaleTimeString(),
              timeOut: new Date().toLocaleTimeString(),
              scannedDate,
            });
            console.log('Document written with ID:', newDocRef.id);
            // Send SMS when checking out
            sendSMSout(contactNo, name);
            // Set the ID in the state for future updates
            setStudentData((prevData) => ({
              ...prevData,
              id: newDocRef.id,
            }));
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
  
  const fetchAbsentStudents = async () => {
    try {
      const userQuerySnapshot = await getDocs(collection(db, 'account'));
      const allStudents = userQuerySnapshot.docs.map(doc => doc.data());
  
      // Filter out students who have been scanned already
      const scannedStudentsQuerySnapshot = await getDocs(collection(db, 'qrscanned'));
      const scannedStudents = scannedStudentsQuerySnapshot.docs.map(doc => doc.data());
  
      const absentStudents = allStudents.filter(student => {
        // Check if the student exists in the scanned students list
        return !scannedStudents.some(scannedStudent => {
          return (
            scannedStudent.name === student.name &&
            scannedStudent.studentNo === student.studentNumber &&
            scannedStudent.section === student.section &&
            scannedStudent.contactNo === student.contactNumber &&
            scannedStudent.gradeLevel === student.gradeLevel
          );
        });
      });
  
      setAbsentStudents(absentStudents);
    } catch (error) {
      console.error('Error fetching absent students:', error);
    }
  };
  useEffect(() => {
    fetchAbsentStudents();
  }, []);
  
  

  useEffect(() => {
    if (scanning) {
      const intervalId = setInterval(() => {
        handleScan();
      }, 1000);

      return () => clearInterval(intervalId);
    }
  }, [scanning]);

  return (
    <div className="modaldiv">
       <div>
        <button className="close" onClick={onClose}>Close</button>
      </div>
      <div>
        <span>Please Scan Here The Qrcode</span>
      </div>
        <div>
        {showWebcam && (
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="webcam-container"
          />
        )}

        </div>
        <div>
        <button onClick={toggleWebcam}>
          {showWebcam ? 'Hide Webcam' : 'Show Webcam'}
        </button>
      </div>
     
        <div className='modal-content2'>
{imageUrl && (
  <div className='user-image'>
    <img src={imageUrl} alt={"User"} />
  </div>
)}
<table className="student-table">
  <tbody>
    <tr>
      <td>Name:</td>
      <td>{studentData.name}</td>
    </tr>
    <tr>
      <td>Student No:</td>
      <td>{studentData.studentNo}</td>
    </tr>
    <tr>
      <td>Section:</td>
      <td>{studentData.section}</td>
    </tr>
    <tr>
      <td>Contact No:</td>
      <td>{studentData.contactNo}</td>
    </tr>
    <tr>
      <td>Grade Level:</td>
      <td>{studentData.gradeLevel}</td>
    </tr>
    <tr>
      <td>Time In:</td>
      <td>{studentData.timeIn}</td>
    </tr>
    <tr>
      <td>Time Out:</td>
      <td>{studentData.timeOut}</td>
    </tr>
    <tr>
      <td>Scanned Date:</td>
      <td>{studentData.scannedDate}</td>
    </tr>
  </tbody>
</table>
<div>
  <button className="scan-button" onClick={() => setScanning(true)}>
    Scan timein
  </button>
  <button className='scan-timeout' onClick={handleTimeoutScan}>Scan timeout</button>
</div>
<div>


        {showStudentList && (
          <div className="student-list-modal">
            <h2>Absent Students</h2>
            <button className="send-sms-button" onClick={sendAbsentSMS}>Send sms</button>
            
            <table className="student-list-table">
              
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Student No</th>
                  <th>Contact Number</th>
                  <th>Section</th>
                  <th>Grade Level</th>
                 
                  {/* Add more table headers as needed */}
                </tr>
                
              </thead>
              <tbody>
                {absentStudents.map((student, index) => (
                  <tr key={index}>
                    <td>{student.name}</td>
                    <td>{student.studentNumber}</td>
                    <td>{student.contactNumber}</td>
                    <td>{student.section}</td>
                    <td>{student.gradeLevel}</td>
                   
                    {/* Add more table data cells as needed */}
                  </tr>
                ))}
              </tbody>
              
            </table>
            <button className="close-button" onClick={() => setShowStudentList(false)}>Close</button>
          </div>
        )}
      </div>
    </div>
  </div>
);
}
export default StudentInfo;