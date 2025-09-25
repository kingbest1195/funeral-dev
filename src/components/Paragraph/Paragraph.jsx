import "./Paragraph.scss";

const Paragraph = ({ children, className = "" }) => {
  return <div className={`paragraph ${className}`}>{children}</div>;
};

export default Paragraph;
