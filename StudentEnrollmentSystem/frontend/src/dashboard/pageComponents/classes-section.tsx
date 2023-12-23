import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import ClassesInput from "./classes-input";
import { ClassesTable } from "./classes-table";
import Stats from "./stats";

const ClassesSection = () => {
  return (
    <div>
      <Stats />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-2 h-fit mt-56">
          <CardHeader>
            <CardTitle>Add Classes</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <ClassesInput />
          </CardContent>
        </Card>
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Classes Table</CardTitle>
          </CardHeader>
          <CardContent>
            <ClassesTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClassesSection;
