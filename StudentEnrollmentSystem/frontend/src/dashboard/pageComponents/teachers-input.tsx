"use client";

import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const TeachersInput = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const createTeacher = async () => {
    const apiUrl = "http://localhost:5000/teacher";

    // Default class_id to 0
    const requestBody = {
      name,
      email,
    };

    try {
      const response = await axios.post(apiUrl, requestBody);

      if (response.status === 200 || response.status === 201) {
        console.log("Student created successfully");
        console.log(response.data);
        setName("");
        setEmail("");
      } else {
        console.error("Failed to create teacher");
      }
    } catch (error) {
      console.error("Error creating teacher", error);
    }
  };

  return (
    <div className="flex justify-center h-fit">
      <div className="flex flex-col gap-4">
        <div className="w-96">
          <Label htmlFor="name">Name</Label>
          <Input
            type="text"
            id="name"
            placeholder="Name"
            className="rounded-lg"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="email"
            id="email"
            placeholder="Email"
            className="rounded-lg"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <Button
          onClick={createTeacher}
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Create Teacher
        </Button>
      </div>
    </div>
  );
};

export default TeachersInput;
