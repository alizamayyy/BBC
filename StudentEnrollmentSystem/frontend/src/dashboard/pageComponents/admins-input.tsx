"use client";

import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const AdminsInput = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const createAdmin = async () => {
    const apiUrl = "http://localhost:5000/admin";

    const requestBody = {
      name,
      email,
    };

    try {
      const response = await axios.post(apiUrl, requestBody);

      if (response.status === 200 || response.status === 201) {
        console.log("Admin created successfully");
        console.log(response.data);
        setName("");
        setEmail("");
      } else {
        console.error("Failed to create admin");
      }
    } catch (error) {
      console.error("Error creating admin", error);
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
          onClick={createAdmin}
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Create Admin
        </Button>
      </div>
    </div>
  );
};

export default AdminsInput;
