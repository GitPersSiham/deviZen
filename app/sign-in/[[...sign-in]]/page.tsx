"use client";
import React from "react";
import { SignIn } from '@clerk/nextjs'
const pages = () => {
  return (
    <div className="hero bg-base-200 min-h-screen">
      <div className="hero-content text-center">
        <div className="max-w-md">
          <SignIn />
        </div>
      </div>
    </div>
  );
};

export default pages;
