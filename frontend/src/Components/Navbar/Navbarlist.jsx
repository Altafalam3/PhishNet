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
      title: "DocMaker",
      url: "/docum",
      cName: "Navlinks",
      icon: faInfoCircle,
    },
    {
      title: "Summarizer",
      url: "/textsum",
      cName: "Navlinks",
      icon: faVideo,
    },
    {
      title: "Resources",
      url: "/resource",
      cName: "Navlinks",
      icon: faQuestionCircle,
    },
    {
      title : "Advocates",
      url:"/lawyers",
      cName :"Navlinks",
      icon: faBalanceScale,
    }
  ];
  return (
    <>
      {navbarList.map((item, index) => {
        const isActive = location.pathname === item.url;
        const iconClass = isActive ? "active-icon" : "";
        const linkClass = isActive ? "active" : "";
        return (
          <div>
          <li key={index} className={linkClass}>
            <Link to={item.url} className={`${item.cName}`}>
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
