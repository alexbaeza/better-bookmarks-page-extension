import { Text } from './Text';

export const Divider = ({ title }: { title: string }) => {
  return (
    <div className="grid grid-cols-[1fr_auto_1fr] place-items-center gap-4 p-2">
      <span className="w-full border-y border-fgColor-primary" />
      <Text as="h4" className="w-fit" color="primary" size="xs">
        {title}
      </Text>
      <span className="w-full border-y border-fgColor-primary" />
    </div>
  );
};
