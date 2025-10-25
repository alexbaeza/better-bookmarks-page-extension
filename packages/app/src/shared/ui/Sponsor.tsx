import { APP_DONATION_URL } from '@/config/constants';

interface SponsorProps {
  dataTestId?: string;
}
export const Sponsor = ({ dataTestId }: SponsorProps) => {
  return (
    <>
      <div data-testid={dataTestId}>
        <div data-testid="sponsor-comment" className="mt-2 flex w-full flex-row justify-end text-xs text-fgColor-primary">
          {
            'This app was built with the intentions of it being free to the public as well as open-sourced but if you like it and it helps you, you can always buy me a coffee.'
          }
        </div>
        <div className="mt-3 flex justify-center">
          <a data-testid="sponsor-link" href={APP_DONATION_URL}>
            <img data-testid="sponsor-link-image" className="w-32" src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt={'Buy me a coffee'} />
          </a>
        </div>
      </div>
    </>
  );
};
