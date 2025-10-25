import { APP_DONATION_URL } from '@/config/constants';

interface SponsorProps {
  dataTestId?: string;
}
export const Sponsor = ({ dataTestId }: SponsorProps) => {
  return (
    <div data-testid={dataTestId}>
      <div data-testid="sponsor-comment" className="mt-2 flex w-full flex-row justify-end text-xs text-fgColor-primary">
        {'Free and open-source — powered by too much coffee and questionable choices. If it helps you, consider fueling the cycle by buying me a coffee!'}
      </div>
      <div className="mt-3 flex justify-center">
        <a data-testid="sponsor-link" href={APP_DONATION_URL}>
          <img data-testid="sponsor-link-image" className="w-32" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt={'Buy me a coffee'} />
        </a>
      </div>
    </div>
  );
};
