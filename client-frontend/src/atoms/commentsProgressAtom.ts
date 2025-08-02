import { atom } from "jotai";

interface CommentProgresItem {
  competencyId: number;
  comment?: string;
}

const commentsProgressAtom = atom<CommentProgresItem[]>([]);

const setCommentsProgress = atom(
  null,
  (_, set, rates: CommentProgresItem[]) => {
    set(commentsProgressAtom, rates ?? []);
  },
);

const setCommentProgress = atom(null, (get, set, rate: CommentProgresItem) => {
  const prevRates = get(commentsProgressAtom);
  if (!prevRates.find((r) => r.competencyId === rate.competencyId)) {
    set(commentsProgressAtom, [...prevRates, rate]);
    return;
  } else {
    set(commentsProgressAtom, (prev) =>
      prev.map((r) => (r.competencyId === rate.competencyId ? rate : r)),
    );
  }
});

export { setCommentsProgress, setCommentProgress, commentsProgressAtom };
