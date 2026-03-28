import { Routes, Route } from "react-router-dom";

// 16  Public pages
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ProductListing from "../pages/ProductListing";
import ProductDetail from "../pages/ProductDetail";
import CartPage from "../pages/CartPage";
import SearchPage from "../pages/SearchPage";
import WishlistPage from "../pages/WishlistPage";
import Checkout from "../pages/Checkout";
import MyOrders from "../pages/MyOrders";
import OrderDetails from "../pages/OrderTracking";
import WriteReview from "../pages/WriteReview";
import VerifyEmailOtp from "../pages/VerifyEmailOtp";
import VerifyPhoneOtp from "../pages/VerifyPhoneOtp";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword from "../pages/ResetPassword";
// 6  Admin  pages
import AdminLayout from "../layouts/AdminLayout";
import CreateProductPage from "../pages/admin/products/CreateProductPage";
import AdminOrderStatus from "../pages/AdminOrderStatus";
import Permissions from "../pages/admin/Permissions";
import Roles from "../pages/admin/Roles";
import AssignRole from "../pages/admin/AssignRole";
import RbacPermissionPage from "../pages/RbacPermissionPage";

export default function AppRoutes() {
  const userId = localStorage.getItem("userId");
return (
    <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmailOtp />} />
            <Route path="/verify-phone" element={<VerifyPhoneOtp />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/products" element={<ProductListing />} />
            <Route path="/product/:productId" element={<ProductDetail />} />
            <Route path="/cart/:userId" element={<CartPage />} />
            <Route path="/wishlist/:userId" element={<WishlistPage />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/orders/my" element={<MyOrders />} />
            <Route path="/orders/:orderNumber" element={<OrderDetails />} />
            <Route path="/review/:productId/:orderNumber" element={<WriteReview />}/>
          
                {/* admin */}
<Route path="/admin" element={<AdminLayout />}>

            <Route path="sellerpannel" element={<CreateProductPage />}/>
            <Route path="orders" element={<AdminOrderStatus />} />
            <Route path="create/permissions" element={<Permissions />} />
            <Route path="create/roles" element={<Roles />} />
            <Route path="assign-role" element={<AssignRole />} />
            <Route path="rbac/permissions" element={<RbacPermissionPage />}/>
</Route>

</Routes>
  );
}
