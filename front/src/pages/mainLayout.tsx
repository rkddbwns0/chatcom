import { Outlet } from "react-router";
import { BottomNav } from "../components/nav/bottomNav";

export default function MainLayout() {
    return (
        <div>
            <Outlet />
            <BottomNav />
        </div>
    )
}
