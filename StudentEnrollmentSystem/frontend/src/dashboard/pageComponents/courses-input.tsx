"use client";

import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";

import { useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";

const CoursesInput = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");

  const createCourse = async () => {
    const apiUrl = "http://localhost:5000/course";

    const requestBody = {
      title,
      description,
      schedule_time: schedule,
      teacher_id: 1,
      class_id: 1,
    };

    try {
      const response = await axios.post(apiUrl, requestBody);

      if (response.status === 200 || response.status === 201) {
        console.log("Student created successfully");
        console.log(response.data);
        setTitle("");
        setDescription("");
        setSchedule("");
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
          <Label htmlFor="name">Title</Label>
          <Input
            type="text"
            id="title"
            placeholder="Name"
            className="rounded-lg"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Input
            type="text"
            id="description"
            placeholder="Description"
            className="rounded-lg"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="schedule">Schedule</Label>
          <Input
            type="text"
            id="schedule"
            placeholder="Schedule"
            className="rounded-lg"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
          />
        </div>
        <Button
          onClick={createCourse}
          className="bg-blue-500 text-white rounded-lg px-4 py-2"
        >
          Create Course
        </Button>
      </div>
    </div>
  );
};

export default CoursesInput;
