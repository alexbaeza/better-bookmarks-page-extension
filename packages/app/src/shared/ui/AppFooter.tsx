import { HeartIcon } from 'lucide-react';

export const AppFooter = ({ className = 'justify-end' }: { className?: string }) => {
  return (
    <div data-testid="built-with" className={`flex w-full flex-row text-xs text-fgColor-primary ${className}`}>
      {'Built with '}
      <span data-testid="heart-icon" className="mx-1 text-red-600">
        <HeartIcon size={16} />
      </span>
      {'by'}
      <a data-testid="author-link" className="text-fgColor-primary ml-1 font-bold" href={'https://github.com/alexbaeza/better-bookmarks-page-extension'}>
        alexbaeza.
      </a>
    </div>
  );
};
