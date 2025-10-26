import { HeartIcon } from 'lucide-react';
import { APP_REPO_URL } from '@/config/constants';

export const BuiltWith = ({ className = 'justify-end' }: { className?: string }) => {
  return (
    <div className={`flex w-full flex-row text-xs text-fgColor-primary ${className}`} data-testid="built-with">
      {'Built with '}
      <span className="mx-1 text-red-600" data-testid="heart-icon">
        <HeartIcon size={16} />
      </span>
      {'by'}
      <a className="text-fgColor-primary ml-1 font-bold" data-testid="author-link" href={APP_REPO_URL}>
        alexbaeza.
      </a>
    </div>
  );
};
