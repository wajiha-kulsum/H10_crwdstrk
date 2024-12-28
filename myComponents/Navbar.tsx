import React from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import "@/app/globals.css";

const Navbar = () => {
  return (
    <div className="rounded-full bg-white">
      <div className="grid grid-cols-3 items-center">
        <div className="flex justify-start">
          <h1 className="text-2xl font-bold font-outfitRegular pl-1">LOGO</h1>
        </div>
        <div className="flex justify-center gap-5">
          <Link
            href="/"
            className="text-sm font-outfitRegular px-4 py-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black"
          >
            Home
          </Link>
          <Link
            href="/"
            className="text-sm font-outfitRegular px-4 py-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black"
          >
            Contact
          </Link>
          <Link
            href="/"
            className="text-sm font-outfitRegular px-4 py-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black"
          >
            About
          </Link>
          <Link
            href="/"
            className="text-sm font-outfitRegular px-4 py-2 rounded-full hover:bg-gray-100 text-gray-700 hover:text-black"
          >
            Dashboard
          </Link>
        </div>
        <div className="flex justify-end">
          <div className="flex gap-2 bg-gray-100 p-1 rounded-full">
            <Button className="rounded-full bg-gray-100 shadow-none text-gray-700 hover:text-black hover:bg-gray-200 font-outfitRegular">
              Login
            </Button>
            <Button className="rounded-full bg-white text-black hover:text-white hover:bg-slate-700 font-outfitRegular">
              Signup
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;