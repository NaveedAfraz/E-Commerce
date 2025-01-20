import { HousePlug, LogOut, Menu, ShoppingCart, UserCog } from "lucide-react";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";
import { shoppingViewHeaderMenuItems } from "../../config/config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Avatar, AvatarFallback } from "../ui/avatar";
import logoutUser, { logout } from "../../store/auth-Slice/auth-slice";
//import UserCartWrapper from "./cart-wrapper";
import { useEffect, useRef, useState } from "react";
import { fetchcartDetails } from "../../store/shop-Slice/cart";
import { Label } from "../ui/label";
import Cartwrapper from "./cartwrapper";
import { fetchAllProducts } from "@/store/shop-Slice/shop";

function MenuItems() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [path, setPath] = useState({});
  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters"); // Remove the existing filters (if needed)

    console.log(getCurrentMenuItem);

    // Capitalize the first letter of the current menu item
    const path =
      getCurrentMenuItem.id.slice(0, 1).toUpperCase() +
      getCurrentMenuItem.id.slice(1).toLowerCase();
    console.log(path);

    // Set the current path in the state
    setPath({ category: [path] });

    // Create a new filter object
    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [path],
          }
        : null;
    console.log(currentFilter);

    // Retrieve the existing filters from sessionStorage
    const existingFilters = JSON.parse(sessionStorage.getItem("filters")) || {};

    // If the currentFilter is not null, append to the existing filters
    if (currentFilter) {
      existingFilters.category = [
        ...(existingFilters.category || []),
        ...currentFilter.category,
      ];
      sessionStorage.setItem("filters", JSON.stringify(existingFilters)); // Save the updated filters to sessionStorage
    }

    // Check if the current URL includes "Listing" and update the search params if necessary
    location.pathname.includes("Listing") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${path}`))
      : navigate(getCurrentMenuItem.path);
  }

  useEffect(() => {
    dispatch(fetchAllProducts({ filterParams: path })).then((res) => {
      console.log("header fecth all products");

      console.log(res);
    });
  }, [path, dispatch]);

  return (
    <nav className="flex flex-col mb-3 lg:mb-0 lg:items-center gap-6 lg:flex-row">
      {shoppingViewHeaderMenuItems.map((menuItem) => (
        <Label
          onClick={() => handleNavigate(menuItem)}
          className="text-sm font-medium cursor-pointer"
          key={menuItem.id}
        >
          {menuItem.label}
        </Label>
      ))}
    </nav>
  );
}

function HeaderRightContent() {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.userCart);
  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function handleLogout() {
    console.log("logout");
    dispatch(logout()).then((res) => {
      console.log(res);
    });
  }

  useEffect(() => {
    //console.log(user.userid, "userID");
    // console.log(cartItems);
    dispatch(fetchcartDetails(user.userid));
  }, [dispatch]);
  //console.log(cartItems, "cart");

  // useEffect(() => {
  //   dispatch(fetchCartItems(user?.id));
  // }, [dispatch]);

  // console.log(cartItems, "sangam");
  const previousCountRef = useRef(0);
  if (cartItems?.length !== undefined) {
    previousCountRef.current = cartItems.length;
  }
  // const handleLogout = () => {
  //   dispatch(logoutUser());
  // };
  return (
    <div className="flex lg:items-center lg:flex-row flex-col gap-4">
      <Sheet open={openCartSheet} onOpenChange={() => setOpenCartSheet(false)}>
        <Button
          onClick={() => {setOpenCartSheet(true)
            
          }}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart
            className="w-6 h-6"
            
          />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.length !== undefined
              ? cartItems.length
              : previousCountRef.current}
          </span>
          <span className="sr-only">User cart</span>
        </Button>
        <Cartwrapper
          setOpenCartSheet={setOpenCartSheet}
          cartItems={cartItems && cartItems?.length > 0 ? cartItems : []}
        />
      </Sheet>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Avatar className="bg-black">
            <AvatarFallback className="bg-black text-white font-extrabold">
              {user?.userInfo?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userInfo}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => navigate("/shopping/account")}>
            <UserCog className="mr-2 h-4 w-4" />
            Account
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function ShoppingHeader() {
  //  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <header className="sticky top-0  z-40 w-full bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        <Link to="/shopping/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">Ecommerce</span>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems />
            <HeaderRightContent />
          </SheetContent>
        </Sheet>
        <div className="hidden lg:block">
          <MenuItems />
        </div>

        <div className="hidden lg:block">
          <HeaderRightContent />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
