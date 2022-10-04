import Login from "../Pages/Login";
import PageNotFound from "../Pages/PageNotFound";
import Home from "../Pages/Home";
import Project from "../Pages/Project";
import ProtectedRoute from "../Pages/ProtectedRoute";
import ProjectDetail from "../Pages/ProjectDetail";
import Members from "../Pages/ProjectDetail/Members";
import TaskDetail from "../Pages/TaskDetail";
import Register from "../Pages/Register";
import Profile from "../Pages/Profile";
import AdminLogin from "../Pages/AdminLogin";
import AdminHome from "../Pages/AdminHome";
import AdminRegister from "../Pages/AdminRegister";

const routes = [
    {
        path: "/",
        element: (
            <ProtectedRoute>
                <Home />
            </ProtectedRoute>
        ),
    },
    {
        path: "/admin",
        element: <AdminHome />,
    },
    {
        path: "/admin/login",
        element: <AdminLogin />,
    },
    {
        path: "/admin/register",
        element: <AdminRegister />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/register",
        element: <Register />,
    },
    {
        path: "/profile",
        element: (
            <ProtectedRoute>
                <Profile />
            </ProtectedRoute>
        ),
    },
    {
        path: "/project/:id/members",
        element: (
            <ProtectedRoute>
                <Members />
            </ProtectedRoute>
        ),
    },
    {
        path: "/project/:id/:taskid",
        element: (
            <ProtectedRoute>
                <TaskDetail />
            </ProtectedRoute>
        ),
    },
    {
        path: "/project/:id",
        element: (
            <ProtectedRoute>
                <ProjectDetail />
            </ProtectedRoute>
        ),
    },
    {
        path: "/projects",
        element: (
            <ProtectedRoute>
                <Project />
            </ProtectedRoute>
        ),
    },
    {
        path: "/*",
        element: <PageNotFound />,
    },
];

export default routes;
