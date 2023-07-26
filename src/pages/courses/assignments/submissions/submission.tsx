import React, { Suspense } from 'react';
import { Link as RRLink, useParams } from 'react-router-dom';
import { useLazyLoadQuery } from 'react-relay';

import PageDataContainer from 'components/PageDataContainer';
import Navigation from 'components/Navigation';
import Heading from 'components/Heading';

import { FetchedContext, useUserContext } from 'hooks/useUserCourseContext';

import SubmissionQueryDef from 'graphql/SubmissionQuery';

import type { SubmissionQuery } from '__generated__/SubmissionQuery.graphql';
import List from 'components/list/List';
import { theme } from 'theme';
import { TextListItem } from 'components/list/TextListItem';
import {
  CheckCircleFillIcon,
  InfoIcon,
  MarkGithubIcon,
  MortarBoardIcon,
  NumberIcon,
  PersonFillIcon,
  XCircleFillIcon,
} from '@primer/octicons-react';
import Link from 'components/Link';
import { formatAsSimpleDateTime } from 'utils/dates';
import { Flex, Stack } from '@chakra-ui/react';
import IconButton from 'components/IconButton';
import Tooltip from 'components/Tooltip';
import Text from 'components/Text';

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

  const viewer = data.viewer;
  const course = viewer?.course;
  const assignment = course?.assignment;
  const submission = assignment?.submission;
  const user = submission?.submitter; // TODO: TH-164 may be user or group
  const reviewerUser = submission?.reviewer?.reviewer;
  const review = submission?.review;

  if (!submission || !assignment || !user) {
    return null; // todo: fix cases when null data
  }

  const LIST_ITEM_ICON_COLOR = theme.colors.teachHub.primary;

  /* Link to assignment is going up in the path back to the assignment */
  const VIEW_ASSIGNMENT_LINK = `../..`;

  const submittedOnTime =
    !submission.submittedAt || !assignment.endDate
      ? true
      : new Date(submission.submittedAt) <= new Date(assignment.endDate);

  const getReviewStatus = () => {
    const grade = review?.grade;
    const revisionRequested = review?.revisionRequested;
    if (grade) {
      return 'Corregido';
    } else if (revisionRequested) {
      return 'Reentrega solicitada';
    } else {
      return 'Sin corregir';
    }
  };

  return (
    <PageDataContainer>
      <Flex direction="row" gap={'20px'} align={'center'}>
        <Heading>
          Entrega | {user.lastName} |{' '}
          <Link
            as={RRLink}
            to={VIEW_ASSIGNMENT_LINK}
            isExternal
            color={theme.colors.teachHub.primaryLight}
          >
            {assignment.title}
          </Link>
        </Heading>

        <Tooltip
          hasArrow
          label={'Ir a pull request'}
          fontSize={theme.styles.global.body.fontSize}
        >
          <Link href={submission.pullRequestUrl} isExternal>
            <IconButton
              variant={'ghost'}
              aria-label="pull-request-link"
              icon={<MarkGithubIcon size="medium" />}
            />
          </Link>
        </Tooltip>
      </Flex>

      <Stack gap={'30px'} marginTop={'30px'}>
        <List paddingX="30px">
          <TextListItem
            iconProps={{
              color: LIST_ITEM_ICON_COLOR,
              icon: PersonFillIcon,
            }}
            text={`${user.name} ${user.lastName} (${user.file})`}
            listItemKey={'name'}
          />
          <TextListItem
            listItemKey={'submittedOnTime'}
            iconProps={{
              color: submittedOnTime
                ? theme.colors.teachHub.green
                : theme.colors.teachHub.red,
              icon: submittedOnTime ? CheckCircleFillIcon : XCircleFillIcon,
            }}
            label={
              submittedOnTime
                ? 'Entrega realizada en fecha'
                : 'Entrega realizada fuera de fecha'
            }
            text={` (${formatAsSimpleDateTime(submission.submittedAt)})`}
          />
          <TextListItem
            iconProps={{
              color: LIST_ITEM_ICON_COLOR,
              icon: MortarBoardIcon,
            }}
            text={
              reviewerUser
                ? `${reviewerUser.name} ${reviewerUser.lastName}`
                : 'Sin asignar'
            }
            label={'Corrector: '}
            listItemKey={'reviewer'}
          />
          <TextListItem
            iconProps={{
              color: LIST_ITEM_ICON_COLOR,
              icon: InfoIcon,
            }}
            text={`${getReviewStatus()}`}
            label={'Estado corrección: '}
            listItemKey={'status'}
          />
          <TextListItem
            iconProps={{
              color: LIST_ITEM_ICON_COLOR,
              icon: NumberIcon,
            }}
            text={`${review?.grade || '-'}`}
            label={'Calificación: '}
            listItemKey={'grade'}
          />
        </List>
        <Stack>
          <Heading fontSize={theme.styles.global.body.fontSize}>
            Comentarios al realizar la entrega
          </Heading>
          <Text w={'40vw'}>{submission.description}</Text>
        </Stack>
      </Stack>
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
