export const createTeamActivityPath = (clubId: string, teamId: string, activityId: string) =>
  `/clubs/${clubId}/teams/${teamId}/activities/${activityId}`;

export const createTeamActivitiesPath = (clubId: string, teamId: string) => `/clubs/${clubId}/teams/${teamId}/activities`;
