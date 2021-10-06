import styled from 'styled-components';
import media from 'styled-media-query';
import LocalizedLink from '../LocalizedLink';
import { Link } from 'gatsby';

export const SidebarLink = styled(Link)`
  color: var(--text-dark);
  font-weight: normal;
  text-decoration: none;
  text-align: left;
`;

export const Sidebar = styled.div`
  position: fixed;
  width: 240px;
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
}

.sidebar-item-icon {
  margin-right: 6px;
}

.sidebar-item-text {
  width: 100%;
}

.sidebar-item-expand-arrow {
  font-size: 1.2rem !important;
}

.sidebar-item-expand-arrow-expanded {
  color: #09bb12;
  font-weight: bold;
`;
