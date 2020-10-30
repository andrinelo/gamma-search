import React from "react";
import {Alert, AlertTitle} from "@material-ui/lab";

// Warning component for when the user is about to edit a previous part of the query
function EditWarning() {
  return(
    <Alert severity="warning">
      <AlertTitle>Warning</AlertTitle>
      You are about to edit an earlier part of the query. Proceeding <br/> 
      will remove all your subsequent filters and explored relations.
    </Alert>
  )
}

export default EditWarning;