import { Label } from "@radix-ui/react-label";
import React, { useRef } from "react";
import { Input } from "../ui/input";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadImageUrl,
  setUploadedImageUrl,
}) {
  const inputref = useRef(null);

  const handleImageFileChange = (e) => {
    e.preventDeafult();
  };
  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <Label className="text-lg font-bold mb-2 block">
          <div>
            <Input
              id="image"
              type="file"
              onChange={handleImageFileChange(e)}
              className="hidden"
              ref={inputref}
            />
          </div>
        </Label>
      </div>
    </>
  );
}
