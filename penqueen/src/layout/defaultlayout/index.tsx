import React ,{useState,useEffect}from 'react';
import './index.css';
import Sidebar from '../../components/sidebar/sidebar';
import Header from '../../components/header/header';
 
interface Props {
  children: React.ReactNode;
}
 
const DefaultLayout: React.FC<Props> = ({ children }) => {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
const [isMobile, setIsMobile] = useState(false);

      useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobile(true);
        setSidebarOpen(false); 
      } else {
        setIsMobile(false);
        setSidebarOpen(true); 
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
 
    <>
      <div className="main-container d-flex">
         {(!isMobile || (isMobile && sidebarOpen)) && (
        <div className="left-container" style={{ width: sidebarOpen ? "270px" : "80px", overflow: "hidden",transition: "width 0.3s ease",  }}>
           <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        </div>
          )}
        <div className="right-container" 
        style={{ 
          flexGrow: 1,
          transition: "all 0.3s ease", 
          width: sidebarOpen ? "calc(100% - 250px)" : "100%", 
          }}>
            <Header
              toggleSidebar={toggleSidebar}
              companyName="PenQueen"
              userName="User Name"
              staff="Manager"
            />
            <div className="content-area" style={{marginTop:  isMobile ? "100px": "70px" }}>
              {children}
            </div>
        </div>
        {isMobile && sidebarOpen && (
        <div
          className="overlay"
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            zIndex: 1040,
          }}
        ></div>
      )}
      </div>
    </>
 
 
 
 
 
  );
};
 
export default DefaultLayout;