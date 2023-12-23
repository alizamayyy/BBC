import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import Stats from "./stats";
import TeachersInput from "./teachers-input";
import { TeachersTable } from "./teachers-table";

const TeachersSection = () => {
  return (
    <div>
      <Stats />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-2 h-fit mt-56">
          <CardHeader>
            <CardTitle>Add Teachers</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <TeachersInput />
          </CardContent>
        </Card>
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Teachers Table</CardTitle>
          </CardHeader>
          <CardContent>
            <TeachersTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeachersSection;
