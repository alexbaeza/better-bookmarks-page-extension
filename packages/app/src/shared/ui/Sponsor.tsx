import { APP_DONATION_URL } from '@/config/constants';
import { useTranslation } from '@/i18n/hooks';

interface SponsorProps {
  dataTestId?: string;
}
export const Sponsor = ({ dataTestId }: SponsorProps) => {
  const { t } = useTranslation();
  return (
    <div data-testid={dataTestId}>
      <div className="mt-2 flex w-full flex-row justify-end text-xs text-fgColor-primary" data-testid="sponsor-comment">
        {t('settings.support.message')}
      </div>
      <div className="mt-3 flex justify-center">
        <a data-testid="sponsor-link" href={APP_DONATION_URL}>
          <img
            alt={t('settings.support.buyCoffee')}
            className="w-32"
            data-testid="sponsor-link-image"
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          />
        </a>
      </div>
    </div>
  );
};
