export const createTeamActivityPath = (clubId: string, teamId: string, activityId: string) =>
  `/clubs/${clubId}/teams/${teamId}/activities/${activityId}`;
