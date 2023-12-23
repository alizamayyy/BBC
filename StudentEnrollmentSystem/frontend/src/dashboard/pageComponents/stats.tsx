import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import axios from "axios";
import { useEffect, useState } from "react";

const Stats = () => {
    const [totalStudents, setTotalStudents] = useState(null);
    const [totalTeachers, setTotalTeachers] = useState(null);
    const [totalClasses, setTotalClasses] = useState(null);
    const [totalCourses, setTotalCourses] = useState(null);
    const [totalAdmins, setTotalAdmins] = useState(null);

    useEffect(() => {
        // Fetch total students count from the API
        const fetchTotalStudents = async () => {
            try {
                const response = await axios.get("http://localhost:5000/student/count");
                setTotalStudents(response.data.count);
            } catch (error) {
                console.error("Error fetching total students:", error);
            }
        };

        // Fetch total teachers count from the API
        const fetchTotalTeachers = async () => {
            try {
                const response = await axios.get("http://localhost:5000/teacher/count");
                setTotalTeachers(response.data.count);
            } catch (error) {
                console.error("Error fetching total teachers:", error);
            }
        };

        // Fetch total classes count from the API
        const fetchTotalClasses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/class/count");
                setTotalClasses(response.data.count);
            } catch (error) {
                console.error("Error fetching total classes:", error);
            }
        };

        // Fetch total courses count from the API
        const fetchTotalCourses = async () => {
            try {
                const response = await axios.get("http://localhost:5000/course/count");
                setTotalCourses(response.data.count);
            } catch (error) {
                console.error("Error fetching total courses:", error);
            }
        };

        // Fetch total admins count from the API
        const fetchTotalAdmins = async () => {
            try {
                const response = await axios.get("http://localhost:5000/admin/count");
                setTotalAdmins(response.data.count);
            } catch (error) {
                console.error("Error fetching total admins:", error);
            }
        };

        fetchTotalStudents();
        fetchTotalTeachers();
        fetchTotalClasses();
        fetchTotalCourses();
        fetchTotalAdmins();
    }, []); // Empty dependency array ensures the effect runs only once on component mount

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6 mb-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Academic Year</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">2023-2024</div>
                    <p className="text-xs text-muted-foreground">school year</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                        <circle cx="9" cy="7" r="4" />
                        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                </CardHeader>
                <CardContent>
                    {totalStudents !== null ? (
                        <>
                            <div className="text-2xl font-bold">{totalStudents}</div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Teachers</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                    </svg>
                </CardHeader>
                <CardContent>
                    {totalTeachers !== null ? (
                        <>
                            <div className="text-2xl font-bold">{totalTeachers}</div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Classes</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                    </svg>
                </CardHeader>
                <CardContent>
                    {totalClasses !== null ? (
                        <>
                            <div className="text-2xl font-bold">{totalClasses}</div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <rect width="20" height="14" x="2" y="5" rx="2" />
                        <path d="M2 10h20" />
                    </svg>
                </CardHeader>
                <CardContent>
                    {totalCourses !== null ? (
                        <>
                            <div className="text-2xl font-bold">{totalCourses}</div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total Admins</CardTitle>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        className="h-4 w-4 text-muted-foreground"
                    >
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
                    </svg>
                </CardHeader>
                <CardContent>
                    {totalAdmins !== null ? (
                        <>
                            <div className="text-2xl font-bold">{totalAdmins}</div>
                        </>
                    ) : (
                        <p>Loading...</p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Stats;
