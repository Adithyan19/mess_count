import { Navigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import { ProtectedRoute } from "../components/layout/ProtectedRoute";
import StudentDashboard from "../components/dashboards/StudentDashboard";
import MessStaffDashboard from "../components/dashboards/MessStaffDashboard";
import AdminDashboard from "../components/dashboards/AdminDashboard";
import SuperAdminDashboard from "../components/dashboards/SuperAdminDashboard";
import Login from "../components/auth/login";

import MyMeals from "../components/dashboards/StudentDashboard/MyMeals";
import Poll from "../components/dashboards/StudentRepDashboard/Poll";
import Result from "../components/dashboards/StudentRepDashboard/Result";
import Attendance from "../components/dashboards/AdminDashboard/Attendance";
import ShowUsers from "../components/dashboards/AdminDashboard/ShowUsers";
import Count from "../components/dashboards/MessStaffDashboard/Count";
import AllAttendance from "../components/dashboards/SuperAdminDashboard/AllAttendance";

export const routes = [
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "student",
        element: (
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "student/meals",
        element: (
          <ProtectedRoute allowedRoles={["STUDENT"]}>
            <MyMeals />
          </ProtectedRoute>
        ),
      },
      {
        path: "rep",
        element: (
          <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
            <StudentDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "rep/meals",
        element: (
          <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
            <MyMeals />
          </ProtectedRoute>
        ),
      },
      {
        path: "rep/poll",
        element: (
          <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
            <Poll />
          </ProtectedRoute>
        ),
      },
      {
        path: "rep/results",
        element: (
          <ProtectedRoute allowedRoles={["STUDENT_REP"]}>
            <Result />
          </ProtectedRoute>
        ),
      },
      {
        path: "staff",
        element: (
          <ProtectedRoute allowedRoles={["MESS_STAFF"]}>
            <MessStaffDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "staff/count",
        element: (
          <ProtectedRoute allowedRoles={["MESS_STAFF"]}>
            <Count />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <AdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/users",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <ShowUsers />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin/attendance",
        element: (
          <ProtectedRoute allowedRoles={["ADMIN"]}>
            <Attendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "super-admin",
        element: (
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <SuperAdminDashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "super-admin/attendance",
        element: (
          <ProtectedRoute allowedRoles={["SUPER_ADMIN"]}>
            <AllAttendance />
          </ProtectedRoute>
        ),
      },
      {
        path: "*",
        element: <Navigate to="/student" replace />,
      },
    ],
  },
];
