import { FC, useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  Menu,
  X,
  Home,
  QrCode,
  BookMarked,
  User,
  Bot,
  MapPinned,
  BookPlus,
  Bell,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useMediaQuery } from "react-responsive";
import { checkUnreadNoticeService } from "../../services/noticeService";

const Header: FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAdmin } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const isWideScreen = useMediaQuery({ query: "(min-width: 1280px)" });
  const [unreadCount, setUnreadCount] = useState(0);
  const [isHidden, setIsHidden] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  useEffect(() => {
    if (!isAdmin) return;

    const fetchUnreadCount = async () => {
      const response = await checkUnreadNoticeService();
      if (response && response.newNoticeNumber !== undefined) {
        setUnreadCount(response.newNoticeNumber);
        setIsHidden(false);
      }
    };
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 10000);

    return () => clearInterval(interval);
  }, [isAdmin]);

  const pageTitles: { [key: string]: string } = {
    "/bookshelf": "내 책장",
    "/qrcode": "모바일 회원증",
    "/my": "마이 페이지",
    "/admin/add": "도서 관리",
    "/admin/robot": "로봇 관리",
    "/admin/collection": "회수 현황",
  };

  const currentTitle = pageTitles[location.pathname] || "LibrAIry";

  const commonLinks = [
    { to: "/", icon: <Home size={20} />, label: "홈" },
    { to: "/bookshelf", icon: <BookMarked size={20} />, label: "내 책장" },
    { to: "/qrcode", icon: <QrCode size={20} />, label: "모바일 회원증" },
    { to: "/my", icon: <User size={20} />, label: "마이" },
  ];

  const adminLinks = [
    { to: "/admin/add", icon: <BookPlus size={20} />, label: "도서 관리" },
    { to: "/admin/robot", icon: <Bot size={20} />, label: "로봇 관리" },
    {
      to: "/admin/collection",
      icon: <MapPinned size={20} />,
      label: "회수 현황",
    },
  ];

  const menuLinks = isAdmin ? [...commonLinks, ...adminLinks] : commonLinks;

  const renderMenuItems = () => (
    <ul
      className={`flex ${isWideScreen ? "flex-row space-x-4" : "flex-col space-y-4"}`}
    >
      {menuLinks.map((link) => (
        <motion.li
          key={link.to}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Link
            to={link.to}
            onClick={() => !isWideScreen && toggleMenu()}
            className="flex items-center p-2 text-gray-700 transition-colors duration-200 hover:text-orange"
          >
            {link.icon}
            <span className="ml-2 text-sm">{link.label}</span>
          </Link>
        </motion.li>
      ))}

      <motion.li whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <button
          onClick={() => {
            logout();
            if (!isWideScreen) toggleMenu();
          }}
          className="flex items-center p-2 text-gray-700 transition-colors duration-200 hover:text-orange"
        >
          <LogOut size={20} />
          <span className="ml-2 text-sm">로그아웃</span>
        </button>
      </motion.li>
    </ul>
  );

  return (
    <header className="sticky top-0 z-50 shadow-sm bg-snow">
      <div className="container px-4 mx-auto">
        <div className="flex items-center justify-between py-4 sm:py-2">
          <div className="flex items-center space-x-2">
            {location.pathname !== "/" && (
              <motion.button
                onClick={() => navigate(-1)}
                className="p-2 text-gray-600 hover:text-orange"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <ChevronLeft size={24} />
              </motion.button>
            )}
            <h1
              className={`text-xl font-bold text-orange ${
                currentTitle === "LibrAIry" ? "cursor-pointer" : ""
              }`}
              onClick={() => {
                if (currentTitle === "LibrAIry") navigate("/");
              }}
            >
              {currentTitle}
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            {isWideScreen && user && renderMenuItems()}

            {user ? (
              <>
                {!isWideScreen && (
                  <motion.button
                    className="p-2 text-gray-600 hover:text-orange"
                    onClick={toggleMenu}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                  </motion.button>
                )}
                {isAdmin && (
                  <motion.button
                    onClick={() => {
                      navigate("/admin/notification");
                      setIsHidden(true);
                    }}
                    className="p-2 text-gray-600 hover:text-orange"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    {" "}
                    <div className="relative">
                      <Bell size={24} />
                      {unreadCount > 0 && !isHidden && (
                        <span className="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-500 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </div>
                  </motion.button>
                )}
              </>
            ) : (
              <motion.button
                onClick={() => navigate("/login")}
                className="px-4 py-2 text-snow transition-colors duration-200 bg-orange-500 rounded-4xl hover:bg-orange-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                로그인
              </motion.button>
            )}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {user && !isWideScreen && isMenuOpen && (
          <motion.nav
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="absolute left-0 right-0 shadow-lg bg-snow"
          >
            <div className="container px-4 py-2 mx-auto">
              {renderMenuItems()}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
