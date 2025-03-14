import React, { useEffect, useState, useContext, useRef } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { DataContext } from "../../Context/DataContext";
import Datepicker from "react-tailwindcss-datepicker";
import axios from "axios";
import LoadingAnimation from "../../Components/Loading/LoadingAnimation";
import { getAllFeedbacksAPI } from "../../Constants/apiRoutes";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Document, Page } from "react-pdf";
import { pdfjs } from "react-pdf";
import "../../styles/editor.css";
import pdf from "../../assests/pdfs/basic-text.pdf";
import {
  HiUpload,
  HiDocumentText,
  HiCheck,
  HiX,
  HiArrowLeft,
  HiOutlineRefresh,
  HiPrinter,
  HiZoomIn,
  HiZoomOut,
  HiLink,
  HiOutlinePhotograph,
} from "react-icons/hi";
import {
  FaBold,
  FaItalic,
  FaUnderline,
  FaListUl,
  FaAlignLeft,
  FaAlignCenter,
  FaAlignRight,
} from "react-icons/fa";

// Set up PDF.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

const DocumentsDetails = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [approvalStatus, setApprovalStatus] = useState({});
  const [comments, setComments] = useState({});
  const [editorContent, setEditorContent] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1.0);
  const [signature, setSignature] = useState("");

  const { storesData } = useContext(DataContext);
  const [stores, setStores] = useState([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [value, setValue] = useState({
    startDate: "",
    endDate: "",
  });

  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      Image,
    ],
    content: editorContent,
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  const getStoreIDs = (stores) => {
    return stores.map((store) => store.StoreID);
  };

  useEffect(() => {
    if (storesData) {
      setStores(storesData);
      // Automatically set selectedStore if there's only one store
      if (storesData.length === 1) {
        setSelectedStore(storesData[0]);
      }
    }
  }, [storesData]);

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const newDoc = {
          id: Date.now(),
          name: file.name,
          content: e.target.result,
          status: "Pending",
          createdBy: "Gaddam Vinay",
          createdAt: new Date(),
          approvals: storesData.map((store) => ({
            departmentId: store.StoreID,
            departmentName: store.StoreName,
            status: "Pending",
            comment: "",
            signature: null,
          })),
        };
        setDocuments([...documents, newDoc]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApproval = (docId, deptId, status) => {
    setDocuments((docs) =>
      docs.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            approvals: doc.approvals.map((approval) => {
              if (approval.departmentId === deptId) {
                return { ...approval, status };
              }
              return approval;
            }),
          };
        }
        return doc;
      })
    );
  };

  const handleComment = (docId, deptId, comment) => {
    setDocuments((docs) =>
      docs.map((doc) => {
        if (doc.id === docId) {
          return {
            ...doc,
            approvals: doc.approvals.map((approval) => {
              if (approval.departmentId === deptId) {
                return { ...approval, comment };
              }
              return approval;
            }),
          };
        }
        return doc;
      })
    );
  };

  // Mock document data
  const documentData = {
    title: "Something.pdf",
    creator: "Gaddam Vinay",
    content: editorContent,
    checklistItems: [
      {
        id: 1,
        text: "Research about the WYSIWYG editor's best practices",
        checked: true,
      },
      {
        id: 2,
        text: "Organize training sessions for working with rich text editor",
        checked: false,
      },
      {
        id: 3,
        text: "Strategize the rich text editor component structure",
        checked: false,
      },
    ],
    bulletPoints: [
      "Responsive design",
      "Rich-text formatting",
      "Real-time editing",
      "WYSIWYG interface",
      "Font styles and sizes",
      "Text color and highlighting",
      "Text alignment",
      "Bullet and numbered lists",
    ],
  };

  // Mock departments data
  const departments = [
    {
      id: 1,
      name: "Department-1",
      status: "Approved",
      user: "Paul Lopez",
      comment:
        "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      id: 2,
      name: "Department-2",
      status: "Pending",
      user: "Sara Young",
      comment:
        "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
    {
      id: 3,
      name: "Department-3",
      status: "Rejected",
      user: "John Smith",
      comment:
        "Lorem ipsum is simply dummy text of the printing and typesetting industry. Lorem ipsum has been the industry's standard dummy text ever since the 1500s.",
    },
  ];

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  function onDocumentLoadError(error) {
    console.error("Error loading PDF:", error);
  }

  const handleZoomIn = () => {
    setScale(scale + 0.1);
    setZoomLevel(Math.min(200, zoomLevel + 25));
  };

  const handleZoomOut = () => {
    setScale(Math.max(0.5, scale - 0.1));
    setZoomLevel(Math.max(25, zoomLevel - 25));
  };

  const handlePrevPage = () => {
    setPageNumber(pageNumber - 1 <= 1 ? 1 : pageNumber - 1);
  };

  const handleNextPage = () => {
    setPageNumber(pageNumber + 1 >= numPages ? numPages : pageNumber + 1);
  };

  return (
    <div className="flex h-screen bg-white mt-10 overflow-x-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <div className="border-b p-4 flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center space-x-4 flex-wrap">
            <button className="p-2 hover:bg-gray-100 rounded">
              <HiArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="text-lg font-medium truncate max-w-[200px]">
              {documentData.title}
            </h1>
            <span className="text-gray-500 text-sm whitespace-nowrap">
              by {documentData.creator} (Creator)
            </span>
          </div>
          <div className="flex space-x-2">
            <button className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600">
              Reject
            </button>
            <button className="px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700">
              Accept
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="border-b p-2 flex items-center space-x-4 overflow-x-auto">
          <div className="flex items-center space-x-2">
            <button className="p-1 hover:bg-gray-100 rounded">
              <HiOutlineRefresh className="w-4 h-4" />
            </button>
            <button className="p-1 hover:bg-gray-100 rounded">
              <HiPrinter className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2 border-l pl-2">
            <button onClick={handleZoomOut}>
              <HiZoomOut className="w-4 h-4" />
            </button>
            <span className="text-sm">{Math.round(scale * 100)}%</span>
            <button onClick={handleZoomIn}>
              <HiZoomIn className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center space-x-2 border-l pl-2">
            <button
              onClick={() => editor?.chain().focus().toggleBold().run()}
              className={`p-1 hover:bg-gray-100 rounded ${
                editor?.isActive("bold") ? "bg-gray-100" : ""
              }`}
            >
              <FaBold />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleItalic().run()}
              className={`p-1 hover:bg-gray-100 rounded ${
                editor?.isActive("italic") ? "bg-gray-100" : ""
              }`}
            >
              <FaItalic />
            </button>
            <button
              onClick={() => editor?.chain().focus().toggleUnderline().run()}
              className={`p-1 hover:bg-gray-100 rounded ${
                editor?.isActive("underline") ? "bg-gray-100" : ""
              }`}
            >
              <FaUnderline />
            </button>
          </div>
          <div className="flex items-center space-x-2 border-l pl-2">
            <button
              onClick={() => editor?.chain().focus().toggleBulletList().run()}
              className={`p-1 hover:bg-gray-100 rounded ${
                editor?.isActive("bulletList") ? "bg-gray-100" : ""
              }`}
            >
              <FaListUl />
            </button>
            <button
              onClick={() => editor?.chain().focus().setTextAlign("left").run()}
              className={`p-1 hover:bg-gray-100 rounded ${
                editor?.isActive({ textAlign: "left" }) ? "bg-gray-100" : ""
              }`}
            >
              <FaAlignLeft />
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().setTextAlign("center").run()
              }
              className={`p-1 hover:bg-gray-100 rounded ${
                editor?.isActive({ textAlign: "center" }) ? "bg-gray-100" : ""
              }`}
            >
              <FaAlignCenter />
            </button>
            <button
              onClick={() =>
                editor?.chain().focus().setTextAlign("right").run()
              }
              className={`p-1 hover:bg-gray-100 rounded ${
                editor?.isActive({ textAlign: "right" }) ? "bg-gray-100" : ""
              }`}
            >
              <FaAlignRight />
            </button>
          </div>
        </div>

        {/* Document Content */}
        <div className="flex-1 p-4 sm:p-8 overflow-y-auto overflow-x-hidden">
          <div className="max-w-4xl mx-auto w-full">
            <div className="mb-8">
              <div
                className="pdf-container bg-white rounded-lg shadow-sm p-4"
                style={{ height: "80vh", overflowY: "scroll" }}
              >
                <Document
                  file={pdf}
                  onLoadSuccess={onDocumentLoadSuccess}
                  onLoadError={onDocumentLoadError}
                  loading={<LoadingAnimation />}
                  className="flex justify-center"
                  options={{
                    cMapUrl:
                      "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/",
                    cMapPacked: true,
                    standardFontDataUrl:
                      "https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/standard_fonts/",
                  }}
                >
                  <Page
                    pageNumber={1}
                    scale={1}
                    className="shadow-lg max-w-full"
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                  />
                </Document>
              </div>
            </div>

            {/* Signature Input */}
            <div className="mt-4">
              <h3 className="text-lg font-medium mb-2">Signature</h3>
              <input
                type="text"
                value={signature}
                onChange={(e) => setSignature(e.target.value)}
                placeholder="Enter your signature"
                className="border rounded p-2 w-full"
              />
            </div>

            {/* Editor for Annotations */}
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-4">Annotations</h3>
              <div className="editor-container" style={{ height: "200px" }}>
                <EditorContent editor={editor} className="prose max-w-none" />
              </div>
            </div>

            {/* Checklist */}
            <div className="space-y-2 mb-6 mt-8">
              {documentData.checklistItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={item.checked}
                    className="w-4 h-4 rounded border-gray-300"
                    readOnly
                  />
                  <span className={item.checked ? "text-gray-600" : ""}>
                    {item.text}
                  </span>
                </div>
              ))}
            </div>

            {/* Bullet Points */}
            <ul className="list-disc list-inside space-y-2">
              {documentData.bulletPoints.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="w-80 border-l bg-gray-50 overflow-y-auto">
        <div className="p-4">
          <h2 className="font-semibold mb-4 text-gray-800">Status</h2>
          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.id} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center space-x-2">
                  <span
                    className={`w-2 h-2 rounded-full ${
                      dept.status === "Approved"
                        ? "bg-green-500"
                        : dept.status === "Rejected"
                        ? "bg-red-500"
                        : "bg-yellow-500"
                    }`}
                  ></span>
                  <span className="font-medium text-gray-800">{dept.name}</span>
                  <span
                    className={`text-sm ${
                      dept.status === "Approved"
                        ? "text-green-500"
                        : dept.status === "Rejected"
                        ? "text-red-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {dept.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-4 border-t bg-white">
          <h2 className="font-semibold mb-4 text-gray-800">Comments</h2>
          <div className="space-y-4">
            {departments.map((dept) => (
              <div key={dept.id} className="space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium">
                    {dept.user.charAt(0)}
                  </div>
                  <div>
                    <div className="font-medium text-sm text-gray-800">
                      {dept.name}
                    </div>
                    <div className="text-sm text-gray-500">{dept.user}</div>
                  </div>
                </div>
                <p className="text-sm text-gray-600 pl-10">{dept.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsDetails;
