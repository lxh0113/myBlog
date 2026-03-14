export interface CooperateArticle {
  id: number | null;
  title: string | null;
  content: string | null;
  savedBy: number | null;
  createdBy?: number | null;
  version: string | null;
  time: string | null;
}
