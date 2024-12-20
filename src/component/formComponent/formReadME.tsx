import { Button } from "react-bootstrap";

interface ReadMeProps {
  onAgree: () => void;
}

const ReadMe: React.FC<ReadMeProps> = ({ onAgree }) => {
  return (
    <div className="container mx-auto px-0">
      <h2 className="text-center font-weight-bold mb-4">
        โปรดอ่านก่อนดำเนินการ
      </h2>
      <h5 className="text-center font-weight-bold mb-3">
        🙏 ขอบคุณที่ใช้บริการของเรา
      </h5>
      <h5 className="text-center font-weight-bold mb-3">
        เอกสารที่ต้องส่งให้แอดมินตรวจสอบ
      </h5>
      <ul
        className="list-unstyled mb-4 mt-3"
        style={{ fontSize: "1rem", lineHeight: "1.8" }}
      >
        <p className="mb-2">
          📌 1. ภาพถ่ายหน้าเล่มทะเบียนรถ (ชัดเจน ไม่เบลอ ไม่มืด ไม่เอียง)
        </p>
        <p className="mb-2">📌 2. หมายเลขโทรศัพท์ที่สามารถติดต่อได้</p>
        <p className="mb-2">📌 3. ภาพถ่ายป้ายทะเบียนรถ</p>
      </ul>

      <hr />

      <h5 className="text-center font-weight-bold mb-3">ขั้นตอนการทำงาน</h5>
      <ul
        className="list-unstyled mb-4 mt-3"
        style={{ fontSize: "1rem", lineHeight: "1.8" }}
      >
        <p className="mb-2">📌 1. ลูกค้าส่งเอกสารมาให้ตรวจสอบ</p>
        <p className="mb-2">
          📌 2. หลังจากตรวจสอบ แอดมินจะแจ้งราคากลับไปให้ลูกค้าชำระเงิน
        </p>
        <p className="mb-2">
          📌 3. หลังการชำระเงินและส่งสลิปยืนยัน แอดมินจะออก พรบ.
          ให้และนัดรับรถเพื่อตรวจสภาพและชำระภาษี
          งานทั้งหมดจะเสร็จสิ้นภายในไม่เกิน 1 ชั่วโมง
        </p>
      </ul>

      <h5 className="text-center text-danger font-weight-bol my-4">
        🚩 กรุณาตรวจสอบเอกสารให้ครบถ้วน
      </h5>

      <footer className="d-flex justify-content-center">
        <Button onClick={onAgree} className="w-50 p-2" variant="success">
          ถัดไป
        </Button>
      </footer>
    </div>
  );
};

export default ReadMe;