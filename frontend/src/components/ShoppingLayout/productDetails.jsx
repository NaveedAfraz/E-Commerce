import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogTitle } from "../ui/dialog";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Separator } from "../ui/separator";
import { Label } from "@radix-ui/react-label";
import { useDispatch, useSelector } from "react-redux";
import {
  addProductToCart,
  fetchcartDetails,
} from "../../store/shop-Slice/cart";
import { toast, useToast } from "@/hooks/use-toast";
import { setProductDialog } from "@/store/shop-Slice/shop";

function ProductDetailsModal({
  productDetails,
  openModal,
  setOpenModal,
  setShowDetails,
}) {
  // console.log(showDetails);

  const [reviewMsg, setReviewMsg] = useState("");
  const [rating, setRating] = useState(0);

  const { user } = useSelector((state) => state.auth);

  // const UserID = useSelector((state) => state.auth?.UserID ?? null);
  // console.log(user.userid);
  console.log("renderedddd");
  //  console.log(productDetails);

  console.log(openModal);
  useEffect(() => {
    console.log("productDetails updated:", productDetails);

    // setOpenModal((prev) => !prev); // Ensure this runs when productDetails changes
  }, []); // Log when productDetails changes
  console.log(user);

  // setOpenModal(true);
  // console.log(productDetails);
  // console.log(productDetails[0]?.salePrice);
  const dispatch = useDispatch();
  const { toast } = useToast();
  const addToCart = () => {
    dispatch(
      addProductToCart({
        productDetails: productDetails[0],
        userid: user.userid,
      })
    ).then((res) => {
      console.log(res);

      if (res?.payload?.sucess) {
        dispatch(fetchcartDetails(user.userid)).then((res) => {
          console.log(res);
          console.log("Product fetcheddd");
          toast({ title: "Item added to cart successfully", duration: 1000 });
        });
      }
      console.log(res);
      // console.log("Product added to cart");
    });
  };

  const handleCLoseDialog = () => {
    console.log("close dialog");
    setOpenModal(false);
    // setShowDetails(false);
    dispatch(setProductDialog());
  };

  return (
    <Dialog
      open={openModal}
      onOpenChange={handleCLoseDialog}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
    >
      {/* <DialogTitle id="dialog-title">Product Details</DialogTitle> */}
      <DialogContent
        id="dialog-description"
        className="grid grid-cols-2 gap-8 sm:p-12 max-w-[90vw] sm:max-w-[80vw] lg:max-w-[70vw]"
      >
        <div className="relative overflow-hidden rounded-lg">
          <img
            src={productDetails[0]?.image}
            alt={productDetails[0]?.title}
            width={600}
            height={600}
            className="aspect-square w-full object-cover"
          />
        </div>
        <div>
          <div>
            <h1 className="text-3xl font-extrabold break-words">
              {productDetails[0]?.title}
            </h1>
            <p className="text-muted-foreground text-2xl mb-5 mt-4 break-words">
              {productDetails[0]?.desc}
            </p>
          </div>
          <div className="flex items-center justify-between">
            <p
              className={`text-3xl font-bold text-primary ${
                productDetails[0]?.salePrice > 0 ? "line-through" : ""
              }`}
            >
              ${productDetails[0]?.price}
            </p>
            {productDetails[0]?.salePrice > 0 && (
              <p className="text-2xl font-bold text-muted-foreground">
                ${productDetails[0]?.salePrice}
              </p>
            )}
          </div>
          <div className="mt-5 mb-5">
            {productDetails[0]?.totalStock === 0 ? (
              <Button className="w-full opacity-60 cursor-not-allowed">
                Out of Stock
              </Button>
            ) : (
              <Button
                onClick={() => addToCart(productDetails[0])}
                className="w-full"
              >
                Add to Cart
              </Button>
            )}
          </div>

          <Separator />
          <div className="max-h-[300px] overflow-auto">
            <h2 className="text-xl font-bold mb-4">Reviews</h2>
            <div className="grid gap-6">
              {/* {reviews && reviews.length > 0 ? (
                reviews.map((reviewItem) => (
                  <div className="flex gap-4"> 
                    <Avatar className="w-10 h-10 border">
                      <AvatarFallback>
                        {reviewItem?.userName[0].toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold">{reviewItem?.userName}</h3>
                      </div>
                      <div className="flex items-center gap-0.5">
                        <StarRatingComponent rating={reviewItem?.reviewValue} />
                      </div>
                      <p className="text-muted-foreground">
                        {reviewItem.reviewMessage}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )} */}
            </div>

            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                {/* <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                /> */}
              </div>
              {/* <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setReviewMsg(event.target.value)}
                placeholder="Write a review..."
              /> */}
              <Button
              // onClick={handleAddReview}
              // disabled={reviewMsg.trim() === ""}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProductDetailsModal;
