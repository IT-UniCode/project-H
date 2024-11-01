import { Button } from "@components/Button";
import { TextField } from "@components/TextFields";
import { useForm } from "@hooks/useForm";
import forumService from "@service/forum.service";
import { navigate } from "astro:transitions/client";
import { useEffect, useRef } from "preact/compat";
import { routes } from "src/routes";

interface FormType {
  content: string;
  title: string;
}

function ForumEditor() {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { onSubmit, keys } = useForm<FormType>({
    values: { content: {}, title: {} },
    async onSubmit(values, context) {
      if (!values.content || !values.title) {
        return;
      }
      try {
        await forumService.create(values);
        context.reset();
        navigate(routes.Forum);
      } catch (e) {}
    },
  });

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

    if (!editorRef.current.style.display) {
      //@ts-ignore
      new EasyMDE({ element: editorRef.current, forceSync: true });
    }
  }, []);

  return (
    <form class="flex flex-col gap-y-3" onSubmit={onSubmit}>
      <div class="flex gap-x-2">
        <TextField placeholder="Title" name={keys.title} />
        <Button>Create</Button>
      </div>
      <textarea
        placeholder="Content"
        name={keys.content}
        ref={editorRef}
      ></textarea>
    </form>
  );
}

export default ForumEditor;
