import React, { useEffect, useState } from "react";
import { CommonForm } from "../common/commonForm";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { addressFormControls } from "@/config/config";
import { useToast } from "@/hooks/use-toast";
import {
  addNewAddress,
  deleteAddress,
  fetchAllAddresses,
  updateAddress,
} from "@/store/shop-Slice/address";
import AddressCard from "./address-card";
import { CheckCircleIcon } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
const initialAddressFormData = {
  address: "",
  city: "",
  phone: "",
  pincode: "",
  notes: "",
};
export const Address = ({
  selectedId,
  setSelectedId,
  setCurrentSelectedAddress,
  showAddressForm,
  setShowAddressForm,
}) => {
  const { addressList } = useSelector((state) => state.addresses);
  console.log(addressList);
  // const [selectedId, setSelectedId] = useState(null);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  const [formData, setFormData] = useState(initialAddressFormData);
  const { toast } = useToast();
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  console.log(user);
  const location = useLocation();
  console.log(location);
  useEffect(() => {
    if (location.pathname.includes("address")) {
      console.log("it is account");
      setShowAddressForm(true);
    }
  }, []);
  useEffect(() => {   
    dispatch(fetchAllAddresses(user.userid)).then((res) => {
      console.log(res);
      console.log("fetched user addresses");
    });
  }, []);
  const handleManageAddress = (e) => {
    e.preventDefault();

    // setFormData({
    //   [e.target.name]: e.target.value,
    // })
    if (addressList.length >= 3 && currentEditedId === null) {
      setFormData(initialAddressFormData);
      toast({
        title: "You can add max 3 addresses",
        variant: "destructive",
      });

      return;
    }

    currentEditedId !== null
      ? dispatch(
          updateAddress({ userID: user.userid, addressData: formData })
        ).then((res) => {
          console.log(res);
          if (res.payload.success) {
            dispatch(fetchAllAddresses(user.userid)).then((res) => {
              console.log(res);
              if (location.pathname.includes("checkout")) {
                console.log("it is checkout");
                setShowAddressForm((prev) => !prev);
              }

              setFormData(initialAddressFormData);
              toast({
                title: "Address updated successfully",
                duration: 2000,
                variant: "default",
                status: "success",
                description: "Your address has been updated successfully",
                isClosable: true,

                className: "bg-green-800 text-white",
              });
              console.log("fetched user addresses");
            });
          }
        })
      : dispatch(
          addNewAddress({ userID: user.userid, addressData: formData })
        ).then((res) => {
          console.log(res);
          if (res.payload.success) {
            setFormData(initialAddressFormData);
            setCurrentEditedId(null);
            toast({
              title: "Address added successfully",
              duration: 2000,
            });
            dispatch(fetchAllAddresses(user.userid)).then((res) => {
              console.log(res);
              console.log("fetched user addresses");
            });
          }
        });
    console.log(formData);
  };
  console.log(showAddressForm);

  const handleDeleteAddress = (addressId) => {
    console.log(addressId);
    dispatch(
      deleteAddress({ userID: user.userid, addressID: addressId.addressID })
    ).then((res) => {
      console.log(res);
      if (res.payload.success) {
        dispatch(fetchAllAddresses(user.userid)).then((res) => {
          // console.log(res);
          console.log("fetched user addresses");
        });
      }
    });
  };
  const handleEditAddress = (addressId) => {
    console.log(addressId);
    // setSelectedId(addressId.addressID);
    setCurrentEditedId(addressId.addressID);
    setFormData(addressId);
    setShowAddressForm(true);
    console.log(formData);
  };
  const navigate = useNavigate();
  return (
    <Card>
      <div className="mb-5 p-3 grid grid-cols-1 sm:grid-cols-2  gap-2">
        {addressList && addressList.length > 0
          ? addressList.map((singleAddressItem) => (
              <AddressCard
                selectedId={selectedId}
                handleDeleteAddress={handleDeleteAddress}
                addressInfo={singleAddressItem}
                handleEditAddress={handleEditAddress}
                setCurrentSelectedAddress={setCurrentSelectedAddress}
                showAddressForm={showAddressForm}
                setShowAddressForm={setShowAddressForm}
              />
            ))
          : null}
      </div>
      {showAddressForm ? (
        <>
          {" "}
          <CardHeader>
            <CardTitle>
              {currentEditedId !== null ? "Edit Address" : "Add New Address"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <CommonForm
              formComponentDetails={addressFormControls}
              formData={formData}
              setFormData={setFormData}
              buttonText={currentEditedId !== null ? "Edit" : "Add"}
              onSubmit={handleManageAddress}
              // isBtnDisabled={!isFormValid()}
            />
          </CardContent>
        </>  
      ) : (
        <Button
          className="w-[94%] mx-3"
          onClick={() => navigate("/shopping/account/address")}
        >
          Add New Address
        </Button>
      )}
    </Card>
  );
};
