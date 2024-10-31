import { Button } from "@components/Button";
import { TextField } from "@components/TextFields";
import { useForm } from "@hooks/useForm";
import forumService from "@service/forum.service";
// import EasyMDE from "easymde";
import { useEffect, useRef } from "preact/compat";

interface FormType {
  content: string;
  title: string;
}

function ForumEditor() {
  const editorRef = useRef<HTMLTextAreaElement>(null);
  const { onSubmit, keys } = useForm<FormType>({
    values: { content: {}, title: {} },
    async onSubmit(values, context) {
      console.log(values);
      const res = await forumService.create(values);
      console.log(res);
    },
  });

  useEffect(() => {
    if (editorRef.current) {
      //@ts-ignore
      new EasyMDE({ element: editorRef.current });
    }
  }, []);

  return (
    <form class="flex flex-col gap-y-3" onSubmit={onSubmit}>
      <Button>Create</Button>
      <TextField placeholder="Title" name={keys.title} />
      <textarea
        placeholder="Content"
        name={keys.content}
        ref={editorRef}
      ></textarea>
    </form>
  );
}

export default ForumEditor;
