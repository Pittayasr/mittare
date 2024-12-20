import React, { useState, useEffect } from "react";
import { Col, Row } from "react-bootstrap";
import TextInput from "../textFillComponent/textInput";
import TextSelect from "../textFillComponent/textSelect";
import RadioButton from "../textFillComponent/radioButton";
import provinces from "../../data/provinces.json";

interface InsuranceVehicleInfoProps {
  vehicleType: string;
  selectedProvinceRegistered: string | null;
  setSelectedProvinceRegistered: (value: string | null) => void;
  selectedProvinceDriver: string | null;
  setSelectedProvinceDriver: (value: string | null) => void;
  selectedProvinceLocation: string | null;
  setSelectedProvinceLocation: (value: string | null) => void;
  propertyType: string;
  setPropertyType: (value: string) => void;
  gender: string;
  setGender: (value: string) => void;
  maritalStatus: string;
  setMaritalStatus: (value: string) => void;
  occupation: string;
  setOccupation: (value: string) => void;
  licenseAge: string;
  setLicenseAge: (value: string) => void;
  vehicleBrand: string;
  setVehicleBrand: (value: string) => void;
  vehicleModel: string;
  setVehicleModel: (value: string) => void;
  engineSize: string;
  setEngineSize: (value: string) => void;
  vehicleYear: string;
  setVehicleYear: (value: string) => void;
  vehiclePurpose: string;
  setVehiclePurpose: (value: string) => void;
  hasDashCam: string;
  setHasDashCam: (value: string) => void;
  hasVoluntaryInsurance: string;
  setHasVoluntaryInsurance: (value: string) => void;
  propertyValue: string;
  setPropertyValue: (value: string) => void;
  isInvalid: boolean;
  onValidateInsuranceVehicleInfo: (validations: { isInvalid: boolean }) => void;
}

