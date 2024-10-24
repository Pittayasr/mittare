//form.tsx
import React, { useState, useEffect } from "react";
import Button from "./button";
import UserInfo from "./formComponent/UserInfo";
import DateSection from "./formComponent/DateSection";
import VehicleInfo from "./formComponent/VehicleInfo";
import OwnerInfo from "./formComponent/OwnerInfo";
import { Form, Row, Col } from "react-bootstrap";
import { Dayjs } from "dayjs";
import { calculateTax } from "../data/calculateTax";
import dayjs from "dayjs";
import Summary from "./summary";

const FormComponent: React.FC = () => {
  const [validated, setValidated] = useState(false);
  const [registrationDate, setRegistrationDate] = useState<Dayjs | null>(null);
  const [expirationDate, setExpirationDate] = useState<Dayjs | null>(null);
  const [latestTaxPaymentDate, setLatestTaxPaymentDate] =
    useState<Dayjs | null>(null);
  const [selectedRadio, setSelectedRadio] = useState<string | null>(null);
  const [ownerData, setOwnerData] = useState<string>("");
  const [usernameData, setUsernameData] = useState<string>("");
  const [engineSize, setEngineSize] = useState<string>("");
  const [contactNumber, setContactNumber] = useState<string>("");
  const [registrationNumber, setRegistrationNumber] = useState<string>("");
  const [selectedCarType, setSelectedCarType] = useState<string | null>(null);
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [totalCost, setTotalCost] = useState<number | null>(null);
  const [finalPrb, setFinalPrb] = useState<number | null>(null);
  const [finalTax, setFinalTax] = useState<number | null>(null);
  const [lateFee, setLateFee] = useState<number | null>(null);
  const [inspectionFee, setInspectionFee] = useState<number | null>(null);
  const [processingFee, setProcessingFee] = useState<number | null>(null);

  const [bikeTypeOrDoorCount, setBikeTypeOrDoorCount] = useState<string | null>(
    null
  );
  const [, setIsFormValid] = useState(false); // สถานะสำหรับตรวจสอบความถูกต้องของฟอร์ม
  const [showResult, setShowResult] = useState(false); // State สำหรับแสดงหน้าสรุป
  // state สำหรับ VehicleInfo
  const [CCorWeightLabel, setCCorWeightLabel] = useState<string>("");
  // state สำหรับ OwnerInfo
  const [ownerLabel, setOwnerLabel] = useState<string>("");
  useEffect(() => {
    // setBikeTypeOrDoorCount(null); // รีเซ็ตเมื่อ selectedCarType เปลี่ยน
    if (registrationDate) {
      const age = calculateCarAge(registrationDate);
      setCarAge(age);
    }

    if (
      selectedCarType === "รถพ่วง" ||
      selectedCarType === "รถบดถนน" ||
      selectedCarType === "รถแทรกเตอร์"
    ) {
      setEngineSize("-"); // ล็อคให้เป็น "0"
    } else {
      setEngineSize(""); // คืนค่าเป็นค่าว่างเมื่อไม่ใช่ประเภทรถดังกล่าว
    }
  }, [registrationDate, selectedCarType]);

  const [carAge, setCarAge] = useState<{
    years: number;
    months: number;
    days: number;
  }>({ years: 0, months: 0, days: 0 });

  const calculateCarAge = (
    registerDate: Dayjs | null
  ): { years: number; months: number; days: number } => {
    if (!registerDate) return { years: 0, months: 0, days: 0 };

    const now = dayjs();
    const yearsDiff = now.diff(registerDate, "year");
    const monthsDiff = now.diff(registerDate.add(yearsDiff, "year"), "month");
    const daysDiff = now.diff(
      registerDate.add(yearsDiff, "year").add(monthsDiff, "month"),
      "day"
    );

    return {
      years: yearsDiff,
      months: monthsDiff,
      days: daysDiff,
    };
  };

  const handleDateChange = (
    date: Dayjs | null,
    type: "registration" | "expiration" | "latestTaxPayment"
  ) => {
    switch (type) {
      case "registration":
        setRegistrationDate(date);

        break;
      case "expiration":
        setExpirationDate(date);
        break;
      case "latestTaxPayment":
        setLatestTaxPaymentDate(date);
        break;
    }
  };

  const handleRadioChange = (value: string) => {
    setSelectedRadio(value);
    setOwnerData("");
    setValidated(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidated(true);

    const calculateCarAge = (registerDate: Dayjs | null): number => {
      return registerDate ? dayjs().year() - registerDate.year() : 0;
    };

    // const monthsLate = (
    //   expirationDate: Dayjs | null,
    //   latestTaxPaymentDate: Dayjs | null
    // ): number => {
    //   if (expirationDate && latestTaxPaymentDate) {
    //     return Math.max(0, expirationDate.diff(latestTaxPaymentDate, "months"));
    //   }
    //   return 0;
    // };
    // console.log("เดือนที่เกินมา = ", monthsLate);

    const isMoreThanThreeYears = (
      lastTaxDate: Dayjs | null,
      expirationDate: Dayjs | null
    ): boolean => {
      if (lastTaxDate && expirationDate) {
        const yearDiff = expirationDate.diff(lastTaxDate, "year");
        return yearDiff > 3;
      }
      return false;
    };

    const isFormValid =
      ownerData &&
      usernameData &&
      engineSize &&
      contactNumber &&
      registrationNumber &&
      registrationDate &&
      expirationDate &&
      latestTaxPaymentDate &&
      selectedRadio &&
      bikeTypeOrDoorCount &&
      selectedCarType;

    if (isFormValid) {
      const carDetails = {
        isCar: selectedCarType === "รถยนต์",
        isTwoDoor: bikeTypeOrDoorCount === "2 ประตู",
        isMotorcycleTrailer:
          selectedCarType === "รถจักรยานยนต์" &&
          bikeTypeOrDoorCount === "รถพ่วง",
        weight: parseFloat(engineSize) || 0,
        cc: parseFloat(engineSize) || 0,
        age: calculateCarAge(registrationDate),
        registrationDate: registrationDate ? registrationDate.toDate() : null,
        expiryDate: expirationDate ? expirationDate.toDate() : null, // ส่ง expirationDate
        lastTaxDate: latestTaxPaymentDate
          ? latestTaxPaymentDate.toDate()
          : null, // ส่ง lastTaxDate
        isInChiangRai: selectedProvince === "เชียงราย",
        isMotorcycle: selectedCarType === "รถจักรยานยนต์",
        isCarTruck: selectedCarType == "รถบรรทุก",
        isElectric: selectedCarType == "รถไฟฟ้า",
        isHybrid: selectedCarType == "รถไฮบริด",
        hasMoreThanSevenSeats: selectedCarType == "รถบรรทุก(เกิน7ที่นั่ง)",
        isRoadroller: selectedCarType == "รถบดถนน",
        isTractor: selectedCarType == "รถแทรกเตอร์",
        isCarTrailer: selectedCarType == "รถพ่วง",
        isMoreThanThreeYears: isMoreThanThreeYears(
          latestTaxPaymentDate,
          expirationDate
        ),
        finalTotal: 0, // Placeholder until the calculation is made
        finalPrb: 0, // Placeholder until the calculation is made
        finalTax: 0, // Placeholder until the calculation is made
        lateFee: 0,
        inspectionFee: 0, // Placeholder until the calculation is made
        processingFee: 0, // Placeholder until the calculation is made
      };

      console.log("Car Details:", carDetails);
      const { finalTotal, finalPrb, finalTax, lateFee, inspectionFee, processingFee } =
        calculateTax(carDetails);

      setTotalCost(finalTotal);
      setFinalPrb(finalPrb);
      setFinalTax(finalTax);
      setLateFee(lateFee);
      setInspectionFee(inspectionFee);
      setProcessingFee(processingFee);

      carDetails.finalTotal = finalTotal;
      carDetails.finalPrb = finalPrb;
      carDetails.finalTax = finalTax;
      carDetails.lateFee = lateFee;
      carDetails.inspectionFee = inspectionFee;
      carDetails.processingFee = processingFee;
      

      setShowResult(true); // เปลี่ยนเป็น true เพื่อแสดงหน้าสรุป
    }
  };

  const handleBack = () => {
    setShowResult(false); // ย้อนกลับไปยังหน้าฟอร์ม
    setValidated(false);
  };

  const handleConfirm = () => {
    // ส่งข้อมูลไปยังเซิร์ฟเวอร์หรือดำเนินการที่คุณต้องการ
    console.log("ข้อมูลที่ถูกส่ง:", {
      ownerData,
      usernameData,
      engineSize,
      contactNumber,
      registrationNumber,
      registrationDate,
      expirationDate,
      latestTaxPaymentDate,
      selectedRadio,
      bikeTypeOrDoorCount,
      selectedCarType,
      totalCost,
    });
    // ถ้าต้องการให้ผู้ใช้ได้รับข้อมูลหรือเปลี่ยนหน้าหลังจากส่งข้อมูล
  };

  return (
    <div className="container mx-auto">
      {showResult ? (
        <Summary
          carOrMotorcycleLabel={ownerLabel}
          CCorWeight={CCorWeightLabel}
          ownerData={ownerData}
          usernameData={usernameData}
          engineSize={engineSize}
          contactNumber={contactNumber}
          registrationNumber={registrationNumber}
          registrationDate={registrationDate ? registrationDate.toDate() : null}
          expirationDate={expirationDate ? expirationDate.toDate() : null}
          latestTaxPaymentDate={
            latestTaxPaymentDate ? latestTaxPaymentDate.toDate() : null
          }
          selectedRadio={selectedRadio}
          bikeTypeOrDoorCount={bikeTypeOrDoorCount}
          selectedCarType={selectedCarType}
          totalCost={totalCost}
          prbCost={finalPrb} // ส่งค่าพรบ.สุทธิ
          taxCost={finalTax} // ส่งค่าภาษีสุทธิ
          lateFee={lateFee}
          inspectionCost={inspectionFee} // ส่งค่าตรวจสภาพ
          processingCost={processingFee} // ส่งค่าดำเนินการ
          onBack={handleBack} // ส่งฟังก์ชันย้อนกลับ
          onConfirm={handleConfirm} // ส่งฟังก์ชันตกลง
          carAge={carAge}
        />
      ) : (
        <Form
          className="form"
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
        >
          {/* UserInfo */}
          <UserInfo
            usernameData={usernameData}
            setUsernameData={setUsernameData}
            selectedProvince={selectedProvince}
            setSelectedProvince={setSelectedProvince}
            selectedCarType={selectedCarType}
            setSelectedCarType={setSelectedCarType}
            setIsFormValid={setIsFormValid} // ส่ง prop นี้ไปที่ VehicleInfo
          />

          {/* DateSection with callback for different dates */}
          <DateSection
            handleDateChange={handleDateChange} // Callback to handle date changes
            registrationDate={registrationDate} // ส่งค่า registrationDate
            expirationDate={expirationDate} // ส่งค่า expirationDate
            latestTaxPaymentDate={latestTaxPaymentDate} // ส่งค่า latestTaxPaymentDate
          />

          {/* Integrate OwnerInfo */}
          <OwnerInfo
            selectedRadio={selectedRadio}
            setSelectedRadio={handleRadioChange}
            ownerData={ownerData}
            setOwnerData={setOwnerData}
            selectedCarType={selectedCarType}
            setBikeTypeOrDoorCount={setBikeTypeOrDoorCount}
            bikeTypeOrDoorCount={bikeTypeOrDoorCount}
            setIsFormValid={setIsFormValid}
            carOrMotorcycleLabel={ownerLabel} // ส่ง ownerLabel
            setCarOrMotorcycleLabel={setOwnerLabel} // ใช้ setOwnerLabel สำหรับ OwnerInfo
          />

          {/* Integrate VehicleInfo */}
          <VehicleInfo
            registrationNumber={registrationNumber}
            setRegistrationNumber={setRegistrationNumber}
            contactNumber={contactNumber}
            setContactNumber={setContactNumber}
            engineSize={engineSize}
            setEngineSize={setEngineSize}
            selectedCarType={selectedCarType}
            setIsFormValid={setIsFormValid} // ส่ง prop นี้ไปที่ VehicleInfo
            CCorWeight={CCorWeightLabel} // ส่ง vehicleLabel
            setCCorWeight={setCCorWeightLabel}
          />

          <hr className="my-4" />
          <Row className="mb-2 justify-content-center">
            <Col xs="auto" style={{ width: "500px" }}>
              <Button
                label="ต่อไป"
                className="w-100"
                type="submit"
                variant="primary"
                disabled={
                  !(
                    (
                      ownerData &&
                      usernameData &&
                      engineSize &&
                      contactNumber &&
                      registrationNumber &&
                      registrationDate &&
                      expirationDate &&
                      latestTaxPaymentDate &&
                      selectedRadio &&
                      bikeTypeOrDoorCount &&
                      selectedCarType
                    )
                    // (vehicleLabel ? engineSize : true)
                  )
                }
              />
            </Col>
          </Row>
        </Form>
      )}
    </div>
  );
};

export default FormComponent;
