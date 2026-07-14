import React from 'react';
import logo from "./logo.png" // Tell webpack this JS file uses this image

const Logo = ({imageName, sizeOverride, classOverride}) => {
  
  const imageSize = sizeOverride === null || sizeOverride === undefined ? "75px" : sizeOverride;
  const classInfo = classOverride == null || classOverride === undefined ? "contact-logo" : classOverride;
  

  let imageNameToUse = logo;
  if(imageName)
	  imageNameToUse = imageName;
	
  return (
  <div className="inlines">
	{imageNameToUse && (
          <img
            src={imageNameToUse}
            alt={imageNameToUse}
			className={classInfo}
			width={imageSize}
          />
        )}
        {!imageNameToUse && (
         <img
            src=""
            alt="Logo"
			className={classInfo}
			width={imageSize}
          />
        )}
  </div>
  );
};

export default Logo;




