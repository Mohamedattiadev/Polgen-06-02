import { createBrowserRouter } from "react-router-dom";
import App from "../App.jsx";
import About from "../pages/Home/About/About.jsx";
import Contact from "../pages/Home/Contact/Contact.jsx";
import Main from "../pages/Home/Main/Main.jsx";
import LoginPage from "../pages/Home/LoginPage/LoginPage.jsx";
import RegisterPage from "../pages/Home/RegisterPage/RegisterPage.jsx";
import Ar_Ge from "../pages/Home/Ar_Ge/Ar_Ge.jsx";
import Services from "../pages/Home/Services/Services.jsx";
import Covid_19 from "../pages/Home/Covid_19/Covid_19.jsx";
import Error404 from "../components/shared/Error404/Error404.jsx";
import UserPageLayout from "../pages/Order/User/UserPageLayout/UserPageLayout.jsx";
import UserDashboard from "../pages/Order/User/UserDashboard/UserDashboard.jsx";
import AdminPageLayout from "../pages/Order/Admin/AdminPageLayout/AdminPageLayout.jsx";
// import AdminDashboard from "../pages/Order/Admin/AdminDashboard/AdminDashboard.jsx";
import ProtectedRoute from "../components/shared/ProtectedRoute/ProtectedRoute.jsx";
import ForgotPassword from "../components/HomeComponent/Forgot_password/ForgotPassword.jsx";
import ResetPassword from "../components/HomeComponent/Reset_Password/ResetPassword.jsx";

// New imports for added pages
import AddProduct from "../pages/Order/User/AddProduct/AddProduct.jsx";
// import AdminTables from "../pages/Order/Admin/"
import Orders from "../pages/Order/Admin/AdminOrders/AdminOrders.jsx";
import UserOrder from "../pages/Order/User/UserOrder/UserOrder.jsx";
import UserProfile from "../pages/Order/User/UserProfile/UserProfile.jsx";
import AdminApprovedOrders from "../pages/Order/Admin/AdminApprovedOrders/AdminApprovedOrders.jsx";
import AdminApprovingOrders from "../pages/Order/Admin/AdminApprovingOrders/AdminApprovingOrders.jsx";
import AdminSynthingOrders from "../pages/Order/Admin/AdminSynthingOrders/AdminSynthingOrders.jsx";
import AdminApproveEmail from "../pages/Order/Admin/AdminApproveEmail/AdminApproveEmail.jsx";
import AdminFinishedOrders from "../pages/Order/Admin/AdminFinishedOrders/AdminFinishedOrders.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <Error404 />,
    children: [
      { path: "/", element: <Main /> },
      { path: "about", element: <About /> },
      { path: "contact", element: <Contact /> },
      { path: "login", element: <LoginPage /> },
      { path: "forgot_password", element: <ForgotPassword /> },
      { path: "reset_password/:token", element: <ResetPassword /> },
      { path: "register", element: <RegisterPage /> },
      { path: "Ar-Ge", element: <Ar_Ge /> },
      { path: "services", element: <Services /> },
      { path: "covid_19_test", element: <Covid_19 /> },
    ],
  },
  {
    path: "/user/:username",
    element: (
      <ProtectedRoute requiredRole="user">
        <UserPageLayout />
      </ProtectedRoute>
    ),
    errorElement: <Error404 />, // This will handle all unknown routes
    children: [
      { index: true, element: <UserDashboard /> },
      { path: "dashboard", element: <UserDashboard /> },
      { path: "add-product", element: <AddProduct /> },
      { path: "order", element: <UserOrder /> },
      { path: "profile", element: <UserProfile /> },
    ],
  },
  {
    path: "/admin/:username",
    element: (
      <ProtectedRoute requiredRole="admin">
        <AdminPageLayout />
      </ProtectedRoute>
    ),
    errorElement: <Error404 />, // This will handle all unknown routes
    children: [
      { index: true, element: <Orders /> },
      // { path: "dashboard", element: <AdminDashboard /> },
      // { path: "manage-products", element: <AdminTables /> },
      { path: "orders", element: <Orders /> },
      { path: "approvedOrders", element: <AdminApprovedOrders /> },
      { path: "finishedOrders", element: <AdminFinishedOrders /> },
      { path: "approvingOrders", element: <AdminApprovingOrders /> },
      { path: "synthingOrders", element: <AdminSynthingOrders /> },
      { path: "approveMails", element: <AdminApproveEmail /> },
    ],
  },
]);

export default router;
