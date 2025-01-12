import { Label } from "@radix-ui/react-label";
import React, { useEffect, useRef } from "react";
import { Input } from "../ui/input";
import { FileIcon, UploadCloudIcon, XIcon } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { Button } from "../ui/button";
import axios from "axios";

function ProductImageUpload({
  imageFile,
  setImageFile,
  uploadImageUrl,
  isEditMode,
  setUploadedImageUrl,
  imageLoadingState,
  setImageLoadingState,
}) {
  const inputref = useRef(null);

  const handleImageFileChange = (e) => {
    e.preventDefault();
    console.log(e.target.files, "event.target.files");
    const selectedFile = e.target.files?.[0];
    console.log(selectedFile);
    if (selectedFile) setImageFile(selectedFile);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    if (inputref.current) {
      inputref.current.value = "";
    }
  };

  async function uploadImageToCloudinary() {
    setImageLoadingState(true);
    const data = new FormData();
    data.append("my_file", imageFile);
    const response = await axios.post(
      "http://localhost:3006/admin/upload-image",
      data
    );
    console.log(response, "response");

    if (response?.data?.success) {
      setUploadedImageUrl(response.data.result.url);
      setImageLoadingState(false);
    }
  }

  useEffect(() => {
    if (imageFile !== null) uploadImageToCloudinary();
  }, [imageFile]);

  return (
    <>
      <div className="w-full max-w-md mx-auto">
        <Label className="text-lg font-bold mb-2 block"> Upload Image</Label>
        <div>
          <Input
            id="image"
            type="file"
            onChange={handleImageFileChange}
            className="hidden"
            ref={inputref}
            disabled={isEditMode} 
          />
          {console.log(isEditMode, "isEditMode")}
          {!imageFile ? (
            <Label
              htmlFor="image"
              className={`${
                isEditMode ? "cursor-not-allowed" : ""
              } flex flex-col items-center justify-center h-32 cursor-pointer`}
            >
              <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
              <span>Click to upload image</span>
            </Label>
          ) : imageLoadingState ? (
            <Skeleton className="h-10 bg-gray-100" />
          ) : (
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <FileIcon className="w-8 text-primary mr-2 h-8" />
              </div>
              <p className="text-sm font-medium">{imageFile.name}</p>
              <Button
                variant="ghost"
                size="icon"
                className="text-muted-foreground hover:text-foreground z-20"
                onClick={handleRemoveImage}
              >
                <XIcon className="w-4 h-4" />
                <span className="sr-only">Remove File</span>
              </Button>
            </div>
          )}{" "}
        </div>
      </div>
    </>
  );
}

export default ProductImageUpload;
