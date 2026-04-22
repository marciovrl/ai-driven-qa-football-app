export type TeamTitle = {
  competition: string;
  year: number;
};

export type Team = {
  id: number;
  name: string;
  address: string | null;
  nickname: string | null;
  titles: TeamTitle[] | null;
};

export type CreateTeamInput = {
  name?: string;
  address?: string | null;
  nickname?: string | null;
  titles?: TeamTitle[] | null;
};
