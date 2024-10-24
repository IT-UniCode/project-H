function CommentsList() {
  const comments = ["sd"];

  return (
    <section>
      // Textfields
      {comments.map((v) => v)}
    </section>
  );
}

export default CommentsList;
