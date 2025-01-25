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
import { addReview, getReviews } from "@/store/shop-Slice/reviews";
import { Input } from "../ui/input";
import StarRatingComponent from "../common/StarRatingComponent";

function ProductDetailsModal({
  productDetails,
  openModal,
  setOpenModal,
  setShowDetails,
}) {
  // console.log(showDetails);

  const [reviews, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const { reviewList, error } = useSelector((state) => state.reviews);
  console.log(error);

  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.userCart);
  // const UserID = useSelector((state) => state.auth?.UserID ?? null);
  // console.log(user.userid);
  console.log("renderedddd");
  console.log(productDetails);
  console.log(reviewList);

  // console.log(openModal);
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
  const addToCart = (productDetails) => {
    console.log(productDetails);
    // let quantity;
    // cartItems.map((item, index) => {
    //   if (item.productID === productDetails?.productID) {
    //     quantity = productDetails?.totalStock - item.quantity;
    //     console.log(quantity);
    let remainingStock = productDetails?.totalStock;
    const existingCartItem = cartItems.find(
      (item) => item.productID === productDetails?.productID
    );
    if (existingCartItem) {
      remainingStock = productDetails?.totalStock - existingCartItem.quantity;
      if (remainingStock <= 0) {
        toast({
          title: "Cannot add more than available stock",
          duration: 2000,
          className: "bg-red-500 text-white",
        });
        return;
      }
    }
    // console.log(quantity);

    if (remainingStock > 0) {
      dispatch(
        addProductToCart({
          productDetails: productDetails,
          userid: user.userid,
        })
      ).then((res) => {
        console.log(res);
        if (res?.payload?.sucess) {
          toast({ title: "Item added to cart successfully", duration: 2000 });
          dispatch(fetchcartDetails(user.userid)).then((res) => {
            console.log(res);
          });
        }
      });
    }
  };
  console.log(user);
  const [errorToastTrigger, setErrorToastTrigger] = useState(false);

  function handleRatingChange(getRating) {
    console.log(getRating, "getRating");

    setRating(getRating);
  }

  const handleCLoseDialog = () => {
    console.log("close dialog");
    setOpenModal(false);
    setRating(0);
    setreviewMsg("");
    // setShowDetails(false);
    dispatch(setProductDialog());
  };
  // console.log(openModal);
  const [reviewMsg, setreviewMsg] = useState("");
  function handleAddReview() {
    dispatch(
      addReview({
        productID: productDetails[0]?.productID,
        userID: user?.userid,
        // userName: user?.userName,
        reviewMessage: reviewMsg,
        reviewValue: rating,
      })
    ).then((data) => {
      console.log(data);

      if (data.payload.success) {
        setRating(0);
        setreviewMsg("");
        dispatch(getReviews(productDetails[0]?.productID)).then((res) => {
          console.log(res);
          if (res.payload.success) {
            setReview(res.payload.data);
          }
        });
        toast({
          title: "Review added successfully!",
          duration: 2000,
          className: "bg-green-500 text-white",
        });
      } else {
        console.log(error);
        setErrorToastTrigger((prev) => !prev);
      }
    });
  }
  console.log(productDetails);
  useEffect(() => {
    if (error) {
      toast({
        title: error,
        duration: 2000,
        className: "bg-red-500 text-white",
      });
    }
  }, [errorToastTrigger]);
  useEffect(() => {
    if (productDetails !== null) console.log("runinng");
    dispatch(getReviews(productDetails[0]?.productID)).then((res) => {
      console.log(res);
      if (error) {
      }
      if (res.payload.success) {
        setReview(res.payload.data);
      }
    });
  }, [productDetails]);

  console.log(reviews, "reviews");
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
            <p className="text-muted-foreground text-2xl mb-5 mt-4 break-words line-clamp-4">
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
              {reviews && reviews.length > 0 ? (
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
                        {reviewItem.reviewMsg}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <h1>No Reviews</h1>
              )}
            </div>

            <div className="mt-10 flex-col flex gap-2">
              <Label>Write a review</Label>
              <div className="flex gap-1">
                <StarRatingComponent
                  rating={rating}
                  handleRatingChange={handleRatingChange}
                />
              </div>
              <Input
                name="reviewMsg"
                value={reviewMsg}
                onChange={(event) => setreviewMsg(event.target.value)}
                placeholder="Write a review..."
              />
              {console.log(reviewMsg, rating)}
              <Button
                onClick={handleAddReview}
                disabled={reviewMsg.trim() === "" || rating == 0}
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
