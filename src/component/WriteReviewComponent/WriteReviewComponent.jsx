
import { useEffect, useState } from "react";
import ButtonComponent from "../ButtonComponent/ButtonComponent";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Rate, Input } from 'antd';
import * as Yup from 'yup';

const WriteReviewComponent = ({
  handleReview,
  initialValues,
  handleChangeInitialValues
}) => {
  console.log(initialValues);
  const onSubmit = (values, { resetForm }) => {
    handleChangeInitialValues(values)
    console.log(values);
    resetForm();
  };

  const validationSchema = Yup.object().shape({
    rate: Yup.number().required('Bạn cần phải đánh giá sao'),
    review: Yup.string().required('Bạn cần phải để lại đánh giá'),
  });

  
    // const [newRate, setNewrate] = useState(rate)
    // const [newReview, setNewReview] = useState(review)
    // useEffect(()=> {
    //     setNewrate(rate)
    //     setNewReview(review)
       
    // }, [review, rate])
    // console.log(review, rate);
  return (
    <div className="p-5">
     <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {({ values,  }) => (
        <Form>
          <div>
            <label htmlFor="rate" className="lg:text-2xl sm:text-xl xs:text-lg">Đánh giá sao:</label>
            <br/>
            <Field name="rate">
              {({ field, form }) => (
                <Rate
                  {...field}
                  // allowHalf
                  defaultValue={0}
                  value={values.rate}
                  onChange={(value) => {
                    form.setFieldValue('rate', value);
                    // field.onChange({ target: { name: 'rate', value } });
                  }}
                />
              )}
            </Field>
            <ErrorMessage name="rate" className="lg:text-2xl sm:text-xl xs:text-lg"/>
          </div>
          <div>
            <label htmlFor="review" className="lg:text-2xl sm:text-xl xs:text-lg">Đánh giá:</label>
            <Field name="review">
              {({ field, form }) => (
                <Input.TextArea
                  {...field}
                  value={values.review}
                  onChange={(e) => form.setFieldValue('review', e.target.value)}
                />
              )}
            </Field>
            <ErrorMessage name="review" component="span" className="error-message lg:text-2xl sm:text-xl xs:text-lg"/>
          </div>
          <ButtonComponent
            textButton={"Gửi đánh giá"}
            htmlType="submit"
            className="mt-3"
          />

        </Form>
      )}
    </Formik>
    </div>
  );
};

export default WriteReviewComponent;
