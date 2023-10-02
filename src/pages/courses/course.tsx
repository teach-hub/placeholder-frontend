import React, { ChangeEvent, Suspense, useEffect, useState } from 'react';
import { createSearchParams, useNavigate } from 'react-router-dom';
import { useLazyLoadQuery, useMutation } from 'react-relay';

import {
  Flex,
  HStack,
  Modal as ChakraModal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Stack,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import {
  AlertIcon,
  AlertIcon as CloseIcon,
  CheckCircleIcon as CheckIcon,
  MarkGithubIcon,
  MortarBoardIcon,
  PersonIcon,
  TerminalIcon,
} from '@primer/octicons-react';
import Heading from 'components/Heading';
import StatCard from 'components/StatCard';
import Button from 'components/Button';
import Box from 'components/Box';
import PageDataContainer from 'components/PageDataContainer';

import CourseSetOrganizationMutationDef from 'graphql/CourseSetOrganizationMutation';
import CourseInfoQueryDef from 'graphql/CourseInfoQuery';

import CourseSetDescriptionMutationDef from 'graphql/CourseSetDescriptionMutation';

import useToast from 'hooks/useToast';
import { CourseContext, Permission, useUserContext } from 'hooks/useUserCourseContext';

import type {
  CourseInfoQuery,
  CourseInfoQuery$data,
} from '__generated__/CourseInfoQuery.graphql';

import type {
  CourseSetOrganizationMutation,
  CourseSetOrganizationMutation$data,
} from '__generated__/CourseSetOrganizationMutation.graphql';

import type {
  CourseSetDescriptionMutation,
  CourseSetDescriptionMutation$data,
} from '__generated__/CourseSetDescriptionMutation.graphql';
import { StackedBarChart } from 'components/charts/StackedBarChart';
import {
  AssignmentSubmissionStatisticsData,
  getAssignmentSubmissionStatusDataset,
} from 'statistics/submissions';
import MarkdownText from 'components/MarkdownText';
import { FormControl } from 'components/FormControl';
import InputField from 'components/InputField';
import { Nullable, Optional } from 'types';
import EditIcon from 'icons/EditIcon';
import { ButtonWithIcon } from 'components/ButtonWithIcon';
import { Modal } from 'components/Modal';
import Navigation from 'components/Navigation';
import { theme } from 'theme';
import Spinner from 'components/Spinner';

type CourseType = NonNullable<NonNullable<CourseInfoQuery$data['viewer']>['course']>;

type Props = {
  course: CourseType;
  availableOrganizations: NonNullable<
    CourseInfoQuery$data['viewer']
  >['availableOrganizations'];
  courseContext: CourseContext;
};

const CourseStatistics = ({ course, courseContext, availableOrganizations }: Props) => {
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const defaultOrganizationName = () => course.organization || '';
  const [organizationName, setOrganizationName] = useState(defaultOrganizationName());
  const [commitCourseSetOrganization] = useMutation<CourseSetOrganizationMutation>(
    CourseSetOrganizationMutationDef
  );

  const handleOrganizationChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setOrganizationName(event.target.value);
  };

  const handleGoToTeachers = () => {
    const search = `?${createSearchParams({ role: 'teacher' })}`;
    navigate({ pathname: 'users', search });
  };

  const handleGoToStudents = () => {
    const search = `?${createSearchParams({ role: 'student' })}`;
    navigate({ pathname: 'users', search });
  };

  const errored = () => course.organization === '' || course.organization === null;

  const organizationNames = availableOrganizations?.names || [];

  const handleOrganizationChangeCancel = () => {
    setOrganizationName(defaultOrganizationName());
    onClose();
  };

  const handleOrganizationChangeSubmit = () => {
    commitCourseSetOrganization({
      variables: {
        courseId: course.id,
        organizationName,
      },
      onCompleted: (response: CourseSetOrganizationMutation$data, errors) => {
        const data = response.setOrganization;
        if (!errors?.length && data) {
          toast({
            title: 'Organización actualizada!',
            status: 'info',
          });

          /* Update current course organization avoiding to reload */
          course = {
            ...course,
            organization: data.organization,
          };
        } else {
          const errorMessage = errors ? errors[0].message : null;
          toast({
            title: 'Error',
            description:
              `No se pudo configurar la organización` + errorMessage
                ? `: ${errorMessage}`
                : '',
            status: 'error',
          });
        }
        onClose();
      },
    });
  };

  return (
    <HStack margin="20px 0px" spacing="30px">
      <StatCard
        onClick={handleGoToTeachers}
        title="Profesores"
        stat={String(course.teachersCount)}
        icon={<MortarBoardIcon size="large" />}
      />
      <StatCard
        onClick={handleGoToStudents}
        title="Alumnos"
        stat={String(course.studentsCount)}
        icon={<PersonIcon size="large" />}
      />
      <StatCard
        onClick={() => navigate('assignments')}
        title="Trabajos Prácticos"
        stat={String(course.assignments.length)}
        icon={<TerminalIcon size="large" />}
      />
      {courseContext.userIsTeacher && (
        <StatCard
          onClick={() => {
            if (courseContext.userHasPermission(Permission.SetOrganization)) {
              onOpen();
            }
          }}
          title={'Organizacion de GitHub'}
          stat={!errored() ? <CheckIcon size="large" /> : <CloseIcon size="large" />}
          icon={<MarkGithubIcon size="large" />}
          color={!errored() ? 'green' : 'red'}
          border={'3px solid'}
          tooltipLabel={organizationName}
        />
      )}

      <ChakraModal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Configurar organización de GitHub</ModalHeader>
          <ModalBody>
            <Flex direction="column" gap="60px">
              {organizationNames.length === 0 ? (
                <Flex
                  direction={'column'}
                  alignItems={'center'}
                  justifyContent={'center'}
                >
                  <Box paddingBottom={'20px'}>
                    <AlertIcon size={'large'} />
                  </Box>
                  <Text>{'No hay organizaciones disponibles.'}</Text>
                  <Text>{'Revisar accesos otorgados en GitHub.'}</Text>
                </Flex>
              ) : (
                <Select
                  placeholder="Selecciona una opción"
                  value={organizationName}
                  onChange={handleOrganizationChange}
                >
                  {organizationNames.map(org => (
                    <option value={org} key={org}>
                      {org}
                    </option>
                  ))}
                </Select>
              )}
            </Flex>
          </ModalBody>
          <ModalFooter gap={'30px'}>
            <Button onClick={handleOrganizationChangeCancel} variant={'ghost'}>
              {'Cancelar'}
            </Button>
            <Button onClick={handleOrganizationChangeSubmit}>{'Guardar'}</Button>
          </ModalFooter>
        </ModalContent>
      </ChakraModal>
    </HStack>
  );
};

