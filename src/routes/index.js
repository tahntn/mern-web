
import AdminPage from "../adminPage/adminPage/adminPage";
import AboutPage from "../page/AboutPage/AboutPage";
import CategoryPage from "../page/CategoryPage/CategoryPage";
import HomePage from "../page/HomePage/HomePage";
import LoginPage from "../page/LoginPage/LoginPage";
import OrderPage from "../page/OrderPage/OrderPage";
import ProductPage from "../page/ProductPage/ProductPage";
import ProfilePage from "../page/ProfilePage/ProfilePage";
import SignupPage from "../page/SignupPage/SignupPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        isShowHeader: true,
    },
    {
        path: '/about',
        page: AboutPage,
        isShowHeader: true,
    },
    {
        path: '/profile',
        page: ProfilePage,
        isShowHeader: true,
    },
    {
        path: '/order',
        page: OrderPage,
        isShowHeader: true,
    },
    {
        path: '/product',
        page: ProductPage,
        isShowHeader: true,
    },
    {
        path: '/category',
        page: CategoryPage,
        isShowHeader: true,
    },
    {
        path: '/product-detail/:id',
        page: ProductPage,
        isShowHeader: true,
    },
    // k co header
    {
        path: '/login',
        page: LoginPage,
        isShowHeader: false,
    },
    {
        path: '/signup',
        page: SignupPage,
        isShowHeader: false,
    },
    //admin
    {
        path: '/system/admin',
        page: AdminPage,
        isShowHeader: false,
        isAdmin: true,
    },
]