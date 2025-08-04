import clsx from "clsx";

function Card(props) {
  const { className, children } = props;
  return (
    <article className={clsx("card-wrapper", className)}>{children}</article>
  );
}
export default Card;
