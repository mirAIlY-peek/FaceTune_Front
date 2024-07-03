import React from 'react';
import { useNavigate } from 'react-router-dom';
import ButtonSvg from "../assets/svg/ButtonSvg.jsx";

const Button = ({ className, href, onClick, children, px, white }) => {
  let navigate = useNavigate();
  const classes = `relative inline-flex items-center justify-center h-11 transition-colors hover:text-color-1 ${
      px || "px-7"
  } ${white ? "text-n-8" : "text-n-1"} ${className || ""}`;
  const spanClasses = "relative z-10";

  const handleClick = () => {
    if (href) {
      navigate(href);
    } else if (onClick) {
      onClick();
    }
  };

  return (
      <button className={classes} onClick={handleClick}>
        <span className={spanClasses}>{children}</span>
        {ButtonSvg(white)}
      </button>
  );
};

export default Button;
