
import AdminPage from "../page/AdminPage/AdminPage";
import AboutPage from "../page/AboutPage/AboutPage";
import CategoryPage from "../page/CategoryPage/CategoryPage";
import DetailsOrderPage from "../page/DetailsOrderPage/DetailsOrderPage";
import HomePage from "../page/HomePage/HomePage";
import LoginPage from "../page/LoginPage/LoginPage";
import MyOrderPage from "../page/MyOrderPage/MyOrderPage";
import OrderPage from "../page/OrderPage/OrderPage";
import OrderSuccessPage from "../page/OrderSuccessPage/OrderSuccessPage";
import PaymentPage from "../page/PaymentPage/PaymentPage";
import ProductPage from "../page/ProductPage/ProductPage";
import ProfilePage from "../page/ProfilePage/ProfilePage";
import SignupPage from "../page/SignupPage/SignupPage";
import ErrorPage from "../page/ErrorPage/ErrorPage";
import ContactPage from "../page/ContactPage/ContactPage";
import TestPage from "../page/TestPage/TestPage";

export const routes = [
    {
        path: '/',
        page: HomePage,
        // isShowHeader: true,
        isNoHome: true
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
        path: '/my-order',
        page: MyOrderPage,
        isShowHeader: true
    },
    {
        path: '/details-order/:id',
        page: DetailsOrderPage,
        isShowHeader: true
    },
    {
        path: '/payment',
        page: PaymentPage,
        isShowHeader: true,
    },
    {
        path: '/orderSuccess',
        page: OrderSuccessPage,
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
    {
        path: '/*',
        page: ErrorPage,
        isShowHeader: true,
    },
    {
        path: '/contact',
        page: ContactPage,
        // isShowHeader: true,
        isNoHome: true
    },
    {
        path: '/test',
        page: TestPage,
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