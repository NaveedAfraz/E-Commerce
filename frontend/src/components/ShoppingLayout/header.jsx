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

function MenuItems({ onMenuItemClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const [path, setPath] = useState({});

  function handleNavigate(getCurrentMenuItem) {
    sessionStorage.removeItem("filters"); // Remove the existing filters (if needed)

    console.log(getCurrentMenuItem.path);
    //  navigate(getCurrentMenuItem.path);
    const path =
      getCurrentMenuItem.id.slice(0, 1).toUpperCase() +
      getCurrentMenuItem.id.slice(1).toLowerCase();
    console.log(path);
    if (onMenuItemClick) {
      onMenuItemClick();
    }
    setPath({ category: [path] });

    const currentFilter =
      getCurrentMenuItem.id !== "home" &&
      getCurrentMenuItem.id !== "products" &&
      getCurrentMenuItem.id !== "search"
        ? {
            category: [path],
          }
        : null;

    const existingFilters = JSON.parse(sessionStorage.getItem("filters")) || {};

    if (currentFilter) {
      existingFilters.category = [
        ...(existingFilters.category || []),
        ...currentFilter.category,
      ];
      sessionStorage.setItem("filters", JSON.stringify(existingFilters));
    }

    location.pathname.includes("Listing") && currentFilter !== null
      ? setSearchParams(new URLSearchParams(`?category=${path}`))
      : navigate(getCurrentMenuItem.path);

    if (onMenuItemClick) {
      onMenuItemClick(); // Close the sidebar
    }
  }

  useEffect(() => {
    dispatch(fetchAllProducts({ filterParams: path })).then((res) => {
      console.log("header fetch all products");
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

function HeaderRightContent({
  onMenuItemClick,
  openCartSheet,
  setOpenCartSheet,
}) {
  const { user } = useSelector((state) => state.auth);
  const { cartItems } = useSelector((state) => state.userCart);
  //  const [openCartSheet, setOpenCartSheet] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  console.log(user, "user");

  function handleLogout() {
    console.log("logout");
    dispatch(logout()).then((res) => {
      console.log(res);
      if (onMenuItemClick) onMenuItemClick();
    });
  }
  console.log(user.userid, "userID");
  useEffect(() => {
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
      <Sheet
        open={openCartSheet}
        onOpenChange={(isOpen) => {
          setOpenCartSheet(isOpen);
          if (isOpen && onMenuItemClick) {
            onMenuItemClick(); // Close the left sidebar when the cart opens
          }
        }}
      >
        <Button
          onClick={() => {
            setOpenCartSheet(true);
            if (onMenuItemClick) onMenuItemClick();
          }}
          variant="outline"
          size="icon"
          className="relative"
        >
          <ShoppingCart className="w-6 h-6" />
          <span className="absolute top-[-5px] right-[2px] font-bold text-sm">
            {cartItems?.length !== undefined
              ? cartItems.length
              : previousCountRef.current}
          </span>
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
              {user?.userInfo?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" className="w-56">
          <DropdownMenuLabel>Logged in as {user?.userInfo}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => {
              navigate("/shopping/account");
              if (onMenuItemClick) onMenuItemClick();
            }}
          >
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
  const [openSidebar, setOpenSidebar] = useState(false);
  const [openCartSheet, setOpenCartSheet] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full bg-background">
      <div className="flex h-16 items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link to="/shopping/home" className="flex items-center gap-2">
          <HousePlug className="h-6 w-6" />
          <span className="font-bold">EliteWardrobe</span>
        </Link>

        {/* Left Sidebar */}
        <Sheet open={openSidebar} onOpenChange={setOpenSidebar}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="lg:hidden">
              <Menu className="h-6 w-6" />
              <span className="sr-only">Toggle header menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-full max-w-xs">
            <MenuItems onMenuItemClick={() => setOpenSidebar(false)} />
            <HeaderRightContent
              onMenuItemClick={() => setOpenSidebar(false)}
              openCartSheet={openCartSheet}
              setOpenCartSheet={setOpenCartSheet}
            />
          </SheetContent>
        </Sheet>

        {/* Desktop Menus */}
        <div className="hidden lg:block">
          <MenuItems />
        </div>
        <div className="hidden lg:block">
          <HeaderRightContent
            openCartSheet={openCartSheet}
            setOpenCartSheet={setOpenCartSheet}
          />
        </div>
      </div>
    </header>
  );
}

export default ShoppingHeader;
