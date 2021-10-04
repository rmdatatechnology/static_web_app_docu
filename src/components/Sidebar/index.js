import React from "react";
import { Link, navigate } from "gatsby";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import ExpandLessIcon from "@material-ui/icons/ExpandLess";
import Collapse from "@material-ui/core/Collapse";
import { useStaticQuery, graphql } from 'gatsby';
import { useLocale } from '../../hooks/locale';
import { useProduct } from '../../hooks/products';
import LocalizedLink from '../LocalizedLink';
import * as S from './styled';

function GetItems()
{
	 const { product } = useProduct();
	 
	 if(product.toString().toLowerCase() === "geodesigner")
	 {
		 return require('../../../documentation/toc/geodesigner.json');
	 }
	 else if(product.toString().toLowerCase() === "geomapperse")
	 {
		 return require('../../../documentation/toc/geomapper.json');;
	 }
	 else if(product.toString().toLowerCase() === "geodesktop")
	 {
		 return require('../../../documentation/toc/geodesktop.json');;
	 }
	  else if(product.toString().toLowerCase() === "scripting")
	 {
		 return require('../../../documentation/toc/geomapper.json');;
	 }
	 else
	 {
		 return require('../../../documentation/toc/geomapper.json');;
	 }
}

function SidebarItem({ depthStep = 10, depth = 0, expanded, item, ...rest }) {
  const [collapsed, setCollapsed] = React.useState(true);
  const { title, items, de, it, fr, Icon, url, onClick: onClickProp } = item;
  const { locale } = useLocale();

  function toggleCollapse() {
    setCollapsed(prevValue => !prevValue);
  }
  
  function onClick(e) {
	e.preventDefault();
    if (Array.isArray(items)) {
      toggleCollapse();
    }
	else
	{
		const urlMain = window.location.pathname;
		const isLocale = urlMain.includes(`/${locale}/`);

		if(isLocale === false && locale === "de")
			return navigate(`/${item.url}`);
		else
			return navigate(`/${locale}/${item.url}`);
	}
    if (onClickProp) {
      onClickProp(e, item);
    }
  }

  let expandIcon;
 
  if (Array.isArray(items) && items.length) {
    expandIcon = !collapsed ? (
      <ExpandLessIcon
        className={
          "sidebar-item-expand-arrow" + " sidebar-item-expand-arrow-expanded"
        }
      />
    ) : (
      <ExpandMoreIcon className="sidebar-item-expand-arrow" />
    );
  }
  
  let label = item.de;
  if(locale === "it")
  {
	  label = item.it;
  }
  else if(locale === "fr")
  {
	  label = item.fr;
  }

  return (
    <>
      <ListItem
        className="sidebar-item"
        onClick={onClick}
        button
        dense
        {...rest}
      >
		<div
          style={{ paddingLeft: depth * depthStep }}
          className="sidebar-item-content"
        >
          {Icon && <Icon className="sidebar-item-icon" fontSize="small" />}
          <div className="sidebar-item-text">{label}</div>
        </div>
        {expandIcon}
      </ListItem>
      <Collapse in={!collapsed} timeout="auto" unmountOnExit>
        {Array.isArray(items) ? (
          <List disablePadding dense>
            {items.map((subItem, index) => (
              <React.Fragment key={`${subItem.title}${index}`}>
                {subItem === "divider" ? (
                  <Divider style={{ margin: "6px 0" }} />
                ) : (
                  <S.SidebarLink>
				  <SidebarItem
                    depth={depth + 1}
                    depthStep={depthStep}
                    item={subItem}
                  />
				  </ S.SidebarLink>
                )}
              </React.Fragment>
            ))}
          </List>
        ) : null}
      </Collapse>
    </>
  );
}


function Sidebar({ depthStep, depth, expanded }) {
		
  const items = GetItems();
		
  return (
    <S.Sidebar>
      <List disablePadding dense>
        {items.map((sidebarItem, index) => (
          <React.Fragment key={`${sidebarItem.title}${index}`}>
            {sidebarItem === "divider" ? (
              <Divider style={{ margin: "6px 0" }} />
            ) : (
              <SidebarItem
                depthStep={depthStep}
                depth={depth}
                expanded={expanded}
                item={sidebarItem}
              />
            )}
          </React.Fragment>
        ))}
      </List>
    </S.Sidebar>
  );
}

export default Sidebar;