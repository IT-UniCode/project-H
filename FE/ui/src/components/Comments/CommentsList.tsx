import { useEffect, useState } from "preact/hooks";
import Comments from "./Comments";
import { TextField } from "@components/TextFields";
import commentService from "@service/comment.service";
import type { IComments } from "@interfaces/comments";
import Button from "@components/Button";
import type { FormEvent } from "preact/compat";

export interface CommentsListProps {
  documentType: string;
  documentId: string;
}

function CommentsList({ documentId, documentType }: CommentsListProps) {
  const [comments, setComments] = useState<IComments[]>([]);

  async function getComments() {
    const res = await commentService.getAll({ documentId, documentType });
    setComments(res);
  }

  async function submitCreateComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    console.log("Form event", Array.from(form.entries()));
  }

  useEffect(() => {
    getComments();
  }, []);

  return (
    <section aria-label="comment block">
      <form class="flex flex-col gap-y-4" onSubmit={submitCreateComment}>
        <TextField type="text" placeholder="Comments" name="content" />
        <Button class=" justify-self-end ml-auto">Submit</Button>
      </form>

      <section aria-label="comment list" class="flex flex-col gap-y-3 px-4">
        {comments.map((v) => (
          <Comments comment={v} />
        ))}
      </section>
    </section>
  );
}

export default CommentsList;
