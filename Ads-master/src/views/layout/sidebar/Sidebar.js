import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AiOutlineMenu } from 'react-icons/ai';
import { GoChevronDown } from 'react-icons/go';
import { BiCertification } from 'react-icons/bi';
import Header from '../header/Header';
import { useLocation } from "react-router-dom"
import { DrawerScreens} from "../../other/shared/drawer"

function Sidebar({ subpage }) {
    const [path, setpath] = useState('/dashboard')
    const location = useLocation()
    const [open, setOpen] = useState(false)
    const [openScreen, setOpenScreen] = useState(false)

    useEffect(() => {
        setpath(location.pathname)
        window.scroll(0, 0)
    }, [location])
    
    const Menu = () => {
        return DrawerScreens.map((e, i) => {
            return (
                <React.Fragment key={i}>
                    {e.submenu
                        ?
                        <div key={i}>
                            <li className={`sidebar-dropdown py-2 me-3 ${openScreen}`} id={e.id} key={i}>
                                <Link to={e.path}>
                                    <span className='d-flex align-items-center'>
                                        <e.icon style={{ fontSize: '18px' }} className='text-light' />
                                        <h6 className='mx-3 my-0 sidebar_text' style={{ fontSize: '14px' }}>{e.name}</h6>
                                    </span>
                                    <GoChevronDown style={{ fontSize: '18px' }} className='sidebar_text' />
                                </Link>
                            </li>
                            <div className="sidebar-submenu" style={{ display: `${openScreen ? 'block' : 'none'}` }}>
                                <ul className='p-0' style={{ listStyle: 'none' }}>
                                    {e.submenu.map((menu, i) => {
                                        return (
                                            <li className={`py-2 ps-4 me-3 ${path === menu.path && 'MenuActive'}`} key={i} >
                                                <Link to={menu.path}>
                                                    <span className='d-flex align-items-center'>
                                                        <BiCertification style={{ fontSize: '14px', color: "#fff" }} />
                                                        <h6 className='mx-2 my-0 text-light' style={{ fontSize: '14px' }}>{menu.name}</h6>
                                                    </span>
                                                </Link>
                                            </li>
                                        )
                                    })}
                                </ul>   
                            </div>
                        </div>
                        :
                        <li className={`py-2 me-3 ${path === e.path && 'MenuActive'}`} key={i} onClick={() => { setOpenScreen(!true) }}>
                            <Link to={e.path}>
                                <span className='d-flex align-items-center'>
                                    <e.icon style={{ fontSize: '18px' }} className='sidebar_text' />
                                    <h6 className='mx-3 my-0 sidebar_text' style={{ fontSize: '14px' }}>{e.name}</h6>
                                </span>
                            </Link>
                        </li>
                    }
                </React.Fragment>
            )
        })
    }

    return (
        <div>
            <div className={`page-wrapper chiller-theme ${!open && 'toggled'} `}>
                <nav id="sidebar" className="sidebar-wrapper">
                    <div className="sidebar-content">
                        <div className="sidebar-header my-1 d-flex">
                            <div className="w-25 d-flex align-items-center">
                                <div id="close-sidebar " className='ms-2' onClick={() => { setOpen(!open) }}>
                                    <AiOutlineMenu className='sidebar_text' style={{ fontSize: "24px" }} />
                                </div>
                            </div>
                        </div>
                        <div className="sidebar-menu">
                            <ul style={{ listStyle: "none", padding: '0' }}>
                                <Menu />
                            </ul>
                        </div>
                    </div>
                </nav>
                <main className="page-content">
                    <div className="">
                        <Header setOpen={setOpen} open={open} />
                        {subpage}
                    </div>
                </main>
            </div>
        </div>
    )
}

export default Sidebar