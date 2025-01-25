import React, { useEffect, useState } from "react";
import {
  Airplay,
  BabyIcon,
  ChevronLeft,
  ChevronRight,
  CloudLightning,
  Heater,
  Images,
  Section,
  Shirt,
  ShirtIcon,
  ShoppingBasket,
  UmbrellaIcon,
  WashingMachine,
  WatchIcon,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Router, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ProductDisplay from "@/components/ShoppingLayout/productDisplay";
import { fetchAllProducts, fetchProductDetails } from "@/store/shop-Slice/shop";
import Footer from "@/components/Home/footer";
import HomePromotions from "@/components/Home/newsLetter";
import { SliderImages } from "../../config/config";
import ProductDetailsModal from "@/components/ShoppingLayout/productDetails";
export default function Home() {
  const [currentIndex, setCurrentIndex] = useState(0);
  // const { productList } = useSelector((state) => state.shopProducts);
  // console.log(productList);
  const [products, setProducts] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllProducts({ filterParams: {}, sortParams: null })).then(
      (res) => {
        console.log(res);
        if (res.payload.success) {
          setProducts(res.payload.data);
          setShow(true);
        }
      }
    );
  }, []);
  const categoriesWithIcon = [
    { id: "men", label: "Men", icon: ShirtIcon },
    { id: "women", label: "Women", icon: CloudLightning },
    { id: "kids", label: "Kids", icon: BabyIcon },
    { id: "accessories", label: "Accessories", icon: WatchIcon },
    { id: "footwear", label: "Footwear", icon: UmbrellaIcon },
  ];

  const brandsWithIcon = [
    { id: "nike", label: "Nike", icon: Shirt },
    { id: "adidas", label: "Adidas", icon: WashingMachine },
    { id: "puma", label: "Puma", icon: ShoppingBasket },
    { id: "levi", label: "Levi's", icon: Airplay },
    { id: "zara", label: "Zara", icon: Images },
    { id: "h&m", label: "H&M", icon: Heater },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === SliderImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // console.log(SliderImages.length - 1);

  const navigate = useNavigate();
  // const location = useLocation();
  const handleNavigateToListingPage = (getCurrentItem, category) => {
    console.log(getCurrentItem, category);
    sessionStorage.removeItem("filters");
    const currentFilter = {
      [category]: [getCurrentItem.label],
    };
    //  console.log(location.search);

    const searchParams = new URLSearchParams(location.search);
    console.log(searchParams);

    // sessionStorage.setItem("filters", JSON.stringify(currentFilter));
    navigate(`/shopping/Listings?${category}=${getCurrentItem.label}`);
  };
  const [show, setShow] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const { productList, productDetails } = useSelector(
    (state) => state.shopProducts
  );
  const handleDetails = async (ID) => {
    setSelectedProduct(ID);
    dispatch(fetchProductDetails(ID));
  };
  console.log(selectedProduct);
  useEffect(() => {
    if (selectedProduct) {
      setOpenModal(true);
    }
  }, [selectedProduct]);
  return (
    <>
      <div className="relative w-full max-w-[1200px] mx-auto overflow-hidden h-[500px] md:h-[400px] lg:h-[650px] hover:shadow-2xl transition-shadow my-3 rounded-2xl">
        {/* Slider Track */}
        <div
          className="flex transition-transform duration-500 h-full"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {/* Slides */}
          {SliderImages.map((img, index) => (
            <div key={index} className="w-full flex-shrink-0 h-full">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
                style={{ objectPosition: "center" }}
              />
            </div>
          ))}
        </div>

        {/* Left Button */}
        <button
          className="absolute top-1/2 left-2 md:left-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full h-[40px] w-[40px] md:h-[50px] md:w-[50px] flex items-center justify-center z-10"
          aria-label="Previous Slide"
          onClick={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex === 0 ? SliderImages.length - 1 : prevIndex - 1
            )
          }
        >
          <ChevronLeft size={20} className="md:w-6 md:h-6" />
        </button>

        {/* Right Button */}
        <button
          className="absolute top-1/2 right-2 md:right-4 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full h-[40px] w-[40px] md:h-[50px] md:w-[50px] flex items-center justify-center"
          aria-label="Next Slide"
          onClick={() =>
            setCurrentIndex((prevIndex) =>
              prevIndex === SliderImages.length - 1 ? 0 : prevIndex + 1
            )
          }
        >
          <ChevronRight size={20} className="md:w-6 md:h-6" />
        </button>

        {/* Navigation Dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 md:bottom-4">
          {SliderImages.map((_, index) => (
            <button
              key={index}
              className={`w-[10px] h-[10px] md:w-[15px] md:h-[15px] rounded-full ${
                currentIndex === index
                  ? "bg-white"
                  : "bg-white bg-opacity-50 hover:bg-opacity-75"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
            ></button>
          ))}
        </div>
      </div>

      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-8">
            Shop by category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {categoriesWithIcon.map((categoryItem) => (
              <Card
                onClick={() =>
                  handleNavigateToListingPage(categoryItem, "category")
                }
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <categoryItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{categoryItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-8 bg-gray-50 mx-4 md:mx-8 lg:mx-16">
        <h2 className="text-4xl font-bold text-center mb-8">Latest Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {products.slice(0, 4).map((product) => {
            return (
              <ProductDisplay
                productDetails={productDetails}
                handleDetails={handleDetails}
                product={product}
                text={"Details"}
                show={show}
                setShow={setShow}
              />

              // <Card
              //   key={product.id}
              //   className="cursor-pointer hover:shadow-lg transition-shadow"
              // >
              //   <CardContent className="flex flex-col items-center justify-center p-6">
              //     <span className="font-bold">{product.title}</span>
              //     <img src={product.image} className=""></img>
              //   </CardContent>
              // </Card>
            );
          })}
        </div>
      </section>
      {selectedProduct && (
        <ProductDetailsModal
          selectedProduct={selectedProduct}
          setSelectedProduct={setSelectedProduct}
          productDetails={productDetails}
          openModal={openModal}
          setOpenModal={setOpenModal}
        />
      )}
      <section className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-8">Shop by Brand</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {brandsWithIcon.map((brandItem) => (
              <Card
                onClick={() => handleNavigateToListingPage(brandItem, "brand")}
                className="cursor-pointer hover:shadow-lg transition-shadow"
              >
                <CardContent className="flex flex-col items-center justify-center p-6">
                  <brandItem.icon className="w-12 h-12 mb-4 text-primary" />
                  <span className="font-bold">{brandItem.label}</span>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <HomePromotions />
    </>
  );
}
