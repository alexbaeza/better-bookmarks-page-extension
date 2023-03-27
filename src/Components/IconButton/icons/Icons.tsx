import React from 'react';

const getSizeClassName = (size: IconProps['size']) => {
  switch (size) {
    case 'xl':
      return 'w-48 h-48';
    case 'lg':
      return 'w-24 h-24';
    case 'md':
      return 'w-12 h-12';
    case 'sm':
      return 'w-5 h-5';
    default:
      return 'w-5 h-5';
  }
};

export const GearIcon = ({ size = 'sm', className = '' }: IconProps) => {
  const sizeClassName = getSizeClassName(size);
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${sizeClassName} ${className}`}
      fill="currentColor"
      viewBox="0 0 24 24"
    >
      <path d="M24 13.616v-3.232c-1.651-.587-2.694-.752-3.219-2.019v-.001c-.527-1.271.1-2.134.847-3.707l-2.285-2.285c-1.561.742-2.433 1.375-3.707.847h-.001c-1.269-.526-1.435-1.576-2.019-3.219h-3.232c-.582 1.635-.749 2.692-2.019 3.219h-.001c-1.271.528-2.132-.098-3.707-.847l-2.285 2.285c.745 1.568 1.375 2.434.847 3.707-.527 1.271-1.584 1.438-3.219 2.02v3.232c1.632.58 2.692.749 3.219 2.019.53 1.282-.114 2.166-.847 3.707l2.285 2.286c1.562-.743 2.434-1.375 3.707-.847h.001c1.27.526 1.436 1.579 2.019 3.219h3.232c.582-1.636.75-2.69 2.027-3.222h.001c1.262-.524 2.12.101 3.698.851l2.285-2.286c-.744-1.563-1.375-2.433-.848-3.706.527-1.271 1.588-1.44 3.221-2.021zm-12 2.384c-2.209 0-4-1.791-4-4s1.791-4 4-4 4 1.791 4 4-1.791 4-4 4z" />
    </svg>
  );
};

export const CrossIcon = ({ size = 'sm', className = '' }: IconProps) => {
  const sizeClassName = getSizeClassName(size);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      className={`${sizeClassName} ${className}`}
      fill="currentColor"
      viewBox="0 0 20 20"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export const FolderIcon = ({ size = 'sm', className = '' }: IconProps) => {
  const sizeClassName = getSizeClassName(size);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      fill="currentColor"
      className={`${sizeClassName} ${className}`}
      viewBox="0 0 24 24"
    >
      <path d="M24 22h-24v-14h7.262c1.559 0 2.411-.708 5.07-3h11.668v17zm-16.738-16c.64 0 1.11-.271 2.389-1.34l-2.651-2.66h-7v4h7.262z" />
    </svg>
  );
};
export const HeartIcon = ({ size = 'sm', className = '' }: IconProps) => {
  const sizeClassName = getSizeClassName(size);

  return (
    <svg
      clipRule="evenodd"
      fillRule="evenodd"
      fill="currentColor"
      className={`${sizeClassName} ${className}`}
      strokeLinejoin="round"
      strokeMiterlimit="2"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="m7.234 3.004c-2.652 0-5.234 1.829-5.234 5.177 0 3.725 4.345 7.727 9.303 12.54.194.189.446.283.697.283s.503-.094.697-.283c4.977-4.831 9.303-8.814 9.303-12.54 0-3.353-2.58-5.168-5.229-5.168-1.836 0-3.646.866-4.771 2.554-1.13-1.696-2.935-2.563-4.766-2.563zm0 1.5c1.99.001 3.202 1.353 4.155 2.7.14.198.368.316.611.317.243 0 .471-.117.612-.314.955-1.339 2.19-2.694 4.159-2.694 1.796 0 3.729 1.148 3.729 3.668 0 2.671-2.881 5.673-8.5 11.127-5.454-5.285-8.5-8.389-8.5-11.127 0-1.125.389-2.069 1.124-2.727.673-.604 1.625-.95 2.61-.95z"
        fillRule="nonzero"
      />
    </svg>
  );
};

interface IconProps {
  size?: 'xl' | 'lg' | 'md' | 'sm';
  className?: string;
}

export const CheckIcon = ({ size = 'sm', className = '' }: IconProps) => {
  const sizeClassName = getSizeClassName(size);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      className={`${sizeClassName} ${className}`}
      viewBox="0 0 24 24"
    >
      <path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm-1.25 16.518l-4.5-4.319 1.396-1.435 3.078 2.937 6.105-6.218 1.421 1.409-7.5 7.626z" />
    </svg>
  );
};
