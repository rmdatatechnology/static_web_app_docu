import styled from 'styled-components';
import media from 'styled-media-query';
import LocalizedLink from '../LocalizedLink';
import { Link } from 'gatsby';

export const SidebarButton = styled.button`
	
	color: var(--text-dark);
	font-size: 16px;
	text-decoration: none;
	position: relative;
	padding: 5px;
	margin-bottom: var(--space-sm);
	text-align: left;
	border: 0px;
	background-color: transparent;
	display: block;
	width: 100%;

  &:hover,
  &:active,
  &:focus {
    font-weight: bold;
    background-color: #f6f6f6;
	border: 0px;
    }
  }
`;

export const SidebarLink = styled(Link)`
  color: var(--text-dark);
  font-weight: normal;
  text-decoration: none;
  text-align: left;
`;

export const Sidebar = styled.div`
  position: fixed;
  width: 270px;
  height: 75vh;
  border: 1px solid rgba(0, 0, 0, 0.1);
  overflow-y: scroll;
  
  .sidebar-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  
}

.sidebar-item-content {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  display: flex;
  align-items: center;
  width: 100%;
  &:hover,
  &:active,
  &:focus {
    font-weight: bold;
    background-color: #f6f6f6;
	border: 0px;
    }
}
`;
