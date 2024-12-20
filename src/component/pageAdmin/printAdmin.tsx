import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseConfig"; // ตั้งค่า Firestore ที่ config ไว้
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { Col, Row, Form, Button, Modal } from "react-bootstrap";
import useAuth from "../useAuth";
import TextInput from "../textFillComponent/textInput";
import ScrollToTopAndBottomButton from "../ScrollToTopAndBottomButton";
import PaginationControls from "./pageAdminComponent/paginationControls";
import SidebarAdmin from "./pageAdminComponent/sidebarAdmin";
import { IoMdMore } from "react-icons/io";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import isBetween from "dayjs/plugin/isBetween";

dayjs.locale("th");

dayjs.extend(isBetween);

// PrintAdmin.tsx
interface UploadData {
  fileName: string;
  fileType: string;
  numPages: number;
  numCopies: number;
  colorType: string;
  colorPercentage: number;
  totalCost: number;
  uploadTime: string;
  printFilePath: string;
  docId: string;
  storedFileName: string;
  printSlipQRcodeFilePath: string;
}

//printAdmin.tsx
const PrintAdmin: React.FC = () => {
  const [uploads, setUploads] = useState<UploadData[]>([]);
  const [filteredUploads, setFilteredUploads] = useState<UploadData[]>([]);
  const [filterType, setFilterType] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUpload, setSelectedUpload] = useState<UploadData | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [isMultiSelectMode, setIsMultiSelectMode] = useState<boolean>(false);
  const [isAllSelected, setIsAllSelected] = useState<boolean>(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  const [sortField, setSortField] = useState<string>("uploadTime");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const { logout } = useAuth();

  useEffect(() => {
    const fetchUploads = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "uploads"));
        const uploadData = querySnapshot.docs.map((doc) => ({
          ...doc.data(),
          docId: doc.id,
        })) as UploadData[];
        setUploads(uploadData);
        setFilteredUploads(uploadData);
      } catch (error) {
        console.error("Error fetching uploads:", error);
      }
    };

    fetchUploads();
  }, []);

  // const handleViewFile = (filePath: string) => {
  //   if (!filePath) {
  //     alert("ไม่พบไฟล์ที่ต้องการดู");
  //     console.log("ลองเปิด:", filePath);
  //     return;
  //   }

  //   console.log("Opening file at:", filePath);
  //   window.open(filePath, "_blank");
  // };

  const handleDownload = async (filePath: string | null, fileName: string) => {
    if (!filePath) {
      alert("ไม่พบภาพสำหรับดาวน์โหลด");
      return;
    }

    try {
      // ตรวจสอบว่าภาพนั้นเป็น URL จากเซิร์ฟเวอร์ หรือเป็น Blob URL
      const response = await fetch(filePath);
      if (!response.ok) {
        throw new Error("ไม่สามารถดาวน์โหลดภาพได้");
      }

      // สร้าง Blob จาก response
      const blob = await response.blob();

      // สร้างลิงก์ดาวน์โหลด
      const link = document.createElement("a");
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = fileName || "downloaded_image";
      document.body.appendChild(link);

      // เรียกดาวน์โหลด
      link.click();

      // ลบลิงก์และ URL หลังการใช้งาน
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading image:", error);
      alert("เกิดข้อผิดพลาดในการดาวน์โหลดไฟล์ กรุณาลองใหม่อีกครั้ง");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);

    const filtered = uploads.filter((upload) =>
      upload.fileName.toLowerCase().includes(term.toLowerCase())
    );

    setFilteredUploads(filtered);
  };

  const handleFilter = (type: string) => {
    // const types = type.split(",");
    // console.log("Filtered types:", types);
    setFilterType(type);
    setCurrentPage(1); // รีเซ็ตหน้าปัจจุบัน
    if (type) {
      // กรองตาม vehicleType
      const filtered = uploads.filter((upload) => upload.fileType === type);
      setFilteredUploads(filtered);
    } else {
      // ถ้าไม่เลือกค่าใดๆ ให้แสดงข้อมูลทั้งหมด
      setFilteredUploads(uploads);
    }
  };

  const handleSort = (field: string) => {
    const newOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);

    filterAndSortUploads(searchTerm, filterType, field, newOrder);
  };

  const filterAndSortUploads = (
    search: string,
    type: string,
    field: string,
    order: string
  ) => {
    let data = [...uploads];

    if (search) {
      data = data.filter((v) =>
        v.fileName.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (type) {
      data = data.filter((v) => v.fileType === type);
    }

    data.sort((a, b) => {
      let valueA: string | number | Dayjs | undefined;
      let valueB: string | number | Dayjs | undefined;

      if (field === "uploadTime") {
        valueA = a.uploadTime ? dayjs(a.uploadTime) : dayjs(0);
        valueB = b.uploadTime ? dayjs(b.uploadTime) : dayjs(0);
      } else {
        valueA = a[field as keyof UploadData] as string | number | undefined;
        valueB = b[field as keyof UploadData] as string | number | undefined;
      }

      if (valueA === undefined || valueB === undefined) return 0;

      if (dayjs.isDayjs(valueA) && dayjs.isDayjs(valueB)) {
        return order === "asc"
          ? valueA.valueOf() - valueB.valueOf()
          : valueB.valueOf() - valueA.valueOf();
      }

      if (typeof valueA === "string" && typeof valueB === "string") {
        return order === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      }

      if (typeof valueA === "number" && typeof valueB === "number") {
        return order === "asc" ? valueA - valueB : valueB - valueA;
      }

      return 0;
    });

    setFilteredUploads(data);
  };

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((selectedId) => selectedId !== id)
        : [...prev, id]
    );
  };

  const handleMultiSelectToggle = () => {
    setIsMultiSelectMode((prev) => !prev);
    setSelectedIds([]);
  };

  const handleDeleteSelected = async () => {
    if (
      window.confirm(
        `คุณต้องการลบรายการที่เลือกทั้งหมด (${selectedIds.length} รายการ) หรือไม่?`
      )
    ) {
      try {
        for (const id of selectedIds) {
          const upload = uploads.find((u) => u.docId === id);
          if (upload) {
            await deleteDoc(doc(db, "uploads", id));
            await fetch("https://api.mittaemaefahlung88.com/delete-file", {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                fileName: upload.printFilePath.replace(/.*\/uploads\//, ""),
              }),
            });
          }
        }
        setUploads(uploads.filter((u) => !selectedIds.includes(u.docId)));
        setSelectedIds([]);
        alert("ลบรายการที่เลือกทั้งหมดสำเร็จ!");
      } catch (error) {
        console.error("Error deleting selected uploads:", error);
        alert("เกิดข้อผิดพลาดในการลบรายการที่เลือก กรุณาลองใหม่อีกครั้ง");
      }
    }
  };

  // ฟังก์ชันลบข้อมูล
  const handleDelete = async (
    fileName: string,
    filePath: string,
    docId: string
  ) => {
    try {
      if (window.confirm(`คุณต้องการลบข้อมูลและไฟล์ของ ${fileName} หรือไม่?`)) {
        // ลบเอกสารจาก Firestore
        const docRef = doc(db, "uploads", docId);
        await deleteDoc(docRef);

        // ส่งคำขอลบไฟล์ไปที่เซิร์ฟเวอร์
        const response = await fetch(
          "https://api.mittaemaefahlung88.com/delete-file",
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              fileName: filePath.replace(/.*\/uploads\//, ""), // เอาเฉพาะ path ภายในโฟลเดอร์ uploads
            }),
          }
        );

        if (response.ok) {
          // ลบข้อมูลออกจาก state
          setUploads(
            uploads.filter((upload) => upload.printFilePath !== filePath)
          );
          alert("ลบไฟล์สำเร็จ");
          console.log(`File deleted successfully: ${filePath}`);
        } else {
          const error = await response.json();
          console.error("Error deleting file on server:", error);
          throw new Error("Failed to delete file on server");
        }
      }
    } catch (error) {
      console.error("Error deleting file:", error);
      alert("ไม่สามารถลบไฟล์ได้ กรุณาลองอีกครั้ง");
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      setSelectedIds([]); // ยกเลิกการเลือกทั้งหมด
    } else {
      setSelectedIds(uploads.map((upload) => upload.docId)); // เลือกทั้งหมด
    }
    setIsAllSelected(!isAllSelected);
  };

  const handleViewDetails = (upload: UploadData) => {
    setSelectedUpload(upload);
    setShowModal(true);
  };

  const paginatedUploads = filteredUploads.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => setCurrentPage(page);

  const handleDateRangeFilter = () => {
    if (startDate && endDate) {
      const filtered = uploads.filter((upload) => {
        const uploadDate = dayjs(upload.uploadTime);
        return uploadDate.isBetween(startDate, endDate, "day", "[]");
      });
      setFilteredUploads(filtered);
    } else {
      setFilteredUploads(uploads);
    }
  };

  return (
    <div className="form-container page-container mx-auto mt-1">
      <h1 className="text-success text-center">
        แดชบอร์ดแอดมินสำหรับปริ้นเอกสาร
      </h1>
      <Form>
        <Row>
          <Col
            xs={10}
            sm={11}
            md={11}
            lg={11}
            xl={11}
            className="mb-3"
            style={{ padding: "0px 0px 0px 12px" }}
          >
            <TextInput
              label="ค้นหา"
              id="searchInput"
              placeholder="ค้นหาชื่อไฟล์..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
            />
          </Col>
          {/* <Col  md={3}>
            <TextSelect
              label="ประเภทไฟล์"
              id="filterSelect"
              options={[
                { value: "", label: "แสดงทั้งหมด" },
                { value: "image", label: "ไฟล์รูปภาพ" },
                { value: "pdf", label: "ไฟล์ PDF" },
              ]}
              value={filterType}
              onChange={(value) => handleFilter(value || "")}
            />
          </Col> */}
          <Col
            xs={2}
            sm={1}
            md={1}
            lg={1}
            xl={1}
            className="d-flex justify-content-center align-items-end px-0"
          >
            {/* ปุ่มเปิด Sidebar */}
            <IoMdMore
              className="menuIcon"
              style={{
                cursor: "pointer",
                padding: "5px",
                margin: "10px 5px 15px 0px",
                borderBlockColor: "black",
                borderRadius: "10px",
              }}
              size={40}
              onClick={toggleSidebar}
            />

            {/* Sidebar */}
            <SidebarAdmin
              isOpen={isSidebarOpen}
              onClose={toggleSidebar}
              onFilter={handleFilter}
              onSort={handleSort}
              sortField={sortField}
              sortOrder={sortOrder}
              onMultiSelect={handleMultiSelectToggle}
              onSelectAll={handleSelectAll}
              isMultiSelectMode={isMultiSelectMode}
              isAllSelected={isAllSelected}
              onLogout={() => {
                if (window.confirm("คุณต้องการออกจากระบบหรือไม่?")) {
                  logout();
                }
              }}
              filterType={filterType}
              filterOptions={[
                { value: "", label: "แสดงทั้งหมด" },
                { label: "PDF", value: "application/pdf" },
                { label: "PNG", value: "image/png" },
                { label: "JPEG", value: "image/jpeg" },
                // {
                //   label: "รูปภาพ",
                //   value: ["image/jpeg", "image/png"].join(","),
                // },
              ]}
              filterLabel="แสดงประเภทไฟล์"
              onStartDateChange={setStartDate}
              onEndDateChange={setEndDate}
              startDate={startDate}
              endDate={endDate}
              onDateRangeFilter={handleDateRangeFilter}
            />
          </Col>
        </Row>
        <Row className="responsive-container mb-3">
          {paginatedUploads.map((upload, index) => (
            <Col
              xs={12}
              sm={12}
              md={6}
              lg={4}
              xl={4}
              key={index}
              className={`mb-3 ${isMultiSelectMode ? "selectable-card" : ""}`}
              onClick={
                isMultiSelectMode
                  ? () => toggleSelect(upload.docId)
                  : () => handleViewDetails(upload)
              }
            >
              <div className="card">
                <div
                  className="card-body"
                  style={{
                    cursor: "pointer",
                    border:
                      selectedIds.includes(upload.docId) && isMultiSelectMode
                        ? "2px solid #28a745"
                        : "none",
                    borderRadius: "5px",
                  }}
                >
                  <div
                    className="d-flex align-items-center justify-content-between"
                    style={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    <h4
                      className="card-title text-success mb-0"
                      style={{
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                      }}
                    >
                      {upload.fileName}
                    </h4>
                    {isMultiSelectMode && (
                      <Form.Check
                        className="custom-checkbox"
                        type="checkbox"
                        checked={selectedIds.includes(upload.docId)}
                        onClick={(e) => e.stopPropagation()}
                        onChange={() => toggleSelect(upload.docId)}
                      />
                    )}
                  </div>
                  <p className="card-text mt-4">
                    ประเภทไฟล์: {upload.fileType}
                  </p>
                  <p className="card-text">
                    จำนวนหน้าเอกสาร: {upload.numPages}
                  </p>
                  <p className="card-text">
                    จำนวนชุดที่ต้องการปริ้น: {upload.numCopies}
                  </p>
                  <p className="card-text">
                    ประเภทการปริ้น: {upload.colorType}
                  </p>
                  {/* <p className="card-text">
                    เปอร์เซ็นต์สีเฉลี่ย: {upload.colorPercentage.toFixed(2)}%
                  </p> */}
                  <p className="card-text">
                    ราคาทั้งหมด: {upload.totalCost} บาท
                  </p>
                  <p className="card-text">
                    เวลาที่อัปโหลด:{" "}
                    {dayjs(upload.uploadTime).format(
                      "D MMMM YYYY เวลา HH:mm น."
                    )}
                  </p>
                  <div className="d-flex justify-content-end">
                    <div>
                      {/* <Button
                        className="ms-2"
                        variant="success"
                        onClick={() => handleDownload(upload.storedFileName)} // ใช้ storedFileName
                      >
                        ดาวน์โหลด
                      </Button> */}
                    </div>
                    <Button
                      className="mx-2"
                      variant="outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(
                          upload.fileName,
                          upload.printFilePath,
                          upload.docId
                        );
                      }}
                    >
                      ลบ
                    </Button>
                    <Button
                      variant="success"
                      onClick={() => handleViewDetails(upload)}
                    >
                      ดูรายละเอียด
                    </Button>
                  </div>
                </div>
              </div>
            </Col>
          ))}
        </Row>
        <Row>
          <Col>
            {selectedIds.length > 0 && (
              <Button
                className=" mx-2 mb-3"
                variant="danger"
                onClick={handleDeleteSelected}
              >
                ลบ ({selectedIds.length}) รายการ
              </Button>
            )}

            {isMultiSelectMode && (
              <Button
                className=" mx-2 mb-3"
                variant="outline-success"
                onClick={handleSelectAll}
              >
                {isAllSelected ? "ยกเลิกการเลือกทั้งหมด" : "เลือกทั้งหมด"}
              </Button>
            )}
          </Col>
        </Row>
        <PaginationControls
          totalItems={uploads.length}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </Form>

      {selectedUpload && (
        <Modal
          show={showModal}
          onHide={() => setShowModal(false)}
          size="lg"
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>รายละเอียดเอกสาร</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>ชื่อไฟล์: {selectedUpload.fileName}</p>
            <p>ประเภทไฟล์: {selectedUpload.fileType}</p>
            <p>จำนวนหน้า: {selectedUpload.numPages}</p>
            <p>จำนวนชุด: {selectedUpload.numCopies}</p>
            <p>ประเภทการปริ้น: {selectedUpload.colorType}</p>
            <p>ราคาทั้งหมด: {selectedUpload.totalCost} บาท</p>
            <p>
              เวลาที่อัปโหลด:{" "}
              {dayjs(selectedUpload.uploadTime).format("D MMMM YYYY HH:mm")}
            </p>
          </Modal.Body>
          <Modal.Footer className=" text-center align-items-end">
            {/* Preview ไฟล์ PDF หรือรูปภาพ */}
            <div className="image-container-print text-center">
              {selectedUpload.fileType === "application/pdf" ? (
                <div
                  className="pdf-thumbnail"
                  onClick={() =>
                    window.open(selectedUpload.printFilePath, "_blank")
                  }
                >
                  <p>PDF ตัวอย่าง</p>
                </div>
              ) : selectedUpload.fileType.startsWith("image/") ? (
                <img
                  src={selectedUpload.printFilePath}
                  alt={selectedUpload.fileName}
                  className="img-thumbnail"
                  onClick={() => setModalImage(selectedUpload.printFilePath)}
                />
              ) : (
                <p className="text-muted">ไม่สามารถแสดงตัวอย่างไฟล์ได้</p>
              )}
            {/* ปุ่มสำหรับดาวน์โหลด */}
            <Button
            className="my-2"
              variant="outline-success"
              onClick={() =>
                handleDownload(
                  selectedUpload.printFilePath,
                  selectedUpload.fileName
                )
              }
            >
              ดาวน์โหลดไฟล์
            </Button>
            </div>

          </Modal.Footer>
          {/* Modal สำหรับดูภาพขยาย */}
          <Modal
            show={!!modalImage}
            onHide={() => setModalImage(null)}
            size="lg"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title>ดูภาพขยาย</Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center">
              {modalImage ? (
                <img
                  src={modalImage}
                  alt="ภาพขยาย"
                  style={{ maxWidth: "100%", maxHeight: "80vh" }}
                />
              ) : (
                <p className="text-muted">ไม่พบภาพ</p>
              )}
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="outline-success"
                className="responsive-label"
                onClick={() => {
                  if (modalImage) {
                    handleDownload(modalImage, selectedUpload.fileName);
                  } else {
                    alert("ไม่พบภาพสำหรับดาวน์โหลด");
                  }
                }}
              >
                ดาวน์โหลดไฟล์
              </Button>
            </Modal.Footer>
          </Modal>
        </Modal>
      )}

      <ScrollToTopAndBottomButton />
    </div>
  );
};

export default PrintAdmin;