const InsuranceVehicleInfo: React.FC<InsuranceVehicleInfoProps> = ({
  vehicleType,
  selectedProvinceRegistered,
  setSelectedProvinceRegistered,
  selectedProvinceDriver,
  setSelectedProvinceDriver,
  selectedProvinceLocation,
  setSelectedProvinceLocation,
  propertyType,
  setPropertyType,
  gender,
  setGender,
  maritalStatus,
  setMaritalStatus,
  occupation,
  setOccupation,
  licenseAge,
  setLicenseAge,
  vehicleBrand,
  setVehicleBrand,
  vehicleModel,
  setVehicleModel,
  engineSize,
  setEngineSize,
  vehicleYear,
  setVehicleYear,
  vehiclePurpose,
  setVehiclePurpose,
  hasDashCam,
  setHasDashCam,
  hasVoluntaryInsurance,
  setHasVoluntaryInsurance,
  propertyValue,
  setPropertyValue,
  isInvalid,
  onValidateInsuranceVehicleInfo,
}) => {
  const [provinceList] = useState(provinces);

  // Validate fields
  useEffect(() => {
    const isVehicleYearValid = /^\d{4}$/.test(vehicleYear); // ตรวจสอบปีรถ 4 หลัก
    const isEngineSizeValid = /^\d+$/.test(engineSize); // ขนาดเครื่องยนต์ต้องเป็นตัวเลข
    const isPropertyValueValid = /^\d+$/.test(propertyValue); // ขนาดเครื่องยนต์ต้องเป็นตัวเลข
    const validations = {
      isInvalid:
        !vehicleBrand ||
        !vehicleModel ||
        !isEngineSizeValid ||
        !isVehicleYearValid ||
        !isPropertyValueValid ||
        !selectedProvinceRegistered ||
        !vehiclePurpose ||
        (vehicleType === "รถยนต์" && (!gender || !licenseAge)) ||
        (vehicleType === "หอพัก บ้าน" && !propertyType),
    };
    onValidateInsuranceVehicleInfo(validations);
  }, [
    engineSize,
    licenseAge,
    vehicleYear,
    vehicleBrand,
    vehicleModel,
    selectedProvinceRegistered,
    vehiclePurpose,
    gender,
    vehicleType,
    propertyType,
    propertyValue,
    onValidateInsuranceVehicleInfo,
  ]);

  //   const handleProvinceChange = (value: string) => {
  //     const selectedProvinceObj = provinces.find(
  //       (province) => province.provinceCode.toString() === value
  //     );
  //     if (selectedProvinceObj) {
  //       setSelectedProvince(value);
  //     }
  //   };

  return (
    <div className="insurance-vehicle-info">
      {/* <h4>ข้อมูลยานพาหนะ/ทรัพย์สินสำหรับประกันภัย</h4> */}

      {(vehicleType === "รถยนต์" || vehicleType === "รถจักรยานยนต์") && (
        <Row>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="ยี่ห้อรถ"
              id="vehicle-brand"
              value={vehicleBrand}
              placeholder="ระบุยี่ห้อรถ"
              onChange={(e) => setVehicleBrand(e.target.value)}
              isInvalid={isInvalid && !vehicleBrand}
              alertText="กรุณาระบุยี่ห้อรถ"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="รุ่นรถ"
              id="vehicle-model"
              value={vehicleModel}
              placeholder="ระบุรุ่นรถ"
              onChange={(e) => setVehicleModel(e.target.value)}
              isInvalid={isInvalid && !vehicleModel}
              alertText="กรุณาระบุรุ่นรถ"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="ขนาดเครื่องยนต์ (CC)"
              id="engine-size"
              value={engineSize}
              placeholder="ระบุขนาดเครื่องยนต์"
              onChange={(e) => setEngineSize(e.target.value)}
              isInvalid={isInvalid && !/^\d+$/.test(engineSize)}
              alertText="กรุณาระบุขนาดเครื่องยนต์เป็นตัวเลขเท่านั้น"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="ปีรถ (พ.ศ.)"
              id="vehicle-year"
              value={vehicleYear}
              placeholder="2xxx"
              onChange={(e) => setVehicleYear(e.target.value)}
              isInvalid={isInvalid && !/^\d{4}$/.test(vehicleYear)}
              alertText="กรุณาระบุปีรถเป็นตัวเลข 4 หลัก (เช่น 2567)"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextSelect
              value={selectedProvinceRegistered || ""}
              label="จังหวัดที่รถจดทะเบียน"
              id="vehicle-registration-province"
              options={provinceList.map((p) => ({
                value: p.provinceCode.toString(),
                label: p.provinceNameTh,
              }))}
              placeholder="ค้นหา..."
              onChange={(value) => setSelectedProvinceRegistered(value || null)}
              isInvalid={isInvalid && !selectedProvinceRegistered}
              alertText="กรุณาเลือกจังหวัดที่จดทะเบียนรถ"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextSelect
              value={vehiclePurpose}
              label="จุดประสงค์การใช้รถ"
              id="vehicle-purpose"
              options={[
                { label: "ใช้ส่วนบุคคล", value: "ใช้ส่วนบุคคล" },
                {
                  label: "ใช้ส่วนบุคคลและไปทำงาน",
                  value: "ใช้ส่วนบุคคลและไปทำงาน",
                },
                {
                  label: "ใช้ส่วนบุคคลและติดต่อธุรกิจ",
                  value: "ใช้ส่วนบุคคลและติดต่อธุรกิจ",
                },
              ]}
              placeholder="เลือกจุดประสงค์"
              onChange={(value) => {
                if (value !== null) setVehiclePurpose(value);
              }}
              isInvalid={isInvalid && !vehiclePurpose}
              alertText="กรุณาระบุจุดประสงค์การใช้รถ"
            />
          </Col>
        </Row>
      )}

      {vehicleType === "รถยนต์" && (
        <Row>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <RadioButton
              name="dashCam"
              label="คุณมีกล้องติดรถยนต์หรือไม่?"
              options={["มี", "ไม่มี"]}
              selectedValue={hasDashCam}
              onChange={(value) => setHasDashCam(value)}
              isInvalid={isInvalid && !hasDashCam}
              alertText="กรุณาระบุข้อมูล"
            />
          </Col>
          <Col className="mb-3" xs={12}>
            <p>ผู้ขับขี่หลัก</p>
          </Col>
          <Col className="mb-3" md={4} sm={12} xs={12}>
            <TextSelect
              value={selectedProvinceDriver || ""}
              label="จังหวัดที่อยู่ของผู้ขับขี่หลัก"
              id="driver-province"
              options={provinceList.map((p) => ({
                value: p.provinceCode.toString(),
                label: p.provinceNameTh,
              }))}
              placeholder="ค้นหา..."
              onChange={(value) => {
                setSelectedProvinceDriver(value || ""); // จัดการค่า null เป็น ""
              }}
              isInvalid={isInvalid && !selectedProvinceDriver}
              alertText="กรุณาเลือกจังหวัด"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <RadioButton
              name="gender"
              label="เพศ"
              options={["ชาย", "หญิง"]}
              selectedValue={gender}
              onChange={setGender}
              isInvalid={isInvalid && !gender}
              alertText="กรุณาเลือกเพศ"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <RadioButton
              name="maritalStatus"
              label="สถานะสมรส"
              options={["โสด", "สมรส", "หย่าร้าง"]}
              selectedValue={maritalStatus}
              onChange={setMaritalStatus}
              isInvalid={isInvalid && !maritalStatus}
              alertText="กรุณาเลือกสถานะสมรส"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="อาชีพ"
              id="occupation"
              value={occupation}
              placeholder="ระบุอาชีพ เช่น พนักงานบริษัท"
              onChange={(e) => setOccupation(e.target.value)}
              isInvalid={isInvalid && !occupation}
              alertText="กรุณาระบุอาชีพ"
            />
          </Col>
          {(vehicleType === "รถยนต์" || vehicleType === "รถจักรยานยนต์") && (
            <Col className="mb-3" md={4} sm={6} xs={12}>
              <TextSelect
                label="อายุใบขับขี่ (ปี)"
                id="licenseAge"
                options={[
                  { value: "less_1", label: "น้อยกว่า 1 ปี" },
                  { value: "1", label: "1 ปี" },
                  { value: "2", label: "2 ปี" },
                  { value: "3", label: "3 ปี" },
                  { value: "4", label: "4 ปี" },
                  { value: "5", label: "5 ปี" },
                  { value: "more_5", label: "มากกว่า 5 ปี" },
                ]}
                placeholder="เลือก..."
                value={licenseAge}
                onChange={(value) => setLicenseAge(value || "")}
                isInvalid={isInvalid && !licenseAge}
                alertText="กรุณาเลือกอายุใบขับขี่"
              />
            </Col>
          )}
        </Row>
      )}

      {vehicleType === "หอพัก บ้าน" && (
        <Row>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextSelect
              label="ประเภทของทรัพย์สินที่ประกัน"
              id="propertyType"
              options={[
                { value: "บ้านเดี่ยว", label: "บ้านเดี่ยว" },
                { value: "บ้านแฝด", label: "บ้านแฝด" },
                { value: "ทาวน์โฮม", label: "ทาวน์โฮม" },
                { value: "บ้านสวน", label: "บ้านสวน" },
                { value: "บ้านพักตากอากาศ", label: "บ้านพักตากอากาศ" },
                { value: "บ้านชั้นเดียว", label: "บ้านชั้นเดียว" },
                { value: "บ้านสองชั้น", label: "บ้านสองชั้น" },
                { value: "อพาร์ทเมนต์", label: "อพาร์ทเมนต์" },
                { value: "หอพักนักศึกษา", label: "หอพักนักศึกษา" },
                { value: "แมนชั่น", label: "แมนชั่น" },
                { value: "เซอร์วิสอพาร์ทเมนต์", label: "เซอร์วิสอพาร์ทเมนต์" },
                { value: "คอนโดมิเนียม", label: "คอนโดมิเนียม" },
                { value: "แฟลต", label: "แฟลต" },
                { value: "โฮสเทล", label: "โฮสเทล" },
                { value: "โฮมสเตย์", label: "โฮมสเตย์" },
              ]}
              value={propertyType}
              onChange={(value) => setPropertyType(value || "")}
              isInvalid={isInvalid && !propertyType}
              alertText="กรุณาเลือกประเภททรัพย์สิน"
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextSelect
              value={selectedProvinceLocation || ""}
              label="จังหวัดที่ตั้ง"
              id="propertyProvince"
              options={provinceList.map((p) => ({
                value: p.provinceCode.toString(),
                label: p.provinceNameTh,
              }))}
              onChange={(value) => {
                setSelectedProvinceLocation(value || "");
              }}
            />
          </Col>
          <Col className="mb-3" md={4} sm={6} xs={12}>
            <TextInput
              label="มูลค่าของทรัพย์สิน"
              id="propertyValue"
              value={propertyValue}
              placeholder="ระบุมูลค่าของทรัพย์สิน"
              onChange={(e) => setPropertyValue(e.target.value)}
              isInvalid={isInvalid && !/^\d+$/.test(propertyValue)}
              alertText="กรุณระบุมูลค่าทรัพย์สินเป็นตัวเลขเท่านั้น"
            />
          </Col>
        </Row>
      )}

      {["รถยนต์", "รถจักรยานยนต์", "หอพัก บ้าน"].includes(vehicleType) && (
        <Row>
          <Col md={10} xs={12}>
            <RadioButton
              name="voluntaryInsurance"
              label="มีประกันภัยภาคสมัครใจหรือไม่?"
              options={["เคยทำ", "ยังไม่เคยทำ", "ยังมีประกันภัยภาคสมัครใจ"]}
              selectedValue={hasVoluntaryInsurance}
              onChange={setHasVoluntaryInsurance}
              isInvalid={isInvalid && !hasVoluntaryInsurance}
              alertText="กรุณาเลือกข้อมูล"
            />
            <p className="my-3">
              *หากมีโปรดระบุและส่งภาพถ่ายสำเนากรมธรรม์ประกันภัยเดิมเพิ่มเป็นส่วนลด
              %
            </p>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default InsuranceVehicleInfo;