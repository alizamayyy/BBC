import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import axios from "axios";

const StudentsInput = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    console.log(selectedDate);
  };
  const createStudent = async () => {
    const apiUrl = "http://localhost:5000/student";

    // Default class_id to 0
    const requestBody = {
      name,
      email,
      date_of_birth: date,
      class_id: 0,
    };

    try {
      const response = await axios.post(apiUrl, requestBody);

      if (response.status === 200 || response.status === 201) {
        console.log("Student created successfully");
        console.log(response.data);
        setName("");
        setEmail("");
        setDate(undefined);
      } else {
        console.error("Failed to create student");
      }
    } catch (error) {
      console.error("Error creating student", error);
    }
  };

  return (
    <div className="flex justify-center">
      <div className="flex flex-col gap-4">
        <div className="w-96">
          <Label htmlFor="name">Namee</Label>
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
            selected={date ? new Date(date) : undefined}
            onSelect={handleDateSelect}
            className="rounded-md ml-16"
          />
          {date && (
            <p className="text-sm mt-2">
              Selected Date: {date.toLocaleDateString()}
            </p>
          )}
        </div>
        <button
          onClick={createStudent}
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Create Student
        </button>
      </div>
    </div>
  );
};

export default StudentsInput;
