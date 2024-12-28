import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, BookOpen, FileText } from 'lucide-react';
import Image from "next/image";

function Addfeatures() {
  return (
    <div className="w-full max-w-7xl mx-auto p-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 flex flex-col lg:flex-row bg-violet-100 rounded-2xl shadow-lg overflow-hidden">
          <div className="lg:w-1/2 p-8 flex flex-col justify-center">
            <h1 className="text-4xl font-outfitRegular font-extrabold text-slate-600 leading-tight">
              Join a Supportive Community
            </h1>
            <h2 className="text-2xl font-outfitRegular font-semibold text-slate-800 mb-4">
              Connect, Share, and <br/>Grow Together
            </h2>
            <p className="text-slate-600 font-outfitRegular leading-relaxed mb-6">
              Discover a safe space to connect with like-minded individuals. Share
              your experiences and grow through shared journeys and resources.
            </p>
            <Button className="w-fit bg-violet-600 hover:bg-violet-700 text-white rounded-full">
              Join Now <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          <div className="lg:w-1/2 relative min-h-[300px] lg:min-h-full">
            image
          </div>
        </div>
       
    </div>
  );
}

export default Addfeatures;

