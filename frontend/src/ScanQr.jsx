import { QRCodeCanvas } from 'qrcode.react';

function QRCodeGenerator() {
  const data = "http://4.247.166.182:5173/quiz"; // or any string or URL

  return (
    <div style={{ 
      marginBottom: '20px',
      padding: '20px',
      border: '15px solid #ff6b6b',
      borderRadius: '10px',
      background: 'white',
      boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)'
    }}>
      <QRCodeCanvas 
        value={data} 
        size={400}
        level="H"
        fgColor="#2c3e50"
        bgColor="#ffffff"
      />
    </div>
  );
}

export default QRCodeGenerator;