// VehicleInfo.tsx
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textInput";

interface VehicleInfoProps {
  registrationNumber: string;
  setRegistrationNumber: (value: string) => void;
  contactNumber: string;
  setContactNumber: (value: string) => void;
  engineSize: string;
  setEngineSize: (value: string) => void;
  selectedCarType: string | null;
  setIsFormValid: (isValid: boolean) => void;
  CCorWeight: string;

  setCCorWeight: React.Dispatch<React.SetStateAction<string>>;
}

const VehicleInfo: React.FC<VehicleInfoProps> = ({
  registrationNumber,
  setRegistrationNumber,
  contactNumber,
  setContactNumber,
  engineSize,
  setEngineSize,
  selectedCarType,
  setIsFormValid,
  CCorWeight,
  setCCorWeight,
}) => {
  const [isInvalidContact, setIsInvalidContact] = useState(false);
  const [isInvalidLicense, setIsInvalidLicense] = useState(false);
  const [isInvalidEngineSize, setIsInvalidEngineSize] = useState(false);

  const handleLicenseChange = (value: string) => {
    setRegistrationNumber(value);

    // รูปแบบของทะเบียนรถไทย: เลข 1-2 ตัว (ถ้ามี) + ตัวอักษรไทย 1-2 ตัว + ตัวเลข 1-4 ตัว
    const licensePlatePattern = /^(\d{1,2})?[ก-ฮ]{1,2}\d{1,4}$/;

    // ตรวจสอบความยาวขั้นต่ำ (ไม่ควรน้อยกว่า 3 ตัวอักษร)
    const isLengthInvalid = value.length > 0 && value.length < 3;

    // ตรวจสอบรูปแบบที่ไม่ถูกต้อง
    const isFormatInvalid = !licensePlatePattern.test(value);

    const invalid = isLengthInvalid || isFormatInvalid;
    setIsInvalidLicense(invalid);

    // ตรวจสอบความถูกต้องของฟอร์มทั้งหมด
    setIsFormValid(!isInvalidContact && !invalid && !isInvalidEngineSize);
  };

  const handleContactChange = (value: string) => {
    if (/^\d*$/.test(value)) {
      setContactNumber(value);
    }

    // เพิ่มการตรวจสอบความยาวของหมายเลขโทรศัพท์
    const phonePattern = /^(06|08|09)\d{8}$/;
    const isLengthInvalid = value.length > 0 && value.length < 10;
    const isFormatInvalid = value.length >= 10 && !phonePattern.test(value);

    const invalid = isLengthInvalid || isFormatInvalid;
    setIsInvalidContact(invalid);

    setIsFormValid(!isInvalidLicense && !invalid && !isInvalidEngineSize); // เช็คความถูกต้อง
  };

  const handleEngineSizeChange = (value: string) => {
    setEngineSize(value);
    const invalid = value.length > 0 && isNaN(Number(value));
    setIsInvalidEngineSize(invalid);
    setIsFormValid(!isInvalidLicense && !isInvalidContact && !invalid); // เช็คความถูกต้อง
  };

  // Update label when selectedCarType changes
  useEffect(() => {
    if (selectedCarType) {
      const label =
        selectedCarType === "รถบรรทุก" ||
        selectedCarType === "รถบรรทุก(เกิน7ที่นั่ง)" ||
        selectedCarType === "รถไฮบริด" ||
        selectedCarType === "รถไฟฟ้า"
          ? "น้ำหนักรถ (กิโลกรัม)"
          : "ขนาดความจุ CC";

      setCCorWeight(label); // Set label for engine size or weight
    }
  }, [selectedCarType, setCCorWeight]);

  return (
    <Row>
      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextInput
          label="หมายเลขทะเบียนรถ"
          id="registrationNumber"
          value={registrationNumber}
          onChange={(e) => handleLicenseChange(e.target.value)}
          required
          placeholder="ตัวอย่าง: 1กข9xxx"
          isInvalid={isInvalidLicense}
          alertText={
            isInvalidLicense
              ? registrationNumber.length < 3
                ? "กรุณากรอกหมายเลขทะเบียนรถให้ครบถ้วน"
                : "กรอกเกินจำนวน กรุณากรอกหมายเลขทะเบียนรถให้ถูกต้อง"
              : ""
          }
        />
      </Col>

      <Col className="register-and-contract-number mb-4" md={4} xs={6}>
        <TextInput
          label="หมายเลขโทรศัพท์ผู้กรอกข้อมูล"
          id="contactNumber"
          value={contactNumber}
          onChange={(e) => handleContactChange(e.target.value)}
          placeholder="หมายเลขโทรศัพท์10หลัก"
          required
          isInvalid={isInvalidContact}
          alertText={
            isInvalidContact
              ? contactNumber.length > 10
                ? "กรุณากรอกหมายเลขโทรศัพท์ 10 หลักและเริ่มด้วย 06, 08 หรือ 09"
                : "กรุณากรอกเบอร์โทรศัพท์ให้ครบ 10 หลัก"
              : ""
          }
        />
      </Col>

      <Col className="mb-4" md={4} xs={12}>
        {selectedCarType && (
          <TextInput
            label={CCorWeight}
            placeholder={
              selectedCarType === "รถบรรทุก" ||
              selectedCarType === "รถบรรทุก(เกิน7ที่นั่ง)" ||
              selectedCarType === "รถไฮบริด" ||
              selectedCarType === "รถไฟฟ้า"
                ? "กรอกน้ำหนักรถ(กิโลกรัม)"
                : selectedCarType === "รถพ่วง" ||
                  selectedCarType === "รถบดถนน" ||
                  selectedCarType === "รถแทรกเตอร์"
                ? "ไม่ต้องใส่"
                : "กรอกความจุของรถ(CC)"
            }
            id="engineSize"
            value={engineSize}
            onChange={(e) => handleEngineSizeChange(e.target.value)}
            required
            isInvalid={isInvalidEngineSize}
            alertText="กรุณากรอกขนาดเครื่องยนต์ให้ถูกต้อง"
            disabled={
              selectedCarType === "รถพ่วง" ||
              selectedCarType === "รถบดถนน" ||
              selectedCarType === "รถแทรกเตอร์"
            } // เพิ่มเงื่อนไขล็อค
          />
        )}
      </Col>
    </Row>
  );
};

export default VehicleInfo;
