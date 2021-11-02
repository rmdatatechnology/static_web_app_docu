import React, { useState, useRef, useEffect } from 'react';
import { Link, navigate } from "gatsby";
import { useStaticQuery, graphql } from 'gatsby';
import { useLocale } from '../../hooks/locale';
import { useProduct } from '../../hooks/products';
import { useSidebar } from '../../hooks/sidebar';
import LocalizedLink from '../LocalizedLink';
import OpenedSvg from '../../images/opened';
import ClosedSvg from '../../images/closed';
import "../../styles/styles.scss";

const {
  getSidebarItems,
} = require(`../../utils/pageHelper`);



const SidebarItem = ({ className = '', depthStep = 10, depth = 0,  setOpened, opened , item}) => {
  const { locale } = useLocale();
  const { title, items, de, it, fr, Icon, url, onClick: onClickProp } = item;	
  let pathname = typeof window !== 'undefined' ? window.location.pathname : '';
  const active = pathname === ('/' + url) || pathname === url;
  const isAlreadyOpen = opened[url] === true;
  let expanded = isAlreadyOpen || pathname === ('/' + url) || pathname === url || checkForValue(item, pathname, opened);
	  
  const focusDiv = useRef();

  useEffect(() => {
		if (focusDiv) {
		// Our ref has a value, pointing to an HTML element
		// The perfect time to observe it.
		if(focusDiv.current && active) focusDiv.current.focus(); 
			
		}
		 return () => {
			if (focusDiv) {
			// We need to clean up after this ref
			// The perfect time to unobserve it.
			
		}	
    };
	 
	}, [focusDiv]);
  
  const collapse = () => {
	setOpened(url);
  };

  const hasChildren = items && items.length !== 0;
  
  const calculatedClassName = active ? 'sidebarButton active' : 'sidebarButton';
 
  let label = item.de;
  if(locale === "it")
  {
	  label = item.it;
  }
  else if(locale === "fr")
  {
	  label = item.fr;
  }
   
  function onClick(e) {
	e.preventDefault();
    if (hasChildren) {
      collapse();
    }
	else
	{
		const urlM = window.location.pathname;
		const isLocale = urlM.includes(`/${locale}/`);

		if(isLocale === false && locale === "de")
			return navigate(`/${url}`);
		else
			return navigate(`/${locale}/${url}`);
	}
   
  }

  return (
    
    <>
	  {label && (
         <button 
        className={calculatedClassName}
		ref={focusDiv}
        onClick={onClick}
      >
		<div
          style={{ paddingLeft: depth * depthStep }}
        >
          {Icon && <Icon className="sidebar-item-icon" fontSize="small" />}
	  <div>{label}</div>
        </div>
		{hasChildren ? (
		<>
		{expanded ? <OpenedSvg /> : <ClosedSvg />}
		</>
		) : null}
      </button>
      )}

      {expanded && hasChildren ? (
        <ul>
          {items.map((item, index) => (
            <SidebarItem
              setOpened={setOpened}
              opened={opened}
			  item={item}
			  depth={depth + 1}
              depthStep={depthStep}
            />
          ))}
        </ul>
      ) : null}
    </>
	
	
  );
};

function checkForValue(item, url, opened) {
    
	if(!item)
		return false;
	
	let expanded = false;
	const hasChildren = item.items && item.items.length !== 0;
	if(hasChildren)
	{
		return item.items.some(function(element) 
		{ 
			return checkForValue(element, url, opened)
		});
	}
	else
	{
		const alreadyOpened = opened[item.url] === true;
		expanded = alreadyOpened || url === item.url || url === item.url + '/' || url === '/' + item.url;
		opened[item.url] = expanded;
	}
	return expanded;
}

function Sidebar({ depthStep, depth}) {
  const { product } = useProduct();
  const items = getSidebarItems(product);
  const { opened, toggle } = useSidebar();
 
  return (
    <div className="sidebar-content">
      <ul>
	 {items.map((sidebarItem, index) => (
			  <SidebarItem
				depthStep={depthStep}
                depth={depth}
                setOpened={toggle}
				opened={opened}
				item={sidebarItem}
              />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;