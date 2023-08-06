import { graphql } from 'babel-plugin-relay/macro';

export default graphql`
  query AddSubmissionQuery($courseId: ID!) {
    viewer {
      id
      course(id: $courseId) {
        id
        assignments {
          id
          viewerAlreadyMadeSubmission
          isOpenForSubmissions
          title
          isGroup
        }
        viewerGroupParticipants: viewerGroups {
          id
          group {
            id
            name
          }
          assignmentId
        }
      }
      repositories(courseId: $courseId) {
        id
        name
      }
      openPullRequests(courseId: $courseId) {
        id
        title
        url
        repositoryName
      }
    }
  }
`;
