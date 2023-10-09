import React, { Suspense, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useLazyLoadQuery, useMutation } from 'react-relay';
import { PayloadError } from 'relay-runtime';

import {
  CheckCircleFillIcon,
  InfoIcon,
  IterationsIcon,
  MortarBoardIcon,
  NumberIcon,
  PencilIcon,
  PeopleIcon,
  PersonFillIcon,
  XCircleFillIcon,
} from '@primer/octicons-react';

import { Flex, Select, Stack, useDisclosure } from '@chakra-ui/react';

import { formatAsSimpleDateTime } from 'utils/dates';
import { getValueOfNextIndex, getValueOfPreviousIndex } from 'utils/list';
import { getGithubRepoUrlFromPullRequestUrl } from 'utils/github';

import useToast from 'hooks/useToast';
import { FetchedContext, Permission, useUserContext } from 'hooks/useUserCourseContext';
import { useSubmissionContext } from 'hooks/useSubmissionsContext';

import List from 'components/list/List';
import ListItem from 'components/list/ListItem';
import { TextListItem } from 'components/list/TextListItem';
import Link from 'components/Link';
import IconButton from 'components/IconButton';
import Tooltip from 'components/Tooltip';
import Text from 'components/Text';
import Button from 'components/Button';
import PageDataContainer from 'components/PageDataContainer';
import Navigation from 'components/Navigation';
import Heading from 'components/Heading';
import { Modal } from 'components/Modal';
import { FormControl } from 'components/FormControl';
import { Checkbox } from 'components/Checkbox';
import { ReviewStatusBadge } from 'components/review/ReviewStatusBadge';
import { ReviewGradeBadge } from 'components/review/ReviewGradeBadge';
import { ButtonWithIcon } from 'components/ButtonWithIcon';
import SubmissionStates from 'components/SubmissionStates';

import SubmissionQueryDef from 'graphql/SubmissionQuery';
import SubmitSubmissionMutation from 'graphql/SubmitSubmissionAgainMutation';
import CreateReviewMutation from 'graphql/CreateReviewMutation';
import UpdateReviewMutation from 'graphql/UpdateReviewMutation';

import {
  getGradeConfiguration,
  getSubmissionReviewStatusConfiguration,
  GRADES,
} from 'app/submissions';
import RepositoryIcon from 'icons/RepositoryIcon';
import PullRequestIcon from 'icons/PullRequestIcon';
import BackArrowIcon from 'icons/BackArrowIcon';
import NextArrowIcon from 'icons/NextArrowIcon';
import { CreateReviewMutation as CreateReviewMutationType } from '__generated__/CreateReviewMutation.graphql';
import { UpdateReviewMutation as UpdateReviewMutationType } from '__generated__/UpdateReviewMutation.graphql';
import { SubmitSubmissionAgainMutation as SubmitSubmissionMutationType } from '__generated__/SubmitSubmissionAgainMutation.graphql';

import type { Nullable } from 'types';
import type {
  SubmissionQuery,
  SubmissionQuery$data,
} from '__generated__/SubmissionQuery.graphql';
import Divider from 'components/Divider';
import CommentIcon from 'icons/CommentIcon';
import MarkdownText from 'components/MarkdownText';
import RRLink from 'components/RRLink';
import Spinner from 'components/Spinner';

type CommentType = NonNullable<
  NonNullable<
    NonNullable<NonNullable<SubmissionQuery$data['viewer']>['course']>['submission']
  >['comments'][number]
>;

const CarrouselNavigationControls = ({ submissionId }: { submissionId: string }) => {
  const { submissionIds } = useSubmissionContext();

  const previousSubmissionId = getValueOfPreviousIndex(submissionIds, submissionId);
  const nextSubmissionId = getValueOfNextIndex(submissionIds, submissionId);

  const previousSubmissionUrl = previousSubmissionId && `../${previousSubmissionId}`;
  const nextSubmissionUrl = nextSubmissionId && `../${nextSubmissionId}`;

  return (
    <Stack direction={'row'} gap={'5px'}>
      {previousSubmissionUrl && (
        <Tooltip label={'Ver entrega anterior'}>
          <RRLink to={previousSubmissionUrl}>
            <IconButton
              variant={'ghost'}
              aria-label="previous-submission"
              icon={<BackArrowIcon />}
            />
          </RRLink>
        </Tooltip>
      )}
      {nextSubmissionUrl && (
        <Tooltip label={'Ver siguiente entrega'}>
          <RRLink to={nextSubmissionUrl}>
            <IconButton
              variant={'ghost'}
              aria-label="next-submission"
              icon={<NextArrowIcon />}
            />
          </RRLink>
        </Tooltip>
      )}
    </Stack>
  );
};

