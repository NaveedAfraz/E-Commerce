import ProductImageUpload from "@/components/AdminLayout/img-upload";
import { CommonForm } from "@/components/common/commonForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config/config";
import { getAllProducts } from "@/store/admin-Slice/admin-slice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const initialFormData = {
  name: "",
  price: "",
  description: "",
  category: "",
  image: "",
};

function ProductList() {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] =
    useState(false);

  const [formData, setFormData] = useState(initialFormData);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const dispacth = useDispatch();
  const { productList } = useSelector((state) => state.adminProducts);

  const onSubmit = (e) => {
    e.preventDefault();
    //dispacth(getAllProducts())
    const formDataToSend = {
      ...formData,
      image: uploadedImageUrl,
    };console.log(formDataToSend);
    dispacth(addProduct(formDataToSend));
    
    // console.log(formData);
    // console.log(imageFile);
    console.log("form submitted");
  };

  useEffect(() => {
    dispacth(getAllProducts());
    console.log(uploadedImageUrl);
  }, [dispacth, uploadedImageUrl]);
  return (
    <>
      <div className="mb-5 w-full flex justify-end">
        <Button
          onClick={() => {
            setOpenCreateProductsDialog(true);
            console.log(addProductFormElements);
          }}
        >
          Add New Product
        </Button>
      </div>
      {/* <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div> */}
      <Sheet
        open={openCreateProductsDialog}
        onOpenChange={() => {
          setOpenCreateProductsDialog(false);
          setCurrentEditedId(null);
          setFormData(initialFormData);
        }}
      >
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>
              {/* {currentEditedId !== null ? "Edit Product" : "Add New Product"} */}
              Add New product
            </SheetTitle>
          </SheetHeader>
          <ProductImageUpload
            imageFile={imageFile}
            setImageFile={setImageFile}
            uploadedImageUrl={uploadedImageUrl}
            setUploadedImageUrl={setUploadedImageUrl}
            setImageLoadingState={setImageLoadingState}
            imageLoadingState={imageLoadingState}
            isEditMode={currentEditedId !== null}
          />
          <div className="py-6">
            <CommonForm
              onSubmit={onSubmit}
              formData={formData}
              setFormData={setFormData}
              buttonText={"Add"}
              formComponentDetails={addProductFormElements}
              // isBtnDisabled={!isFormValid()}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

export default ProductList;
