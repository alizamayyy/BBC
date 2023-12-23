"use client";

import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";

const StudentsInput = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState<Date | undefined>();

  const handleDateSelect = (selectedDate: Date) => {
    setDate(selectedDate);
  };

  return (
    <div className="flex justify-center">
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
        <div className="">
          <p className="text-sm font-semibold">Date of Birth</p>
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            className="rounded-md ml-16"
          />
          {date && (
            <p className="text-sm mt-2">
              Selected Date: {date.toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentsInput;
