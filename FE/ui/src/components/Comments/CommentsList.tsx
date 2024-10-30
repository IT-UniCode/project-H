import { useEffect, useState } from "preact/hooks";
import Comments from "./Comments";
import { TextField } from "@components/TextFields";
import commentService from "@service/comment.service";
import type { IComments } from "@interfaces/comments";
import Button from "@components/Button/Button";
import { useAuth } from "@hooks/useAuth";
import { useForm } from "@hooks/useForm";
import type { ResponseBody } from "@interfaces/index";

export interface CommentsListProps {
  documentType: string;
  documentId: string;
}

function CommentsList({ documentId, documentType }: CommentsListProps) {
  const [comments, setComments] = useState<{
    response: ResponseBody<IComments>;
    pagination: {
      page: number;
      pageSize: number;
    };
  }>({
    response: {
      data: [],
      meta: { pagination: { page: 1, pageSize: 3, pageCount: 0, total: 0 } },
    },
    pagination: { page: 1, pageSize: 3 },
  });
  const { isAuth } = useAuth();
  const { onSubmit: useOnSubmit, keys } = useForm<{ content: string }>({
    values: {
      content: {},
    },
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
    const res = await commentService.getAll({
      documentId,
      documentType,
      pageSize: comments.pagination.page * comments.pagination.pageSize,
    });

    setComments((prev) => ({
      ...prev,
      response: res,
    }));
  }

  async function loadMoreComments() {
    const nextPage = comments?.pagination.page + 1;

    const res = await commentService.getAll({
      documentId,
      documentType,
      page: nextPage,
      pageSize: comments.pagination.pageSize,
    });

    setComments((prev) => ({
      ...prev,
      response: { data: [...prev.response.data, ...res.data], meta: res.meta },
      pagination: {
        ...prev.pagination,
        page: nextPage,
      },
    }));
  }

  useEffect(() => {
    getComments();
  }, []);

  return (
    <section aria-label="block">
      <p class="text-2xl mb-2">Comments</p>
      {isAuth && (
        <form onSubmit={useOnSubmit} class="flex flex-col gap-y-4 mb-8">
          <TextField type="text" placeholder="Comments" name={keys.content} />
          <Button class=" justify-self-end ml-auto">Submit</Button>
        </form>
      )}

      <section aria-label="comment list" class="flex flex-col gap-y-3 px-4">
        {comments?.response.data.map((v) => <Comments comment={v} />)}
      </section>

      <div class="flex justify-center mt-4">
        <button
          disabled={
            comments.pagination.page + 1 >
            Math.ceil(
              comments.response.meta.pagination.total /
                comments.pagination.pageSize,
            )
          }
          class="bg-blue-500 text-white px-3 py-2 rounded mx-auto"
          onClick={loadMoreComments}
        >
          More + {comments.pagination.pageSize}
        </button>
      </div>
    </section>
  );
}

export default CommentsList;
