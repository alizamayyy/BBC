"use client";

import { Label } from "@/components/ui/label";
import { Input } from "../../components/ui/input";

import { useState } from "react";

const CoursesInput = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [schedule, setSchedule] = useState("");

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
      </div>
    </div>
  );
};

export default CoursesInput;
