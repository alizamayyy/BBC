import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import AdminsInput from "./admins-input";
import { AdminsTable } from "./admins-table";
import Stats from "./stats";

const AdminsSection = () => {
  return (
    <div>
      <Stats />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-2 h-fit mt-56">
          <CardHeader>
            <CardTitle>Add Admins</CardTitle>
          </CardHeader>
          <CardContent className="pl-2">
            <AdminsInput />
          </CardContent>
        </Card>
        <Card className="col-span-5">
          <CardHeader>
            <CardTitle>Admins Table</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminsTable />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminsSection;
