import styled from 'styled-components';
import media from 'styled-media-query';
import LocalizedLink from '../LocalizedLink';
import { Link } from 'gatsby';

export const Button = styled.button`
	
	color: var(--text-dark);
	font-size: 16px;
	text-decoration: none;
	position: relative;
	padding: 0 var(--space-sm);
	margin-bottom: var(--space-sm);
	text-align: center;
	border: 0px;
	background-color: transparent;
  
  ${media.greaterThan('medium')`
    margin-left: var(--space-sm);
    margin-bottom: 0;
  `}
  ${media.greaterThan('large')`
    margin-left: var(--space);
  `} 

  &:after {
    ${media.greaterThan('medium')`
      content: '';
      display: inline-block;
      width: 0;
      height: 4px;
      background: var(--primary-color);
      position: absolute;
      left: 0;
      bottom: -10px;
      opacity: 0;
      transition: .3s ease-in-out;
    `}
  }

  &:hover,
  &.active {
    font-weight: bold;
    ${media.greaterThan('medium')`
      font-weight: normal;
    `}

    &:after {
      opacity: 1;
      bottom: -10px;
      width: 100%;
    }
  }
`;

export const DropDownLink = styled(LocalizedLink)`
  color: var(--text-dark);
  font-weight: normal;
  text-decoration: none;
  position: relative;
  padding: 0 var(--space-sm);
  margin-bottom: var(--space-sm);
  text-align: center;
`;

export const Dropdown = styled("dropdown")`
	position: relative;
    display: inline-block;
`;

export const DropDownList = styled.ul`
	list-style-type: none;
     margin: 0;
     padding: 0;
     top:45px;
     left:0;
     width: 200px;
     background-color: white;
     font-weight:bold;
     position: absolute;

     box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
     z-index: 1;
`;

export const ListItem = styled.li`
	padding: 8px 16px;
     border-bottom: 1px solid #e5e5e5;
	 
	 &:last-child {
     border-bottom: none;
	 }
	 &:hover {
     background-color: #e5e5e5;
     color: white;
	}
	&.a {
     color: #000;
     text-decoration: none;
}
`;

export const ArrowClosed = styled("arrow")`
 color: var(--text-dark);
  top: 10px;
  transform: rotate(45deg);
  -webkit-transform: rotate(45deg);
   border: solid #999;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 4px;

`;

export const ArrowOpen = styled("arrow")`
 color: var(--text-dark);
  top: 14px;
  transform: rotate(-135deg);
  -webkit-transform: rotate(-135deg);
   border: solid #999;
  border-width: 0 2px 2px 0;
  display: inline-block;
  padding: 4px;

}
`;
