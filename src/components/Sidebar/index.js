import React, { useRef, useEffect, useLayoutEffect } from 'react';
import { navigate, useStaticQuery, graphql } from "gatsby";
import { useLocale } from '../../hooks/locale';
import { useProduct } from '../../hooks/products';
import { useSidebar } from '../../hooks/sidebar';
import OpenedSvg from '../../images/opened';
import ClosedSvg from '../../images/closed';
import "../../styles/styles.scss";

const {
  getSidebarItems,
  getNewUrlWithoutPrefix,
} = require(`../../utils/pageHelper`);



const SidebarItem = ({ className = '', depthStep = 20, depth = 0,  toggle, opened , item, prefix, product, clicked, setClicked, setScrollPos, focusSidebar}) => {
  const { locale } = useLocale();
  const { Icon, url, items } = item;	
  let pathname = getNewUrlWithoutPrefix(false, prefix);
  let isClicked = clicked && url === clicked;
  let active = isClicked || (!clicked && (pathname === ('/' + url) || pathname === url || pathname === (url + '/') || pathname === ('/' + url + '/')));
  
  let isAlreadyOpen = opened[url] === true;
  let expanded = isAlreadyOpen || pathname === ('/' + url) || pathname === url  || pathname === (url + '/') || pathname === ('/' + url + '/') || checkForValue(item, pathname, opened, clicked);
  const focusDiv = useRef();

  useEffect(() => {
	
	if (focusDiv) {
		// Our ref has a value, pointing to an HTML element
		// The perfect time to observe it.
		if(focusDiv.current && active && !clicked)
		{			
			focusDiv.current.focus(); 
			if(focusSidebar && focusSidebar.current)
			{
				setScrollPos(focusSidebar.current.scrollTop);
			}
			else
			{
				setScrollPos(focusDiv.current.scrollTop);
			}
		}
	}
		 return () => {
			if (focusDiv) {
			// We need to clean up after this ref
			// The perfect time to unobserve it.
			
		}	
    };
	 
	}, [focusDiv, setScrollPos, focusSidebar, url, setClicked, active, clicked]);
   
 
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
	
	if(!clicked || clicked==="")
		setScrollPos(focusSidebar.current.scrollTop);
	
	setClicked(url);
	
	if (hasChildren) {
	 toggle(url);
    }
	else
	{
		const urlM = window.location.pathname;
		const isLocale = urlM.includes(`/${locale}/`);

		if(isLocale === false && locale === "de")
			return navigate(`/${url}?product=${product}`);
		else
			return navigate(`/${locale}/${url}?product=${product}`);
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
              toggle={toggle}
              opened={opened}
			  item={item}
			  depth={depth + 1}
              depthStep={depthStep}
			  prefix={prefix}
		      product={product}
			  clicked={clicked}
			  setClicked={setClicked}
			  setScrollPos={setScrollPos}
			  focusSidebar={focusSidebar}
            />
          ))}
        </ul>
      ) : null}
    </>
	
	
  );
};

function checkForValue(item, url, opened, isClicked) {
    
	if(!item || isClicked)
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
  const { opened, toggle, clicked, setClicked, scrollPosition, setScrollPosition } = useSidebar();
  const focusSidebar = useRef();
 
useLayoutEffect(() => {
    if (focusSidebar) {
		// Our ref has a value, pointing to an HTML element
		// The perfect time to observe it.
		if(focusSidebar.current) 
		{
			focusSidebar.current.scrollTo(0, scrollPosition);

		}			
	}
	
	 return () => {
		if (focusSidebar) {
			// We need to clean up after this ref
			// The perfect time to unobserve it.
			
		}
	};		
}, [focusSidebar, scrollPosition]);
 
 const prefix = useStaticQuery(graphql`
    query {
      site {
        pathPrefix
        }
      }
  `)
  const handleScroll = (event) => {
    const { scrollTop } = event.target;
    setScrollPosition(scrollTop);
  }
  
  
 
  return (
    <div className="sidebar-content" ref={focusSidebar} onScroll={handleScroll}>
      <ul>
	 {items.map((sidebarItem, index) => (
			  <SidebarItem
				depthStep={depthStep}
                depth={depth}
                toggle={toggle}
				opened={opened}
				item={sidebarItem}
				prefix={prefix.site.pathPrefix}
				product={product}
				clicked={clicked}
				setClicked={setClicked}
				setScrollPos={setScrollPosition}
				focusSidebar={focusSidebar}
              />
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;