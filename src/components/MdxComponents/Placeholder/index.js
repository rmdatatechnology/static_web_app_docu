import React from "react"
import styled from "styled-components"
import PropTypes from "prop-types"
import usePlaceholder from '../../usePlaceholder';

const Placeholder = ({children}) => {

const placeholder = usePlaceholder();

function getPlaceholder()
{
  let child = children.toString();
  let last = "No Entry found";
  Object.entries(placeholder).forEach(([key, value]) => {
    if(key === child)
    {
      last = value;
      return;
    }
  });
  return last;
}


if (!placeholder)
    return (<div>No Placeholder </div>);

  const newData = getPlaceholder();

  if(newData !== null)
  {
    return (<span>{newData} </span>);
  }
  else
  {
    return (<div />);
  }
  

}

export default Placeholder
