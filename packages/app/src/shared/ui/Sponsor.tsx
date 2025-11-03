import { APP_DONATION_URL } from '@/config/constants';

interface SponsorProps {
  dataTestId?: string;
}
export const Sponsor = ({ dataTestId }: SponsorProps) => {
  return (
    <div data-testid={dataTestId}>
      <div className="mt-2 flex w-full flex-row justify-end text-xs text-fgColor-primary" data-testid="sponsor-comment">
        {
          'Free and open-source — powered by too much coffee and questionable choices. If it helps you, consider fueling the cycle by buying me a coffee!'
        }
      </div>
      <div className="mt-3 flex justify-center">
        <a data-testid="sponsor-link" href={APP_DONATION_URL}>
          <img
            alt={'Buy me a coffee'}
            className="w-32"
            data-testid="sponsor-link-image"
            src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png"
          />
        </a>
      </div>
    </div>
  );
};
