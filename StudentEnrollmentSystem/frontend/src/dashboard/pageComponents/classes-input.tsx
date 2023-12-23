"use client";

import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import axios from "axios";

const ClassesInput = () => {
  const [className, setClassName] = useState("");

  const createClass = async () => {
    const apiUrl = "http://localhost:5000/class";

    const requestBody = {
      class_name: className,
    };

    try {
      const response = await axios.post(apiUrl, requestBody);

      if (response.status === 200 || response.status === 201) {
        console.log("Class created successfully");
        console.log(response.data);
        setClassName("");
      } else {
        console.error("Failed to create class");
      }
    } catch (error) {
      console.error("Error creating class", error);
    }
  };

  return (
    <div className="flex justify-center h-fit">
      <div className="w-96">
        <Label htmlFor="className">Class Name</Label>
        <Input
          type="text"
          id="className"
          placeholder="Class Name"
          className="rounded-lg mb-3"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <Button
          onClick={createClass}
          className="bg-blue-500 text-white rounded-lg px-4 py-2 w-96"
        >
          Create Class
        </Button>
      </div>
    </div>
  );
};

export default ClassesInput;
