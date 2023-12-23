import { Button } from "./components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { CalendarDateRangePicker } from "@/dashboard/pageComponents/date-range-picker";
import { MainNav } from "@/dashboard/pageComponents/main-nav";
// import { Overview } from "@/dashboard/pageComponents/overview";
// import { RecentSales } from "@/dashboard/pageComponents/recent-sales";
import { Search } from "@/dashboard/pageComponents/search";
import TeamSwitcher from "@/dashboard/pageComponents/team-switcher";
import { UserNav } from "@/dashboard/pageComponents/user-nav";
import TotalStats from "./dashboard/pageComponents/total-stats";
// import { Card, CardHeader, CardContent } from "./components/ui/card";
// import { CardTitle, CardDescription } from "./components/ui/card";
// import { Overview } from "./dashboard/pageComponents/overview";
// import { RecentSales } from "./dashboard/pageComponents/recent-sales";
// import Stats from "./dashboard/pageComponents/stats";
import StudentsSection from "./dashboard/pageComponents/students-section";
import TeachersSection from "./dashboard/pageComponents/teachers-section";
import ClassesSection from "./dashboard/pageComponents/classes-section";
import CoursesSection from "./dashboard/pageComponents/courses-section";
import AdminsSection from "./dashboard/pageComponents/admins-section";

export default function DashboardPage() {
  return (
    <>
      <div className="md:hidden"></div>
      <div className="hidden flex-col md:flex">
        <div className="border-b">
          <div className="flex h-16 items-center px-4">
            <TeamSwitcher />
            <MainNav className="mx-6" />
            <div className="ml-auto flex items-center space-x-4">
              <Search />
              <UserNav />
            </div>
          </div>
        </div>
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            <div className="flex items-center space-x-2">
              <CalendarDateRangePicker />
              <Button>Download</Button>
            </div>
          </div>
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList className="grid w-full grid-cols-6 gap-4 rounded-lg h-fit">
              <TabsTrigger value="overview" className="rounded-lg m-1">
                Overview
              </TabsTrigger>
              <TabsTrigger value="students" className="rounded-lg m-1">
                Students
              </TabsTrigger>
              <TabsTrigger value="teachers" className="rounded-lg m-1">
                Teachers
              </TabsTrigger>

              <TabsTrigger value="courses" className="rounded-lg m-1">
                Courses
              </TabsTrigger>
              <TabsTrigger value="classes" className="rounded-lg m-1">
                Classes
              </TabsTrigger>
              <TabsTrigger value="admins" className="rounded-lg m-1">
                Admins
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <TotalStats />
            </TabsContent>
            <TabsContent value="students">
              <StudentsSection />
            </TabsContent>
            <TabsContent value="teachers">
              <TeachersSection />
            </TabsContent>

            <TabsContent value="courses">
              <CoursesSection />
            </TabsContent>
            <TabsContent value="classes">
              <ClassesSection />
            </TabsContent>
            <TabsContent value="admins">
              <AdminsSection />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
