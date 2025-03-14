import React, { useRef } from "react";
import SignaturePad from "react-signature-canvas";

const SignatureCanvas = ({ onSave }) => {
  const sigPad = useRef(null);

  const clear = () => {
    sigPad.current.clear();
  };

  const save = () => {
    if (!sigPad.current.isEmpty()) {
      const signatureData = sigPad.current.toDataURL();
      onSave(signatureData);
    }
  };

  return (
    <div className="border rounded-lg p-4">
      <div className="border rounded mb-2">
        <SignaturePad
          ref={sigPad}
          canvasProps={{
            className: "w-full h-40",
          }}
        />
      </div>
      <div className="flex space-x-2">
        <button
          className="flex-1 py-1 px-2 rounded bg-gray-500 text-white text-sm hover:bg-gray-600"
          onClick={clear}
        >
          Clear
        </button>
        <button
          className="flex-1 py-1 px-2 rounded bg-blue-500 text-white text-sm hover:bg-blue-600"
          onClick={save}
        >
          Save Signature
        </button>
      </div>
    </div>
  );
};

export default SignatureCanvas;
