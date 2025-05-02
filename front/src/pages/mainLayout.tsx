import { Outlet } from "react-router";
import { BottomNav } from "../components/nav/bottomNav";
import "../css/mainLayout.css";

export default function MainLayout() {
    return (
        <div className="main-layout-container">
            <Outlet />
            <BottomNav />
        </div>
    )
}
