import ProductImageUpload from "@/components/AdminLayout/img-upload";
import AdminProductTile from "@/components/AdminLayout/productDisplay";
import { CommonForm } from "@/components/common/commonForm";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { addProductFormElements } from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import { addNewProduct, getAllProducts } from "@/store/admin-Slice/admin-slice";
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
  const { toast } = useToast();
  const onSubmit = (e) => {
    e.preventDefault();
    //dispacth(getAllProducts())
    const formDataToSend = {
      ...formData,
      name: "productname",
      image: uploadedImageUrl,
    };
    console.log(formDataToSend);
    dispacth(addNewProduct(formDataToSend)).then(async (response) => {
      // console.log(response)

      if (response?.payload?.success === true) {
        console.log(response);
        dispacth(getAllProducts());
        setFormData(initialFormData);
        setImageFile(null);
        setUploadedImageUrl("");
        toast({
          title: "Product Added Successfully.",
          description: "Your product has been added successfully.",
          duration: 3000,
        });
        setOpenCreateProductsDialog(false);
      } else if (response.payload.success === false) {
        toast({
          title: "Product Addition Failed.",
          description: "Your product could not be added.",
          duration: 3000,
        });
      }
    });

    // console.log(formData);
    // console.log(imageFile);
    console.log("form submitted");
  };

  useEffect(() => {
    dispacth(getAllProducts());
    console.log(uploadedImageUrl);
  }, [dispacth, uploadedImageUrl]);

  const handleDelete=()=>{

  }

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
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
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
      </div>
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
              {currentEditedId !== null ? "Edit Product" : "Add New Product"}
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
