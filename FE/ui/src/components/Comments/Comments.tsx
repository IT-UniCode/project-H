import type { IComments } from "src/interfaces";

export interface CommentsProps {
  comment: IComments;
}

function Comments({ comment }: CommentsProps) {
  return (
    <section>
      <p>Name</p>
      <p>Date created: {comment.createdAt} </p>
      <p>{comment.content}</p>
    </section>
  );
}

export default Comments;
