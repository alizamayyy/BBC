import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import CoursesInput from "./courses-input";
import { CoursesTable } from "./courses-table";
import Stats from "./stats";

const CoursesSection = () => {
  return (
    <div>
      <Stats />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-2 h-fit mt-56">
          <CardHeader>
            <CardTitle>Add Courses</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <CoursesInput />
          </CardContent>
        </Card>
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Courses Table</CardTitle>
          </CardHeader>
          <CardContent>
            <CoursesTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoursesSection;