const CourseCharts = ({ course }: { course: CourseType }) => {
  const assignments = course.assignments || [];

  const nonGroupChartLabels: string[] = [];
  const groupChartLabels: string[] = [];
  const nonGroupData: AssignmentSubmissionStatisticsData[] = [];
  const groupChartData: AssignmentSubmissionStatisticsData[] = [];
  assignments.forEach(assignment => {
    const title = assignment.title || '';
    const assignmentSubmissionStatisticsData = {
      assignmentTitle: assignment.title || '',
      submissions: assignment.submissions.map(submission => {
        return {
          grade: submission.review?.grade,
          revisionRequested: submission.review?.revisionRequested,
        };
      }),
      nonExistentSubmissionsAmount: assignment.nonExistentSubmissions?.length || 0,
    };
    if (!assignment.isGroup) {
      nonGroupChartLabels.push(title);
      nonGroupData.push(assignmentSubmissionStatisticsData);
    } else {
      groupChartLabels.push(title);
      groupChartData.push(assignmentSubmissionStatisticsData);
    }
  });

  const nonGroupChartDataset = getAssignmentSubmissionStatusDataset(nonGroupData);
  const groupChartDataset = getAssignmentSubmissionStatusDataset(groupChartData);

  const CHART_WIDTH = '50vw';

  return (
    <Stack
      overflow={'hidden'}
      direction={'row'}
      gap={'20px'}
      justifyContent={'space-between'}
    >
      <Box width={CHART_WIDTH}>
        <StackedBarChart
          labels={nonGroupChartLabels}
          data={nonGroupChartDataset}
          title={'Estado Entregas - Individuales'}
        />
      </Box>
      <Box width={CHART_WIDTH}>
        <StackedBarChart
          labels={groupChartLabels}
          data={groupChartDataset}
          title={'Estado Entregas - Grupales'}
        />
      </Box>
    </Stack>
  );
};

