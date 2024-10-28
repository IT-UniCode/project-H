import type { IComments } from "src/interfaces";

export interface CommentsProps {
  comment: IComments;
}

function Comments({ comment }: CommentsProps) {
  const date = new Date(comment.createdAt);

  return (
    <section class="border px-2 py-1 rounded-md">
      <p class="text-xl">User: {comment.user.name}</p>
      <p class="text-xs">
        Date created: {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </p>
      <div class="bg-black w-full h-[1px] my-1"></div>
      <p class="text-xl">{comment.content}</p>
    </section>
  );
}

export default Comments;
