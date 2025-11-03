import type React from 'react';

import { Badge } from '@/shared/ui/Badge';
import { Col } from '@/shared/ui/Col';
import { Content } from '@/shared/ui/Content';
import { Row } from '@/shared/ui/Row';

type SectionProps = {
  title: string;
  icon?: React.ReactNode;
  badge?: number;
  children: React.ReactNode;
};

export const SidebarSection: React.FC<SectionProps> = ({ title, icon, badge, children }) => (
  <Content className="p-1" padding={false}>
    <Row alignItems="center" className="mb-1 min-w-0 text-xs font-semibold uppercase text-fgColor-secondary" gap="sm">
      <Col className="min-w-0 truncate text-left" span="auto">
        {title}
      </Col>
      {icon && <span className="flex-none text-fgColor-secondary hover:text-fgColor-primary">{icon}</span>}
      {badge !== undefined && <Badge size="sm">{badge}</Badge>}
    </Row>
    <ul className="min-w-0 space-y-1 overflow-visible">{children}</ul>
  </Content>
);
