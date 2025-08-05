import { useCallback, useMemo } from "react";
import clsx from "clsx";

function Button(props) {
  const {
    size = "small", // Possible values: "small" and "large"
    icon, // Optional icon
    iconPosition = "left", // Possible values: "left" and "right"
    type = "button", // Optional type attribute, by default has "button" type
    disabled,
    loading,
    loadingText = "Loading...",
    onClick,
    className, // Additional classes
    tabIndex = 0, // If tab index is not provided, will use default value of 0
    children,
  } = props;

  const handleClick = useCallback(() => {
    if (onClick) {
      // Although the `onClick` prop is not supposed to be optional,
      // we cannot ensure that it will always be passed as a prop.
      // So it's better to wrap it in an `if` check.
      onClick();
    }
  }, [onClick]);

  const buttonClass = useMemo(
    () =>
      // Apply classes related to size, loading and disabled states,
      // and hover only when loading and disabled states are inactive
      clsx(
        "btn",
        size,
        { loading, disabled, hover: !loading && !disabled },
        className
      ),
    [size, loading, disabled, className]
  );

  return (
    <button
      // type={type}
      className={buttonClass}
      onClick={handleClick}
      disabled={disabled || loading} // Disable click when either loading or disabled states are active
      // tabIndex={tabIndex}
    >
      {/* Render icon (if present) only when iconPosition is "left" and it's not loading */}
      {!loading && icon && iconPosition === "left" && icon}
      {loading ? loadingText : children}
      {/* Render icon (if present) only when iconPosition is "right" and it's not loading */}
      {!loading && icon && iconPosition === "right" && icon}
    </button>
  );
}

export default Button;
