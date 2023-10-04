import {
  faBalanceScale,
  faFileAlt,
  faHome,
  faInfoCircle,
  faQuestionCircle,
  faVideo
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import './Navbar.css'
const Navbarlist = () => {
  const location = useLocation();

  const navbarList = [
    // {
    //   title: "Chatbot",
    //   url: "/chatbot",
    //   cName: "Navlinks",
    //   icon: faHome,
    // },
    {
      title: "Home",
      url: "/",
      cName: "Navlinks",
      // icon: faInfoCircle,
    },
    {
      title: "Report",
      url: "/report",
      cName: "Navlinks",
      // icon: faVideo,
    },
    {
      title: "Dashboard",
      url: "/dashboard",
      cName: "Navlinks",
    },
    {
      title : "Premium",
      url:"/getPremium",
      cName :"Navlinks",
      // icon: faBalanceScale,
    },
     {
      title : "Reports",
      url:"/allreports",
      cName :"Navlinks",
      // icon: faBalanceScale,
    }
  ];

  return (
    <>
      {navbarList.map((item, index) => {
        const isActive = location.pathname === item.url;
        const iconClass = isActive ? "" : "";
        const linkClass = isActive ? "active" : "";
        return (
          <div>
            <li key={index} className={linkClass}>
              <Link to={item.url} className={`${item.cName} Navlinks`}>
                <FontAwesomeIcon icon={item.icon} className={iconClass} />
                {item.title}
              </Link>
            </li>
          </div>
        );
      })}
    </>
  );
};

export default Navbarlist;
