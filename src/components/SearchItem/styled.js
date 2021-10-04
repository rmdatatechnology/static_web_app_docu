import styled from 'styled-components';
import media from 'styled-media-query';
import Img from 'gatsby-image';
import { Link } from "gatsby";

export const SearchItemLink = styled(Link)`
  
`;

export const SearchItemWrapper = styled.section`
  align-items: right;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 500;
`;

export const SearchItemTag = styled.div`
  display: inline-block;
  align-items: right;
 
`;

export const SearchItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;


export const SearchItemTitle = styled.h3`
 
`;

export const SearchItemDescription = styled.div`
  margin-top: var(--space-sm);
`;