const SubmissionPage = ({
  context,
  submissionId,
}: {
  context: FetchedContext;
  submissionId: string;
}) => {
  const toast = useToast();
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const data = useLazyLoadQuery<SubmissionQuery>(SubmissionQueryDef, {
    courseId: context.courseId,
    submissionId,
  });

  const [commitCreateMutation] =
    useMutation<CreateReviewMutationType>(CreateReviewMutation);
  const [commitUpdateMutation] =
    useMutation<UpdateReviewMutationType>(UpdateReviewMutation);
  const [commitSubmitMutation] = useMutation<SubmitSubmissionMutationType>(
    SubmitSubmissionMutation
  );

  const {
    isOpen: isOpenReviewModal,
    onOpen: onOpenReviewModal,
    onClose: onCloseReviewModal,
  } = useDisclosure();

  const {
    isOpen: isOpenCommentsModal,
    onOpen: onOpenCommentsModal,
    onClose: onCloseCommentsModal,
  } = useDisclosure();

  if (!data.viewer || !data.viewer.course) {
    return null;
  }

  const { course } = data.viewer;
  const { submission } = course;

  if (!course || !submission) {
    return null;
  }

  const { assignment, submitter, reviewer, review, comments } = submission;

  if (!assignment) {
    return null;
  }

  const { isGroup, groupParticipants } = assignment;

  if (!submission || !assignment || !submitter) {
    return null; // todo: fix cases when null data
  }

  const LIST_ITEM_ICON_COLOR = 'teachHub.primary';

  /* Link to assignment is going up in the path back to the assignment */
  const VIEW_ASSIGNMENT_LINK = `../../assignments/${assignment.id}`;

  const submittedOnTime =
    !submission.submittedAt || !assignment.endDate
      ? true
      : new Date(submission.submittedAt) <= new Date(assignment.endDate);

  const reviewStatusConfiguration = getSubmissionReviewStatusConfiguration({
    review,
    submission,
  });
  const gradeConfiguration = getGradeConfiguration(review?.grade);

  const reviewEnabled =
    submission?.viewerIsReviewer && (!review || review.revisionRequested);
  const viewerCanSubmitAgain = review?.revisionRequested && !review?.reviewedAgainAt;

  const showWarningToastIfDisabled = () => {
    if (!reviewEnabled) {
      toast({
        title: 'No es posible calificar',
        description: 'Para calificar debes ser el corrector de la entrega',
        status: 'warning',
      });
    }
  };

  const handleSubmitButtonClick = () => {
    setShowSpinner(true);
    commitSubmitMutation({
      variables: {
        courseId: course.id,
        submissionId: submission.id,
      },
      onCompleted: (_: unknown, errors: Nullable<PayloadError[]>) => {
        setShowSpinner(false);
        if (errors?.length) {
          toast({
            title: 'Error al re-entregar, intentelo de nuevo',
            status: 'error',
          });
        } else {
          toast({
            title: 'Re-entrega enviada',
            status: 'success',
          });
        }
      },
    });
  };

  const handleReviewChange = ({
    grade,
    revisionRequested,
  }: {
    grade: Nullable<number>;
    revisionRequested: boolean;
  }) => {
    const reviewId = review?.id;
    const baseVariables = {
      courseId: course?.id,
      revisionRequested,
      ...(!revisionRequested ? { grade } : {}), // Only set grade if no revision requested
    };

    const onCompleted = (_: unknown, errors: Nullable<PayloadError[]>) => {
      setShowSpinner(false);
      if (!errors?.length) {
        toast({
          title: 'Corrección actualizada',
          status: 'success',
        });
      } else {
        toast({
          title: 'Error al actualizar la corrección, intentelo de nuevo',
          status: 'error',
        });
      }
    };

    /* If review did not exist, create it, otherwise update it*/
    setShowSpinner(true);
    if (!reviewId) {
      commitCreateMutation({
        variables: {
          ...baseVariables,
          submissionId,
        },
        onCompleted,
      });
    } else {
      commitUpdateMutation({
        variables: {
          ...baseVariables,
          id: reviewId,
        },
        onCompleted,
      });
    }
  };

  const submitterItem = isGroup ? (
    <TextListItem
      iconProps={{
        color: LIST_ITEM_ICON_COLOR,
        icon: PeopleIcon,
      }}
      text={groupParticipants
        .filter(p => p.group.id === submission.submitter.id)
        .map(({ user }) => `${user.name} ${user.lastName}`)
        .join(', ')}
      listItemKey={'name'}
    />
  ) : (
    <TextListItem
      iconProps={{
        color: LIST_ITEM_ICON_COLOR,
        icon: PersonFillIcon,
      }}
      text={`${submitter.name} ${submitter.lastName} (${submitter.file})`}
      listItemKey={'name'}
    />
  );

  const headingText = isGroup
    ? groupParticipants.find(p => p.group.id === submission.submitter.id)?.group.name
    : submitter.lastName;

  return (
    <PageDataContainer>
      <Spinner
        isOpen={showSpinner}
        onClose={() => {
          setShowSpinner(false);
        }}
      />
      <Flex direction={'row'} width={'100%'} justifyContent={'space-between'}>
        <Flex direction="row" gap={'20px'} align={'center'}>
          <Heading>
            Entrega | {headingText} |{' '}
            <RRLink to={VIEW_ASSIGNMENT_LINK} color={'teachHub.primaryLight'}>
              {assignment.title}
            </RRLink>
          </Heading>
          <Stack direction={'row'}>
            <Tooltip label={'Ir a repositorio'}>
              <Link
                href={getGithubRepoUrlFromPullRequestUrl(submission.pullRequestUrl)}
                isExternal
              >
                <IconButton
                  variant={'ghost'}
                  aria-label="repository-link"
                  icon={<RepositoryIcon />}
                />
              </Link>
            </Tooltip>
            <Tooltip label={'Ir a pull request'}>
              <Link href={submission.pullRequestUrl} isExternal>
                <IconButton
                  variant={'ghost'}
                  aria-label="pull-request-link"
                  icon={<PullRequestIcon />}
                />
              </Link>
            </Tooltip>
          </Stack>
        </Flex>
        <CarrouselNavigationControls submissionId={submissionId} />
      </Flex>
      <Stack gap={'30px'} marginTop={'10px'}>
        <Flex direction={'row'} gap={'5px'}>
          {context.userHasPermission(Permission.SetReview) && (
            /* Use div for toast to appear*/
            <div onClick={showWarningToastIfDisabled}>
              <ButtonWithIcon
                onClick={onOpenReviewModal}
                text={'Calificar'}
                icon={PencilIcon}
                isDisabled={!reviewEnabled}
              />
            </div>
          )}
          {context.userHasPermission(Permission.SubmitAssignment) && (
            <ButtonWithIcon
              text={'Re-entregar'}
              icon={IterationsIcon}
              isDisabled={!viewerCanSubmitAgain}
              onClick={handleSubmitButtonClick}
            />
          )}
        </Flex>
        <List justifyItems={'left'} alignItems={'flex-start'}>
          {submitterItem}
          <TextListItem
            listItemKey={'submittedOnTime'}
            iconProps={{
              color: submittedOnTime ? 'teachHub.green' : 'teachHub.red',
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
              reviewer
                ? `${reviewer.reviewer.name} ${reviewer.reviewer.lastName}`
                : 'Sin asignar'
            }
            label={'Corrector: '}
            listItemKey={'reviewer'}
          />
          <ListItem
            iconProps={{
              color: LIST_ITEM_ICON_COLOR,
              icon: InfoIcon,
            }}
            label={'Estado actual corrección: '}
            listItemKey={'status'}
          >
            <ReviewStatusBadge reviewStatusConfiguration={reviewStatusConfiguration} />
          </ListItem>
          <ListItem
            iconProps={{
              color: LIST_ITEM_ICON_COLOR,
              icon: NumberIcon,
            }}
            label={'Calificación: '}
            listItemKey={'grade'}
          >
            <ReviewGradeBadge
              grade={review?.grade}
              gradeConfiguration={gradeConfiguration}
            />
          </ListItem>
          <ListItem>
            <SubmissionStates submission={submission} review={review} />
          </ListItem>
        </List>
        {/* Show comments button if not empty */}
        {comments.length !== 0 && (
          <ButtonWithIcon
            onClick={onOpenCommentsModal}
            text={'Ver comentarios del PR'}
            icon={CommentIcon}
            variant={'ghost'}
            borderWidth={'1px'}
            borderColor={'teachHub.black'}
          />
        )}
      </Stack>
      <ReviewModal
        onSave={handleReviewChange}
        onClose={onCloseReviewModal}
        isOpen={isOpenReviewModal}
        isSecondTimeReview={!!review}
      />
      <CommentsModal
        onClose={onCloseCommentsModal}
        isOpen={isOpenCommentsModal}
        comments={comments as CommentType[]}
        viewerGithubUserId={data.viewer?.githubId}
      />
    </PageDataContainer>
  );
};

const ReviewModal = ({
  onClose,
  isOpen,
  onSave,
  isSecondTimeReview,
}: {
  onClose: () => void;
  isOpen: boolean;
  onSave: (_: { grade: Nullable<number>; revisionRequested: boolean }) => void;
  isSecondTimeReview: boolean;
}) => {
  const [grade, setGrade] = useState<Nullable<number>>(null);
  const [revisionRequested, setRevisionRequested] = useState<boolean>(false);

  useEffect(() => {
    setGrade(null);
    setRevisionRequested(false);
  }, [isOpen]);

  const handleSave = () => {
    onSave({ grade, revisionRequested });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      headerText={'Calificar'}
      closeOnOverlayClick={false}
      footerChildren={
        <Flex direction={'row'} gap={'30px'}>
          <Button onClick={onClose} variant={'ghost'}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </Flex>
      }
    >
      <Stack>
        <FormControl label={'Seleccionar nota'}>
          <Select
            placeholder="Selecciona una opción"
            value={grade ?? undefined}
            onChange={changes => setGrade(Number(changes.currentTarget.value))}
            isDisabled={revisionRequested}
          >
            {GRADES.map(grade => (
              <option value={grade} key={grade}>
                {grade}
              </option>
            ))}
          </Select>
        </FormControl>
        <Checkbox
          id={'revisionRequested'}
          isChecked={revisionRequested}
          isDisabled={isSecondTimeReview}
          onChange={() => {
            setRevisionRequested(!revisionRequested);
          }}
        >
          Requiere reentrega
        </Checkbox>
      </Stack>
    </Modal>
  );
};

const CommentsModal = ({
  onClose,
  isOpen,
  comments,
  viewerGithubUserId,
}: {
  onClose: () => void;
  isOpen: boolean;
  comments: CommentType[];
  viewerGithubUserId: Nullable<string>;
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      headerText={'Comentarios del Pull Request'}
      contentProps={{
        maxHeight: '80vh',
        overflowY: 'auto', // Make modal scrollable
        minWidth: '60vw',
        maxWidth: '60vw',
      }}
    >
      <Stack gap={'20px'}>
        {comments.map(comment => {
          const currentViewerComment = comment.githubUserId === viewerGithubUserId;

          return (
            comment.body && (
              <Flex
                width={'100%'}
                justifyContent={!currentViewerComment ? 'flex-start' : 'flex-end'} // If own comment, on right, otherwise on left
              >
                <Flex
                  bg={
                    currentViewerComment
                      ? 'teachHub.chatOwnBackground'
                      : 'teachHub.chatOtherBackground'
                  }
                  padding={'30px'}
                  borderRadius={'20'}
                  maxWidth={'90%'}
                >
                  <Stack direction={'column'} width={'100%'} justifyContent={'flex-end'}>
                    <Text>
                      <Text
                        color={
                          currentViewerComment
                            ? 'teachHub.chatOwnText'
                            : 'teachHub.chatOtherText'
                        }
                        fontWeight={'bold'}
                        display="inline" // Text within another text
                      >
                        {comment.githubUsername}
                      </Text>
                      {comment.createdAt
                        ? ` (${formatAsSimpleDateTime(comment.createdAt)})`
                        : ''}
                    </Text>
                    <Divider orientation={'horizontal'} borderColor={'teachHub.black'} />
                    <MarkdownText markdown={comment.body} />
                  </Stack>
                </Flex>
              </Flex>
            )
          );
        })}
      </Stack>
    </Modal>
  );
};

const SubmissionPageContainer = () => {
  const courseContext = useUserContext();
  const { submissionId } = useParams();

  if (!courseContext.courseId || !submissionId) {
    return null;
  }

  return <SubmissionPage context={courseContext} submissionId={submissionId} />;
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
