import { useEffect, useState } from "preact/hooks";
import Comments from "./Comments";
import { TextField } from "@components/TextFields";
import commentService from "@service/comment.service";
import type { IComments } from "@interfaces/comments";
import Button from "@components/Button";
import { useAuth } from "@hooks/useAuth";
import { useForm } from "@felte/preact";

export interface CommentsListProps {
  documentType: string;
  documentId: string;
}

function CommentsList({ documentId, documentType }: CommentsListProps) {
  const [comments, setComments] = useState<IComments[]>([]);
  const { isAuth } = useAuth();
  const { form } = useForm({
    async onSubmit(values, context) {
      if (isAuth && values.content) {
        const res = await commentService.create({
          content: values.content,
          documentType,
          documentId,
        });
        context.reset();
        await getComments();
      }
    },
  });

  async function getComments() {
    const res = await commentService.getAll({ documentId, documentType });

    setComments(res.data);
  }

  useEffect(() => {
    getComments();
  }, []);

  return (
    <section aria-label="comment block">
      <p class="text-2xl mb-2">Comments</p>
      {isAuth && (
        <form ref={form} class="flex flex-col gap-y-4 mb-8">
          <TextField type="text" placeholder="Comments" name="content" />
          <Button class=" justify-self-end ml-auto">Submit</Button>
        </form>
      )}

      <section aria-label="comment list" class="flex flex-col gap-y-3 px-4">
        {comments?.map((v) => <Comments comment={v} />)}
      </section>
    </section>
  );
}

export default CommentsList;
