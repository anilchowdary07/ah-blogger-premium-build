
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { ScrollArea } from "@/components/ui/scroll-area";

const Layout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
