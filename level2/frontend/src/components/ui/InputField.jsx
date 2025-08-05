import clsx from "clsx";

function InputField(props) {
  const {
    id,
    name,
    type = "text",
    value,
    onChange,
    className,
    placeholder,
    error,
    touched,
    onBlur,
  } = props;
  return (
    <div>
      <input
        id={id}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={clsx("custom-input", className)}
        placeholder={placeholder}
      />
      {error && touched ? <div className="error">{error}</div> : null}
    </div>
  );
}

export default InputField;
