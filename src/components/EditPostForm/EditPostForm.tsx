import * as Yup from "yup";
import { ErrorMessage, Field, Form, Formik, FormikHelpers} from "formik";

import css from "./EditPostForm.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editPost } from "../../services/postService.ts";

interface EditPostFormProps {
  initialData: { id: number, title: string; body: string };
  onClose: () => void;
}

const validationSchema = Yup.object({
  title: Yup.string()
    .min(3, 'Minimum 3 symbols')
    .max(500, 'Maximum 500 symbols')
    .required('Field is required'),
  body: Yup.string()
    .max(500, 'Maximum 500 symbols')
    .required('Field is required'),
})

export default function EditPostForm({ initialData, onClose }: EditPostFormProps) {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: editPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
      alert('Post edited successfully!');
      onClose();
    }
  })

  const handleSubmit = (
    values: { title: string; body: string },
    actions: FormikHelpers<{ title: string; body: string}>
  ) => {
    mutate({id: initialData.id, ...values})
  }

  return (
    <Formik initialValues={{title: initialData.title, body: initialData.body}} onSubmit={handleSubmit} validationSchema={validationSchema}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field id="title" type="text" name="title" className={css.input} />
          <ErrorMessage name="title" component="span" className={css.error} />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="body">Content</label>
          <Field id="body" as="textarea" name="body" rows={8} className={css.textarea} />
          <ErrorMessage name="body" component="span" className={css.error} />
        </div>

        <div className={css.actions}>
          <button type="button" className={css.cancelButton} onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className={css.submitButton} disabled={isPending}>
            Edit post
          </button>
        </div>
      </Form>
    </Formik>
  );
}
