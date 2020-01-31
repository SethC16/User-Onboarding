import { withFormik, Form, Field } from "formik";
import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import axios from "axios";


// Function created and Formik props passed in.
const OnboardForm = ({ values, errors, touched, status }) => {
 
// local state that holds successful form submission data    
  const [person, setPerson] = useState([]);

// Listens for status changes to update person's state
  useEffect(() => {

// if status has content then render function setPerson, uses the spread to create a new array with all of the person's previous values + the new Obj from the APi stored in status. Reads the current value of person, and then uses it to create a new array.    
    status && setPerson(person => [...person, status]);
  }, [status]);

  return (
    <div className="onboard-form">

      {/*Automatically applies handleSumbit from withFormik*/}  
      <Form>
        <label>
          Name:
          {/* name is the key within values*/}
          <Field
            id="people"
            type="text"
            name="people"
            placeHolder="Enter Name"
          />
          {/* touched is if input has been visited, errors are captured from Yup validation, if it has been visited && errors exist for that input => render JSX to show errors */}
          {touched.people && errors.people && (
            <p className="errors">{errors.people}</p>
          )}
        </label>
        <label>
          Email:
          <Field
            id="email"
            type="text"
            name="email"
            placeHolder="Enter Email"
          />
          {touched.email && errors.email && (
            <p className="errors">{errors.email}</p>
          )}
        </label>
        <label>
          Password:
          <Field
            id="password"
            type="password"
            name="password"
            placeHolder="Enter Password"
          />
          {touched.password && errors.password && (
            <p className="errors">{errors.password}</p>
          )}
        </label>
        <label>
          Terms of Service:
          <Field 
          type="checkbox" 
          name="tos" 
          checked={values.tos} />
        </label>
        <button type="submit">Submit</button>
      </Form>
      {person.map(persons => {
        return (
          <ul key={persons.id}>
            <li>Name: {persons.people}</li>
            <li>Email: {persons.email}</li>
          </ul>
        );
      })}
    </div>
  );
};

const FormikOnboardForm = withFormik({
 // props from <OnboardForm /> in app are in props param   
  mapPropsToValues(props) {
    // set initial state of form to value from parent component OR the initial value (after ||)
    return {
      people: props.people || "",
      email: props.email || "",
      password: props.password || "",
      tos: props.tos || false
    };
  },

  // Declare shape and requirement of values object from state
  validationSchema: Yup.object().shape({
    // passing a string in required makes a custom inline error msg  
    people: Yup.string().required("Name is required"),
    email: Yup.string().required("Email is required"),
    password: Yup.string().required("Password is required"),
    tos: Yup.bool().oneOf([true], "Need to Accept Terms")
  }),

  // passed through props to form component in formik, fires when button type="submit" is fired, values = state of form, formik-bag is second param,  in formikbag: setStatus - sends API resposne to OnboardForm) and resetForm - clears form when called.
  handleSubmit(values, { setStatus, resetForm }) {
    axios
      .post("https://reqres.in/api/users", values)
      .then(response => {
        console.log("Success", response);
        // sends a status update through props in OnboardForm with value as res.data content
        setStatus(response.data);
        // clears form input, from formik-bag
        resetForm();
      })
      .catch(err => console.log(err.response));
  }
})(OnboardForm);

export default FormikOnboardForm;
