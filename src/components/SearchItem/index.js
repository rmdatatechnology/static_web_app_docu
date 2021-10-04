import React from 'react';
import * as S from './styled';
import { Link, navigate } from "gatsby";
import { useLocale } from '../../hooks/locale';
import ListItem from "@material-ui/core/ListItem";

const SearchItem = ({
  slug,
  title,
  description,
}) => {


  const { locale } = useLocale();
  const urlMain = window.location.pathname;
  const isLocale = urlMain.includes(`/${locale}/`);
  
  function onClick(e) {
		if(isLocale === false && locale === "de")
			return navigate(`/${slug}`);
		else
			return navigate(`/${locale}/${slug}`);
  }
	
  return (
     <ListItem
        className="sidebar-item"
        onClick={onClick}
        button
        dense
      >
	<Link>
		<S.SearchItemWrapper>
			<S.SearchItemInfo>
				<S.SearchItemTitle>{title}</S.SearchItemTitle>
				<S.SearchItemTag>{slug}</S.SearchItemTag>
				<S.SearchItemDescription>{description}</S.SearchItemDescription>
			</S.SearchItemInfo>
		</S.SearchItemWrapper>
    </Link>
	</ListItem>
  );
};

export default SearchItem;
