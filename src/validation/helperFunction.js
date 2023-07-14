export const validateHandler= async(schema,formValues,setErrors) =>{
    try {
      await schema.validate(formValues, { abortEarly: false });
      // Validation passed, proceed with form submission
      // Make a request to your backend to store the data
      setErrors(()=>{});
    } catch (error) {
      if (error.name === "ValidationError") {
        const newErrors = {};
        error.inner.forEach((validationError) => {
          newErrors[validationError.path] = validationError.message;
        });
        setErrors(()=>(newErrors));
      }
    }
}