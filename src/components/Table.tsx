import { ReactNode } from 'react';
import {
  Box,
  Table,
  TableRowProps,
  TableContainer,
  Tbody,
  Td,
  Thead,
  Tr,
} from '@chakra-ui/react';

import { theme } from 'theme';

type RowOptions = {
  rowProps?: TableRowProps;
  content: ReactNode[];
};

type Props = {
  headers: ReactNode[];
  rowOptions: RowOptions[];
  tableWidth?: string;
  tableHeight?: string;
};

export default (props: Props) => {
  return (
    <Box
      height={props.tableHeight}
      width={props.tableWidth}
      overflow="auto"
      borderRadius="10px"
    >
      <TableContainer overflowX={'unset'} overflowY={'unset'}>
        <Table colorScheme="black" variant="simple">
          <Thead
            textColor="white"
            background={theme.colors.teachHub.primaryLight}
            fontWeight="bold"
            position="sticky"
            top={0}
            zIndex="sticky"
          >
            <Tr>
              {props.headers.map((h, i) => (
                <Td key={`${i}`} textAlign="center">
                  {h}
                </Td>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {props.rowOptions.map((options, k) => (
              <Tr key={k} {...options.rowProps}>
                {options.content.map((cell, i) => (
                  <Td key={`${i}`} textAlign={'center'}>
                    {cell}
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </Box>
  );
};
