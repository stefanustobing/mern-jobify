import Wrapper from "../assets/wrappers/BigSidebar";
import NavLinks from "./NavLinks";
import Logo from "./Logo";
import { useDasboardContext } from "../pages/DashboardLayout";

const BigSidebar = () => {
  const {showSidebar}=useDasboardContext();
  return (
    <Wrapper>
      <div className= {showSidebar ? "sidebar-container": "sidebar-container show-sidebar"}>
        <div className="content">
          <header>
            <Logo />
          </header>
          <NavLinks isBigSidebar/>
        </div>
      </div>
    </Wrapper>
  )
}
export default BigSidebar