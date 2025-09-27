import './Icon.scss';

const Icon = ({ name, className = '', size = 24, ...props }) => {
  return (
    <svg className={`icon ${className}`} width={size} height={size} {...props}>
      <use href={`#icon-${name}`} />
    </svg>
  );
};

export default Icon;