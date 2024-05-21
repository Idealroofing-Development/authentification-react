import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import List from '../pages/List.jsx';
import { NotFoundScreen } from '../pages/NotFoundScreen.jsx';
import FinishedScreen from '../pages/FinishedScreen.jsx';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useAuth } from '../context/auth-context.jsx';
import Cart from '../pages/Cart.jsx';
import Product from '@/pages/Product.jsx';
import Quotes from '@/pages/Quotes.jsx';
import Orders from '@/pages/Orders.jsx';
import logo from '../assets/logo.png';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button.jsx';
import { FaShoppingCart } from 'react-icons/fa';
import { GiHamburgerMenu } from 'react-icons/gi';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { IoLogOutOutline } from 'react-icons/io5';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<List />} />
      <Route path="/finished" element={<FinishedScreen />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/quotes" element={<Quotes />} />
      <Route path="/product/:id" element={<Product />} />
      <Route path="*" element={<NotFoundScreen />} />
    </Routes>
  );
}
// refactor the code please //
export default function AuthenticatedApp() {
  const { user, logout } = useAuth();
  const queryClient = new QueryClient();
  return (
    <div className="min-h-screen flex flex-col">
      <nav>
        <div className="min-h-[125px] bg-green-primary text-white md:flex justify-between gap-8 lg:p-8 md:p-4 hidden">
          <div className="text-xl">Welcome Zakaria</div>
          <div>
            <img src={logo} className="lg:max-w-[400px] md:max-w-[300px] " />
          </div>

          {/**<Avatar className="lg:w-[60px] lg:h-[60px] md:w-[48px] md:h-[48px]">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>ZZ</AvatarFallback>
  </Avatar>**/}

          <div className="flex gap-5 items-center">
            <Link to="/cart">
              <FaShoppingCart className="w-[24px] h-[24px]" width={60} height={60} />
            </Link>

            <Button
              className="bg-red-600 border border-red-600 hover:bg-red-600/90"
              onClick={logout}>
              Logout
            </Button>
          </div>
        </div>

        <div className="md:flex justify-between items-center py-2 px-8 bg-gray-100 uppercase text-sm font-semibold hidden ">
          <Link to="/"> Products </Link>
          <Link to="/quotes"> My Quotes </Link>
          <Link to="/orders"> My Orders </Link>
          <Link to="/"> Contact Us </Link>
          <Link to="/"> Tutorial </Link>
        </div>

        <div className="md:hidden bg-green-primary p-4 text-white">
          <img src={logo} className=" max-w-[180px] mx-auto mb-4" />

          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-white">Welcome Zakaria</div>

            <div className="flex gap-5 items-center">
              <Link to="/cart">
                <FaShoppingCart className="w-[24px] h-[24px]" />
              </Link>
              <Sheet>
                <SheetTrigger>
                  <GiHamburgerMenu className="w-[24px] h-[24px]" />
                </SheetTrigger>
                <SheetContent className="flex flex-col items-start gap-5 pt-16 font-semibold">
                  <Link to="/"> Products </Link>
                  <Link to="/quotes"> My Quotes </Link>
                  <Link to="/orders"> My Orders </Link>
                  <Link to="/"> Contact Us </Link>
                  <Link to="/"> Tutorial </Link>
                  <div onClick={logout} className="flex gap-2 items-center">
                    <IoLogOutOutline className="w-[24px] h-[24px]" />
                    <p>Logout</p>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </nav>
      <div className="flex-1 ">
        <QueryClientProvider client={queryClient}>
          <AppRoutes />
        </QueryClientProvider>
      </div>
      <div>Footer</div>
    </div>
  );
}