const CourseViewContainer = () => {
  const courseContext = useUserContext();
  const courseId = courseContext.courseId;

  const data = useLazyLoadQuery<CourseInfoQuery>(CourseInfoQueryDef, {
    courseId: courseId || '',
  });

  const {
    isOpen: isOpenDescriptionModal,
    onOpen: onOpenDescriptionModal,
    onClose: onCloseDescriptionModal,
  } = useDisclosure();

  if (!courseId || !data.viewer || !data.viewer.course) {
    return null;
  }

  const course = data.viewer.course;
  const availableOrganizations = data.viewer.availableOrganizations;
  const description = course.description;

  return (
    <PageDataContainer>
      <Stack>
        <Stack direction="row" gap={'10px'} alignItems={'center'} marginBottom={'20px'}>
          <Heading>
            {course.name} - {course.subject.name}
          </Heading>
          {courseContext.userHasPermission(Permission.SetDescription) && (
            <ButtonWithIcon
              variant={'ghostBorder'}
              text={description ? 'Editar descripción' : 'Agregar descripción'}
              icon={EditIcon}
              onClick={onOpenDescriptionModal}
            />
          )}
        </Stack>
        <Heading size={'lg'}>
          Cuatrimestre {course.period} - {course.year}
        </Heading>
      </Stack>
      <Stack gap={'30px'}>
        {description && (
          <Box
            maxHeight={'30vh'}
            overflow={'auto'}
            maxWidth={'100%'}
            borderColor={theme.colors.teachHub.gray}
            borderWidth={1} // Put borders only on top and bottom
            borderLeftWidth={0}
            borderRightWidth={0}
            padding={5}
          >
            <MarkdownText markdown={description} />
          </Box>
        )}
        <CourseStatistics
          courseContext={courseContext}
          course={course}
          availableOrganizations={availableOrganizations}
        />
        {courseContext.userIsTeacher && <CourseCharts course={course} />}
      </Stack>
      <Modal
        isOpen={isOpenDescriptionModal}
        onClose={onCloseDescriptionModal}
        isCentered
        headerText={'Editar descripción del curso'}
        contentProps={{
          height: '50vh',
          minWidth: '40vw',
          maxWidth: '40vw',
        }}
      >
        <DescriptionModalContainer
          description={description}
          course={course}
          onClose={onCloseDescriptionModal}
        />
      </Modal>
    </PageDataContainer>
  );
};

const DescriptionModalContainer = ({
  description,
  course,
  onClose,
}: {
  description: Optional<Nullable<string>>;
  course: CourseType;
  onClose: () => void;
}) => {
  const toast = useToast();
  const [newDescription, setNewDescription] = useState<string>(description || '');
  const [showSpinner, setShowSpinner] = useState<boolean>(false);

  const [commitCourseSetDescription, commitCourseSetDescriptionInFlight] =
    useMutation<CourseSetDescriptionMutation>(CourseSetDescriptionMutationDef);

  useEffect(() => {
    if (commitCourseSetDescriptionInFlight) {
      setShowSpinner(true);
    } else {
      setShowSpinner(false);
    }
  }, [commitCourseSetDescriptionInFlight]);

  const handleDescriptionChangeSubmit = () => {
    commitCourseSetDescription({
      variables: {
        courseId: course.id,
        description: newDescription,
      },
      onCompleted: (response: CourseSetDescriptionMutation$data, errors) => {
        const data = response.setDescription;
        if (!errors?.length && data) {
          toast({
            title: 'Descripción actualizada!',
            status: 'success',
          });

          /* Update current course avoiding to reload */
          course = {
            ...course,
            description: newDescription,
          };
        } else {
          const errorMessage = errors ? errors[0].message : null;
          toast({
            title: 'Error',
            description:
              `No se pudo actualizar la descripción` + errorMessage
                ? `: ${errorMessage}`
                : '',
            status: 'error',
          });
        }
        onClose();
      },
    });
  };

  return (
    <Flex direction={'column'} height={'100%'} justifyContent={'space-between'}>
      <Spinner
        isOpen={showSpinner}
        onClose={() => {
          setShowSpinner(false);
        }}
      />
      <FormControl helperText={'Acepta formato markdown'} label={''} height={'70%'}>
        <InputField
          id={'courseDescription'}
          value={newDescription}
          onChange={event => setNewDescription(event.target.value)}
          placeholder={'Descripción del curso'}
          type={'text'}
          multiline={true}
          height={'100%'}
        />
      </FormControl>
      <Flex direction={'row'} gap={'30px'} justifyContent={'flex-end'}>
        <Button onClick={onClose} variant={'ghostBorder'}>
          Cancelar
        </Button>
        <Button onClick={handleDescriptionChangeSubmit}>Guardar</Button>
      </Flex>
    </Flex>
  );
};

export default () => {
  return (
    <Navigation>
      <Suspense>
        <CourseViewContainer />
      </Suspense>
    </Navigation>
  );
};
