import React from "react";
import Loader from "react-js-loader";
import PropTypes from "prop-types";

const MainLoader = ({
  size = 50,
  display = true,
  bgColor = "blue",
  type = "spinner-default",
}) => {
  return display ? (
    <div className="flex justify-center items-center h-full">
      <Loader type={type} bgColor={bgColor} size={size} />
    </div>
  ) : null;
};

MainLoader.propTypes = {
  size: PropTypes.number,
  display: PropTypes.bool,
  bgColor: PropTypes.string,
  type: PropTypes.string,
};

export default MainLoader;
