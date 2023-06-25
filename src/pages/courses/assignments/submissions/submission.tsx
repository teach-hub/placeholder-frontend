import { Suspense } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyLoadQuery } from 'react-relay';

import { FileCodeIcon } from '@primer/octicons-react';
import { HStack } from '@chakra-ui/react';

import PageDataContainer from 'components/PageDataContainer';
import Navigation from 'components/Navigation';
import Heading from 'components/Heading';
import Box from 'components/Box';
import Divider from 'components/Divider';

import { FetchedContext, useUserContext } from 'hooks/useUserCourseContext';

import SubmissionQueryDef from 'graphql/SubmissionQuery';

import type { SubmissionQuery } from '__generated__/SubmissionQuery.graphql';

const SubmissionPage = ({
  context,
  assignmentId,
  submissionId,
}: {
  context: FetchedContext;
  assignmentId: string;
  submissionId: string;
}) => {
  const data = useLazyLoadQuery<SubmissionQuery>(SubmissionQueryDef, {
    courseId: context.courseId,
    assignmentId,
    submissionId,
  });

  const submission = data.viewer?.course?.assignment?.submission;

  if (!submission) {
    return null;
  }

  return (
    <PageDataContainer>
      <HStack spacing="auto">
        <HStack margin="20px 0">
          <FileCodeIcon size="large" />
          <Heading>Entrega</Heading>
        </HStack>
        <Divider />
        <Box>
          <Heading size="sm">Descripcion: {submission.description}</Heading>
          <Heading size="sm">Enviado: {submission.submittedAt}</Heading>
          <Heading size="sm">
            Alumno: {submission.user.file} - {submission.user.name}{' '}
            {submission.user.lastName}
          </Heading>
        </Box>
      </HStack>
    </PageDataContainer>
  );
};

const SubmissionPageContainer = () => {
  const courseContext = useUserContext();
  const { assignmentId, submissionId } = useParams();

  if (!assignmentId || !courseContext.courseId || !submissionId) {
    return null;
  }

  return (
    <SubmissionPage
      context={courseContext}
      assignmentId={assignmentId}
      submissionId={submissionId}
    />
  );
};

// Pantalla de entregas de un TP en particular.
export default () => {
  return (
    <Navigation>
      <Suspense>
        <SubmissionPageContainer />
      </Suspense>
    </Navigation>
  );
};
