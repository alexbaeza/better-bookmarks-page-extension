import { useAtomValue } from 'jotai';
import type React from 'react';

import { greetingEnabledAtom, searchBarEnabledAtom } from '@/app/providers/atoms';
import { Greeting } from '@/features/greeting/components/Greeting';
import { SearchBar } from '@/features/search/containers/SearchBar';
import { Col } from '@/shared/ui/Col';
import { Row } from '@/shared/ui/Row';

export const Header: React.FC = () => {
  const showGreeting = useAtomValue(greetingEnabledAtom);
  const showSearch = useAtomValue(searchBarEnabledAtom);

  return (
    <header className="w-full bg-bgColor-primary p-6">
      {/* Top row: Greeting left, controls right */}
      <Row alignItems="center" gap="none" justifyContent="between">
        <Col className="min-w-0" span="auto">
          {showGreeting && <Greeting />}
        </Col>
      </Row>

      {/* Center row: Search */}
      {showSearch && (
        <Row gap="none" justifyContent="center">
          <SearchBar />
        </Row>
      )}
    </header>
  );
};
