import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Stats from "./stats";
import StudentsTable from "./students-table";
import StudentsInput from "./students-input";

const StudentsSection = () => {
  return (
    <div>
      <Stats />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-2 h-fit mt-8">
          <CardHeader>
            <CardTitle>Add Students</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <StudentsInput />
          </CardContent>
        </Card>
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Students Table</CardTitle>
          </CardHeader>
          <CardContent>
            <StudentsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StudentsSection;
