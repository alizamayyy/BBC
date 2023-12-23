"use client";

import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";

import { useState } from "react";

const ClassesInput = () => {
  const [className, setClassName] = useState("");

  return (
    <div className="flex justify-center h-fit">
      <div className="w-96">
        <Label htmlFor="className">Class Name</Label>
        <Input
          type="text"
          id="className"
          placeholder="Class Name"
          className="rounded-lg"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
      </div>
    </div>
  );
};

export default ClassesInput;
