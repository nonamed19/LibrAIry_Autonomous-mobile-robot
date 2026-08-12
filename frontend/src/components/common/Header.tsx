import { type FC, useEffect, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Bell, BookMarked, Bot, LogIn, LogOut, Menu, Plus, QrCode, ShieldCheck, UserRound, X } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { checkUnreadNoticeService } from "../../services/noticeService";

type NavItem = { to: string; label: string; icon: typeof BookMarked };

const memberItems: NavItem[] = [
  { to: "/bookshelf", label: "내 책장", icon: BookMarked },
  { to: "/qrcode", label: "모바일 회원증", icon: QrCode },
  { to: "/my", label: "내 정보", icon: UserRound },
];

const adminItems: NavItem[] = [
  { to: "/admin/add", label: "도서 관리", icon: Plus },
  { to: "/admin/robot", label: "로봇 관제", icon: Bot },
  { to: "/admin/collection", label: "회수 현황", icon: ShieldCheck },
];

const Header: FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!isAdmin) return;
    const refresh = async () => {
      const data = await checkUnreadNoticeService();
      setUnreadCount(data?.newNoticeNumber ?? 0);
    };
    void refresh();
    const timer = window.setInterval(refresh, 30_000);
    return () => window.clearInterval(timer);
  }, [isAdmin]);

  if (pathname === "/admin/robot/screen") return null;

  const items = user ? [...memberItems, ...(isAdmin ? adminItems : [])] : [];
  const navigation = (
    <nav className="site-nav" aria-label="주 메뉴">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink key={to} to={to} className={({ isActive }) => `site-nav-link ${isActive ? "active" : ""}`}>
          <Icon size={17} /> {label}
        </NavLink>
      ))}
    </nav>
  );

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link className="brand" to="/" aria-label="LibrAIry 홈">
          <span className="brand-mark">L</span>
          <span>LibrAIry</span>
          <small>SMART LIBRARY</small>
        </Link>

        <div className="desktop-nav">{navigation}</div>

        <div className="header-actions">
          {user ? (
            <>
              {isAdmin && (
                <NavLink to="/admin/notification" className="icon-button" aria-label="알림">
                  <Bell size={19} />
                  {unreadCount > 0 && <span className="notification-count">{unreadCount > 99 ? "99+" : unreadCount}</span>}
                </NavLink>
              )}
              <span className="user-greeting"><b>{user.userName}</b>님</span>
              <button className="quiet-button desktop-only" onClick={() => void logout()}><LogOut size={17} /> 로그아웃</button>
              <button className="icon-button mobile-only" onClick={() => setMenuOpen((open) => !open)} aria-label="메뉴 열기">
                {menuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </>
          ) : (
            <Link to="/login" className="login-link"><LogIn size={17} /> 로그인</Link>
          )}
        </div>
      </div>

      {user && menuOpen && (
        <div className="mobile-menu">
          {navigation}
          <button className="quiet-button" onClick={() => void logout()}><LogOut size={17} /> 로그아웃</button>
        </div>
      )}
    </header>
  );
};

export default Header;
