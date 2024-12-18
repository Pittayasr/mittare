// DateSection.tsx
import React from "react";
import { Col, Row } from "react-bootstrap";
import DateInput from "../textFillComponent/dateInput";
import ImageModal from "../textFillComponent/Imagemodal";
import { Dayjs } from "dayjs";

interface DateSectionProps {
  isInvalid: boolean;  
  handleDateChange: (
    date: Dayjs | null,
    type: "registration" | "expiration" | "latestTaxPayment"
  ) => void;
  registrationDate: Dayjs | null;
  expirationDate: Dayjs | null;
  latestTaxPaymentDate: Dayjs | null;
  setIsFormValid: (isValid: boolean) => void;
}

const DateSection: React.FC<DateSectionProps> = ({
  isInvalid,
  handleDateChange,
  registrationDate,
  expirationDate,
  latestTaxPaymentDate,
  
}) => {
  // const yearDiffExpirationToLastTax =
  //   expirationDate && latestTaxPaymentDate
  //     ? latestTaxPaymentDate.diff(expirationDate, "month")
  //     : 0;
  // const isMoreThanThreeYears = yearDiffExpirationToLastTax > 36;
  
 

  return (
    <Row>
      {/* วันที่จดทะเบียน */}
      <Col className="date-idNo-carType-Input mb-4" md={4} xs={6}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span>วันที่จดทะเบียน</span>
          <ImageModal
            imageUrl="/src/data/registerDate.png"
            buttonText="ดูรูปตัวอย่าง"
          />
        </div>
        <DateInput
          onDateChange={(date) => handleDateChange(date, "registration")}
          labelText=""
          value={registrationDate} // Directly use registrationDate as Dayjs
          isInvalid={isInvalid}
          alertText="กรุณาเลือกวันที่จดทะเบียน"
        />
        {/* <span>อายุรถ: {carAge.years} ปี {carAge.months} เดือน {carAge.days} วัน</span> */}
      </Col>

      {/* วันสิ้นอายุ */}
      <Col className="date-idNo-carType-Input mb-4" md={4} xs={6}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span>วันสิ้นอายุ</span>
          <ImageModal
            imageUrl="/src/data/endDate.png"
            buttonText="ดูรูปตัวอย่าง"
          />
        </div>
        <DateInput
          onDateChange={(date) => handleDateChange(date, "expiration")}
          labelText=""
          value={expirationDate} // Directly use expirationDate as Dayjs
          isInvalid={isInvalid}
          alertText="กรุณาเลือกวันสิ้นอายุ"
        />
      </Col>

      {/* วันต่อภาษีล่าสุด */}
      <Col className="date-idNo-carType-Input mb-4" md={4} xs={12}>
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span>วันต่อภาษีล่าสุด</span>
        </div>
        <DateInput
          onDateChange={(date) => handleDateChange(date, "latestTaxPayment")}
          labelText=""
          value={latestTaxPaymentDate} // Directly use latestTaxPaymentDate as Dayjs
          isInvalid={isInvalid}
          alertText="กรุณาเลือกวันต่อภาษีล่าสุด"
        />
      </Col>
      {/* <Col className="mb-4" md={12} xs={12}>
        <span>
          ระยะห่างจากวันสิ้นอายุถึงวันต่อภาษีล่าสุด:{" "}
          {yearDiffExpirationToLastTax} เดือน
        </span>
        <span>{isMoreThanThreeYears ? " => เกิน 3 ปี" : "ไม่เกิน 3 ปี"}</span>
      </Col> */}
    </Row>
  );
};

export default DateSection;
