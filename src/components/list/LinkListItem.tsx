import { LinkExternalIcon, LinkIcon } from '@primer/octicons-react';
import ListItem, { ListItemProps } from 'components/list/ListItem';
import Link from 'components/Link';
import { Link as RRLink } from 'react-router-dom';

export type LinkListItemProps = {
  text: string;
  link: string;
  label?: string;
  listItemKey: string;
  iconColor: string;
  external: boolean;
};

export const LinkListItem = ({
  label,
  text,
  link,
  iconColor,
  listItemKey,
  external,
}: LinkListItemProps) => {
  const children = external ? (
    <Link href={link} isExternal>
      {text}
    </Link>
  ) : (
    <Link as={RRLink} to={link}>
      {text}
    </Link>
  );

  const updatedItemProps: ListItemProps = {
    iconProps: {
      icon: external ? LinkExternalIcon : LinkIcon,
      color: iconColor,
    },
    children,
    listItemKey,
    label,
  };

  return <ListItem {...updatedItemProps} />;
};
