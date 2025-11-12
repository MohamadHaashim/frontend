import React, { useState } from "react";
import UserAvatar from "../../../../components/user/UserAvatar";
import { DropdownToggle, DropdownMenu, Dropdown } from "reactstrap";
import { Icon } from "../../../../components/Component";
import { LinkList, LinkItem } from "../../../../components/links/Links";

const User = () => {
  const [open, setOpen] = useState(false);
  const toggle = () => setOpen((prevState) => !prevState);
  const userName = localStorage.getItem("userName");
  const handleSignout = () => {
    localStorage.clear();
    localStorage.removeItem('initialId')
  };

  return (
    <Dropdown isOpen={open} className="user-dropdown" toggle={toggle}>
      <DropdownToggle
        tag="a"
        href="#toggle"
        className="dropdown-toggle"
        onClick={(ev) => {
          ev.preventDefault();
        }}
      >
        <div className="user-toggle">
          <UserAvatar icon="user-alt" className="xs" />
          <div className="user-info d-none d-md-block">
            <div className="user-name dropdown-indicator">{userName}</div>
          </div>
        </div>
      </DropdownToggle>
      <DropdownMenu right className="dropdown-menu-md dropdown-menu-s1">
        <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
          <div className="user-card xs">
            <div className="user-avatar">
              <span>AB</span>
            </div>
            <div className="user-info">
              <span className="lead-text">{userName}</span>
               <span className="sub-text"></span> {/* info@headlinema.com */}
            </div>
          </div>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <LinkItem link="/user/profile/" icon="user-alt" onClick={toggle}>
              Profile
            </LinkItem>
            {/* <LinkItem link="/user/settings/" icon="opt" onClick={toggle}>
              Settings
            </LinkItem> */}
            <LinkItem link="/user/notifications/" icon="bell" onClick={toggle}>
              Notifications
            </LinkItem>
            <LinkItem link="/user/connections/" icon="share-alt" onClick={toggle}>
              Connections
            </LinkItem>



          </LinkList>
        </div>
        <div className="dropdown-inner">
          <LinkList>
            <a href={`${process.env.PUBLIC_URL}/auth-login`} onClick={handleSignout}>
              <Icon name="signout"></Icon>
              <span>Sign Out</span>
            </a>
          </LinkList>
        </div>
      </DropdownMenu>
    </Dropdown>
  );
};

export default User;
