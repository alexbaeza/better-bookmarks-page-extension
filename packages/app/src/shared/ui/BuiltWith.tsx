import { HeartIcon } from 'lucide-react';
import { APP_REPO_URL } from '@/config/constants';
import { useTranslation } from '@/i18n/hooks';

export const BuiltWith = ({ className = 'justify-end' }: { className?: string }) => {
  const { t } = useTranslation();
  return (
    <div className={`flex w-full flex-row text-xs text-fgColor-primary ${className}`} data-testid="built-with">
      {t('common.builtWith.text')}
      <span className="mx-1 text-red-600" data-testid="heart-icon">
        <HeartIcon size={16} />
      </span>
      {t('common.builtWith.by')}
      <a className="text-fgColor-primary ml-1 font-bold" data-testid="author-link" href={APP_REPO_URL}>
        alexbaeza.
      </a>
    </div>
  );
};
